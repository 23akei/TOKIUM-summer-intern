module Api
  module V1
    class SubmittionsController < ApplicationController
      # POST /api/v1/submissions
      def create
        new_submittion_params = {
          shinsei_id: submittion_params[:application_id],
          user_id: submittion_params[:user_id],
          status: 'pending',
          step: 1,
        }
        created = Submittion.new(new_submittion_params)

        if created.save == false
          render json: { error: 'Submittion not created' }, status: :unprocessable_entity
        end

        # proceed the flow
        submittion_service = SubmittionService.new
        ret, status = submittion_service.proceed_flow(created)
        if status != :ok
          render json: { error: ret }, status: status
        else
          render json: {id: created.id}, status: :created
        end
      end

      # GET /api/v1/submissions/user/:user_id
      def user
        begin
          submittions = Submittion.find_by(user_id: params[:user_id], status: 'pending')
          render json: submittions, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Submittions not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def submittion_params
        params.require(:submittion).permit(:application_id, :user_id)
      end
    end
  end
end
