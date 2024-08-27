module Api
  module V1
    class SubmittionsController < ApplicationController
      # POST /api/v1/submissions
      def create
        created = Submittion.new(
          shinsei_id: submittion_params[:shinsei_id],
          user_id: submittion_params[:user_id],
          status: 'pending',
          step: 1,
        )

        if !created.save
          render json: { error: 'Submittion not created' }, status: :unprocessable_entity
        end
        created_submittion = Submittion.find_by(id: created.id)
        puts created_submittion.inspect
        # proceed the flow
        submittion_service = SubmittionService.new
        ret, status = submittion_service.proceed_flow(created_submittion)
        if status != :ok
          render json: { error: ret }, status: status
        else
          render json: {id: created.id}, status: :created
        end
      end

      # GET /api/v1/submissions/user/:user_id
      def user
        begin
          submittions = Submittion.where(user_id: params[:user_id])
          if submittions.nil?
            render json: [], status: :ok
          else
            render json: submittions, status: :ok
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Submittions not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def submittion_params
        params.require(:submittion).permit(:shinsei_id, :user_id)
      end
    end
  end
end
