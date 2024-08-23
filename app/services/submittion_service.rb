class SubmittionService
  def invoke_flow(submission)
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
      if present_flow.key?(:condition)
        # when condition
        condition_result = process_condition(present_flow[:condition], shinsei)
        if condition_result
          # when condition is satisfied, the flow is continued to the next step
          present_step += 1
        else
          # when condition is not satisfied, the flow is ended with success
          submission.status = 'success'
          submission.save
          return {id: submission.id}, :ok
      elsif present_flow.key?(:approver)
        # when approver
        approver = present_flow[:approver]
      end
    end
  end

  def process_condition(condition, shinsei)
    include ComparisonOperators
    case condition.condition
    when OPERATORS[:neq]
      return shinsei[condition.key] != condition.value
    when OPERATORS[:eq]
      return shinsei[condition.key] == condition.value
    when OPERATORS[:ge]
      return shinsei[condition.key] >= condition.value
    when OPERATORS[:le]
      return shinsei[condition.key] <= condition.value
    when OPERATORS[:gt]
      return shinsei[condition.key] > condition.value
    when OPERATORS[:lt]
      return shinsei[condition.key] < condition.value
    end
    raise 'Invalid condition'
  end
end