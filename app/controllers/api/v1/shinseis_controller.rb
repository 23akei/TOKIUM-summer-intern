module Api
  module V1
    class ShinseisController < ApplicationController
      # POST /api/v1/application
      def create
        shinsei = Shinsei.new(shinsei_params)
        if shinsei.save
          render json: shinsei, status: :created
        else
          render json: shinsei.errors, status: :unprocessable_entity
        end
      end

      # GET /api/v1/application
      def index
        begin
          shinseis = Shinsei.all
          render json: shinseis, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Shinseis not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/application/:id
      def show
        begin
          shinsei = Shinsei.find_by(id: params[:id])
          render json: shinsei, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Shinsei not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/application/user/:user_id
      def user
        begin
          shinseis = Shinsei.where(user_id: params[:user_id])
          render json: shinseis, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Shinseis not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def shinsei_params
        params.require(:shinsei).permit(:title, :date, :user_id, :description, :kind, :shop, :flow_id, :approval_state, :amount)
      end
    end
  end
end