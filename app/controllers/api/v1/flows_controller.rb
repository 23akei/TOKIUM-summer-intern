module Api
  module V1
    class FlowsController < ApplicationController
      # POST /api/v1/flows
      def create
        flow_service = FlowService.new
        created_id, _ = flow_service.create_flow(createflow_params)

        if created_id
          render json: {id: created_id}, status: :created
        else
          render json: { error: 'Flow not created' }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/flows
      def index
        begin
          flow_service = FlowService.new
          flows = flow_service.get_all_flows
          render json: flows, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Flows not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/flows/:id
      def show
        begin
          flow_service = FlowService.new
          flow = flow_service.get_flow_by_id(params[:id])
          render json: flow, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Flow not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/flows/condition_keys
      def condition_keys
        begin
          keys = Shinsei.column_names
          render json: {key: keys}, status: :ok
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/flows/condition_comparators
      def condition_comparators
        begin
          comparators = Comparision::OPERATORS.keys
          render json: {comparators: comparators}, status: :ok
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      # shape of the params: list of condition and list of approvers
      # {
      #  "name": "string",
      #   "flow": [
      #     {
      #       "condition": {
      #         "key": "string",
      #         "value": "string",
      #         "condition": "string"
      #       }
      #     },
      #     {
      #       "approvers": [
      #         {
      #           "id": 0,
      #           "name": "string",
      #           "role": "string"
      #         }
      #       ]
      #     }
      #   ]
      # }
      def createflow_params
        flow_params = params.require(:flow).map do |flow_item|
          if flow_item.key?(:condition)
            {
              "condition" =>
                flow_item.require(:condition).permit(:key, :value, :condition)
            }
          elsif flow_item.key?(:approvers)
            {
              "approvers" =>
                flow_item.require(:approvers).map do |approver|
                  approver.permit(:id, :name, :role)
                end
            }
          else
            raise ActionController::ParameterMissing, "Invalid flow schema"
          end
        end

        name = params.require(:name)

        return { name: name, flow: flow_params }
      end
    end
  end
end
