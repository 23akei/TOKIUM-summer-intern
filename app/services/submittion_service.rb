class SubmittionService
  def proceed_flow(submittion)
    # check the flow
    begin
      shinsei = Shinsei.find_by(id: submittion.shinsei_id)
      if shinsei.nil?
        return { error: 'Shinsei not found' }, :not_found
      end
      flow = Flow.find_by(id: shinsei.flow_id)
      if flow.nil?
        return { error: 'Flow not found' }, :not_found
      end
    rescue ActiveRecord::RecordNotFound
      return { error: 'Flow not found' }, :not_found
    rescue => e
      return { error: e.message }, :internal_server_error
    end
    conditions = Condition.where(flow_id: flow.id)
    approvers = Approver.where(flow_id: flow.id)

    s_conditions = conditions.map do |condition|
      {step: condition.step, condition: condition}
    end
    _s_approvers = approvers.map do |approver|
      {step: approver.step, approver: approver}
    end
    s_approvers = _s_approvers.group_by { |approver| approver[:step] }.map do |step, approvers|
      { step: step, approver: approvers }
    end

    # sort conditions and approvers by step
    conditions_and_approvers = s_conditions + s_approvers
    conditions_and_approvers.sort_by! { |ca| ca[:step] }

    present_step = submittion.step
    # succeed the flow
    loop do
      # pick up the present step
      present_flow = conditions_and_approvers.find do |ca|
        ca[:step] == present_step
      end

      # if the present step is not found, the flow is ended with success
      if present_flow.nil?
        submittion.status = 'approve'
        break
      end

      if present_flow.key?(:condition)
        # when condition
        condition_result = process_condition(present_flow[:condition], shinsei)
        if condition_result
          # when condition is satisfied, the flow is continued to the next step
          present_step += 1
          next
        else
          # when condition is not satisfied, the flow is ended with success
          submittion.status = 'approve'
          break
        end
      elsif present_flow.key?(:approver)
        # when approver
        approver_result, pendings = process_approver(present_flow[:approver], submittion, present_step)
        if pendings
          # when any approver is pending, the flow is ended with pending
          submittion.status = 'pending'
          break
        elsif approver_result
          # when all approvers approve, the flow is continued to the next step
          present_step += 1
          next
        else
          # when any approver disapproves, the flow is ended with failure
          submittion.status = 'reject'
          break
        end
      end
    end

    # update the submittion
    submittion.step = present_step
    if present_step > conditions_and_approvers.length
      submittion.status = 'approve'
    end
    submittion.save

    # fire the hook
    if submittion.status == 'approve'
      webhook_service = WebhookService.new
      webhook_service.fire_event(Webhookentry::ENTRY[:submittion], submittion.user_id)
    end

    return {id: submittion.id}, :ok
  end

  def process_condition(condition, shinsei)
    # get column type of the condition key
    column_type = Shinsei.columns_hash[condition.key].type
    # convert the value to the column type
    val = case column_type
    when :integer
      condition.value.to_i
    when :string
      condition.value
    when :datetime
      Time.parse(condition.value)
    end

    shin_val = shinsei[condition.key]
    shin_val = case column_type
    when :integer
      shin_val.to_i
    when :string
      shin_val
    when :datetime
      Time.parse(shin_val)
    end

    # compare the value with the condition
    case condition.condition
    when Comparision::OPERATORS[:neq]
      return shin_val != val
    when Comparision::OPERATORS[:eq]
      return shin_val == val
    when Comparision::OPERATORS[:ge]
      return shin_val >= val
    when Comparision::OPERATORS[:le]
      return shin_val <= val
    when Comparision::OPERATORS[:gt]
      return shin_val > val
    when Comparision::OPERATORS[:lt]
      return shin_val < val
    end
    raise 'Invalid condition'
  end

  def process_approver(approvers, submittion, present_step)
    result = true
    pendings = false

    # convert single approver to a list
    approvers = [approvers] if approvers.is_a?(Approver)

    approver_ids = approvers.map { |app| app[:approver].user_id }
    existing_approvals = Approval.where(approved_user_id: approver_ids, submittion_id: submittion.id, step: present_step).index_by(&:approved_user_id)

    approvers.each do |app|
      approver = app[:approver]
      approval = existing_approvals[approver.user_id]

      if approval.nil?
        new_approval = Approval.new(
          approved_user_id: approver.user_id,
          submittion_id: submittion.id,
          shinsei_id: submittion.shinsei_id,
          step: present_step,
          status: 'pending'
        )
        new_approval.save
        approval = new_approval

        # fire the hook
        webhook_service = WebhookService.new
        webhook_service.fire_event(Webhookentry::ENTRY[:approve], approval.approved_user_id)
      end

      result &&= (approval.status == 'approve')
      pendings ||= (approval.status == 'pending')
    end
    return result, pendings
  end
end