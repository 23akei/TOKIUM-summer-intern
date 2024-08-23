module Api
  module V1
    class SubmittionsController < ApplicationController
      # POST /api/v1/submissions
      def create
        new_submission_params = {
          shinsei_id: submission_params[:application_id],
          user_id: submission_params[:user_id]
          status: 'pending',
          step: 1
        }
        created = Submission.new(new_submission_params)

        if created.save == false
          render json: { error: 'Submission not created' }, status: :unprocessable_entity
        end

        # proceed the flow
        submittion_service = SubmittionService.new
        ret, status = submittion_service.proceed_flow(created)
        if status != :ok
          render json: { error: ret }, status: status
        end
        render json: {id: created.id}, status: :created
      end

      # GET /api/v1/submissions/user/:user_id
      def user
        begin
          submissions = Submission.find_by(user_id: params[:user_id], status: 'pending')
          render json: submissions, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Submissions not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def submission_params
        params.require(:submission).permit(:application_id, :user_id)
      end
    end
  end
end
