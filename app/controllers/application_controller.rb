class ApplicationController < ActionController::Base
    helper_method :current_user

    before_action :set_locale

    def current_user
      @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    end

    def authenticate_user!
      redirect_to root_path, alert: "Please log in" unless current_user
    end

    private

    def set_locale
      I18n.locale = cookies[:admin_locale]&.to_sym.in?([:uk, :en]) ? cookies[:admin_locale].to_sym : :uk
    end
  end
