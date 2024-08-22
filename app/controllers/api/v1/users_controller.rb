module Api
  module V1
    class UsersController < ApplicationController
      # POST /api/v1/users
      def create
        user = User.new(user_params)
        if user.save
          render json: user, status: :created
        else
          render json: user.errors, status: :unprocessable_entity
        end
      end

      # GET /api/v1/users
      def index
        begin
          users = User.all
          render json: users, status: :ok
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/users/:role
      def get_by_role
        begin
          users = User.where(role: params[:role])
          render json: users, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Users not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/users/:id
      def show
        begin
          user = User.find_by(id: params[:id])
          render json: user, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :role)
      end
    end
  end
end
