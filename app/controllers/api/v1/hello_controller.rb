module Api
  module V1
    class HelloController < ApplicationController
      # GET /api/v1/hello
      def index
        render json: { message: 'Hello World' }
      end
    end
  end
end
