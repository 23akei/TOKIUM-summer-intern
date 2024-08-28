module Api
  module V1
    class WebhooksController < ApplicationController
      # POST /api/v1/webhooks
      def create
        begin
          created = Webhook.new(webhook_params)
          if !created.save
            render json: { error: 'Webhook not created' }, status: :unprocessable_entity
          else
            render json: created.to_json, status: :created
          end
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/webhook
      def index
        begin
          webhooks = Webhook.all
          if webhooks.nil?
            render json: [], status: :ok
          else
            render json: webhooks, status: :ok
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Webhooks not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/webhook/user/:user_id
      def user
        begin
          webhooks = Webhook.where(user_id: params[:user_id])
          if webhooks.nil?
            render json: [], status: :ok
          else
            render json: webhooks, status: :ok
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Webhooks not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      # GET /api/v1/webhook/entries
      def entries
        begin
          entries = Webhookentry::ENTRY.keys
          render json: entries, status: :ok
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end

      private

      def webhook_params
        params.require(:webhook).permit(:user_id, :entry, :url)
      end
    end
  end
end
