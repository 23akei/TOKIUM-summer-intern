module Api
  module V1
    class ApprovalsController < ApplicationController
      # PUT /api/v1/approval/:id
      def update
        begin
          approval = Approval.find_by(id: params[:id])
          if approval.update(approval_params)
            # proceed the flow
            submittion_service = SubmittionService.new
            ret, status = submittion_service.proceed_flow(created)
            if status != :ok
              render json: { error: ret }, status: status
            end
            render json: {id: approval.id}, status: :ok
          else
            render json: approval.errors, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Approval not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/approvals/user/:id
      def get_applications_by_user_needs_to_approve
        begin
          approvals = Approval.where(approved_user_id: params[:id], status: 'pending')
          render json: approvals, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Approvals not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def approval_params
        params.require(:approval).permit(:shinsei_id, :step, :approved_user_id, :status)
      end
    end
  end
end