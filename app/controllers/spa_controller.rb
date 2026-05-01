class SpaController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    html = Rails.root.join('public', 'app', 'index.html')
    if html.exist?
      render file: html, layout: false
    else
      render plain: 'React app not built. Run: npm run build --prefix frontend', status: :ok
    end
  end
end
