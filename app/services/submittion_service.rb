class SubmittionService
  def proceed_flow(submission)
    # check the flow
    begin
      shinsei = Shinsei.find_by(id: submission.shinsei_id)
      flow = Flow.find_by(id: shinsei.flow_id)
      conditions = Condition.where(flow_id: flow.id)
      approvers = Approver.where(flow_id: flow.id)
    rescue ActiveRecord::RecordNotFound
      return { error: 'Flow not found' }, :not_found
    rescue => e
      return { error: e.message }, :internal_server_error
    end

    s_conditions = conditions.map do |condition|
      {step: condition.step, condition: condition}
    end
    s_approvers = approvers.map do |approver|
      {step: approver.step, approver: approver}
    end
    # sort conditions and approvers by step
    conditions_and_approvers = s_conditions + s_approvers
    conditions_and_approvers.sort_by! { |ca| ca[:step] }

    present_step = submission.step
    # succeed the flow
    loop do
      # pick up the present step
      present_flow = conditions_and_approvers.find do |ca|
        ca[:step] == present_step
      end

      # if the present step is not found, the flow is ended with success
      if present_flow.nil?
        submission.status = 'success'
        break
      end

      if present_flow.key?(:condition)
        # when condition
        condition_result = process_condition(present_flow[:condition], shinsei)
        if condition_result
          # when condition is satisfied, the flow is continued to the next step
          present_step += 1
        else
          # when condition is not satisfied, the flow is ended with success
          submission.status = 'success'
          break
      elsif present_flow.key?(:approver)
        # when approver
        approver_result, pendings = process_approver(present_flow[:approver], submission)
        if pendings
          # when any approver is pending, the flow is ended with pending
          submission.status = 'pending'
          break
        elsif approver_result
          # when all approvers approve, the flow is continued to the next step
          present_step += 1
        else
          # when any approver disapproves, the flow is ended with failure
          submission.status = 'failure'
          break
        end
      end
    end

    # update the submission
    submission.step = present_step
    submission.save
    return {id: submission.id}, :ok
  end

  def process_condition(condition, shinsei)
    case condition.condition
    when Comparision::OPERATORS[:neq]
      return shinsei[condition.key] != condition.value
    when Comparision::OPERATORS[:eq]
      return shinsei[condition.key] == condition.value
    when Comparision::OPERATORS[:ge]
      return shinsei[condition.key] >= condition.value
    when Comparision::OPERATORS[:le]
      return shinsei[condition.key] <= condition.value
    when Comparision::OPERATORS[:gt]
      return shinsei[condition.key] > condition.value
    when Comparision::OPERATORS[:lt]
      return shinsei[condition.key] < condition.value
    end
    raise 'Invalid condition'
  end

  def process_approver(approvers, shinsei)
    result = true
    pendings = false
    approvers.each do |approver|
      # find approval for this approver
      approvals = Approval.find_by(user_id: approver.user_id, shinsei_id: shinsei.id, step: submission.step)
      # if returns vacant list, create approval object
      if approvals.empty?
        approval = Approval.new(
          user_id: approver.user_id,
          shinsei_id: shinsei.id,
          step: submission.step,
          status: 'pending'
        )
        approval.save
      end
      # check the approval status
      result &&= (approval.status == 'approve')
      pendings ||= (approval.status == 'pending')
    end
    return result, pendings
  end
end