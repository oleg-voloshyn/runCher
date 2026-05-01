module Admin
  class BaseController < ApplicationController
    layout 'admin'
    before_action :authenticate_user!
    before_action :require_moderator!

    helper AdminHelper

    private

    def require_moderator!
      redirect_to root_path, alert: 'Доступ заборонено' unless current_user&.moderator?
    end
  end
end
