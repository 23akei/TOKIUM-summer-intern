class FlowService
  def create_flow(createflow_params)
    # create Flow first, then iterate through the approvers and conditions
    flow = Flow.new(name: createflow_params[:name])
    if flow.save != true
      return nil, "Failed to create flow object"
    end

    flow_contents = createflow_params[:flow]
    print("Flow contents:", flow_contents, "\n")

    step = 1
    flow_contents.each do |flow_params|
      print("Flow prams:", flow_params.class, "\n")
      # check if the flow_params is hash or list
      if flow_params["approvers"]
        approvers = flow_params["approvers"]
        approvers.each do |approver_params|
          print("Approver params:", approver_params)
          approver = Approver.new(
            flow_id: flow["id"].to_i,
            user_id: approver_params["id"].to_i,
            step: step
          )
          if approver.save != true
            return nil, "Failed to create approver object"
          end
        end
      elsif flow_params["condition"]
        cond = flow_params["condition"]
        condition = Condition.new(
          flow_id: flow["id"].to_i,
          key: cond["key"],
          value: cond["value"],
          condition: cond["condition"],
          step: step
        )
        if condition.save != true
          return nil, "Failed to create condition object"
        end
      end
      step += 1
    end

    return flow.id, "Successfully created flow"
  end

  def get_all_flows
    all_flows = Flow.all
  end

  def get_flow_by_id(id)
    @flow.find_by(id: id)
  end
end
