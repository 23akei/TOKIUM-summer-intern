module Api
  module V1
    class ApprovalsController < ApplicationController
      # POST /api/v1/approval
      def create
        begin
          approval = Approval.new(approval_params)
          if approval.save
            render json: approval, status: :created
          else
            render json: approval.errors, status: :unprocessable_entity
          end
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