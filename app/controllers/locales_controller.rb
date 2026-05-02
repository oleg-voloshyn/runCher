class LocalesController < ApplicationController
  def set
    locale = params[:locale].in?(%w[uk en]) ? params[:locale] : 'uk'
    cookies.permanent[:admin_locale] = locale
    redirect_back fallback_location: root_path
  end
end
