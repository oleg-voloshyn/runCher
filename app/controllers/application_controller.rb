class ApplicationController < ActionController::Base
    helper_method :current_user

    def current_user
      @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    end

    def authenticate_user!
      redirect_to root_path, alert: "Please log in" unless current_user
    end
  end
