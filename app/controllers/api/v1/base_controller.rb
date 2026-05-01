module Api
  module V1
    class BaseController < ActionController::API
      before_action :authenticate_user!

      private

      def current_user
        @current_user ||= begin
          bearer = request.headers['Authorization']&.then { |h| h.start_with?('Bearer ') ? h.delete_prefix('Bearer ') : nil }
          if bearer
            User.find_by(mobile_token: bearer)
          else
            User.find_by(id: session[:user_id])
          end
        end
      end

      def authenticate_user!
        render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
      end

      def require_admin!
        render json: { error: 'Forbidden' }, status: :forbidden unless current_user.admin?
      end

      def require_moderator!
        render json: { error: 'Forbidden' }, status: :forbidden unless current_user.moderator?
      end
    end
  end
end
