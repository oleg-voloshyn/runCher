require 'strava-ruby-client'

class SessionsController < ApplicationController
  def create
    client = Strava::OAuth::Client.new(
      client_id: ENV['STRAVA_CLIENT_ID'],
      client_secret: ENV['STRAVA_CLIENT_SECRET']
    )

    response = client.oauth_token(code: params[:code])
    athlete = response.athlete

    user = User.find_or_initialize_by(strava_id: athlete['id'].to_s)
    user.first_name = athlete['firstname']
    user.last_name  = athlete['lastname']
    user.email      = athlete['email']
    user.profile_picture = athlete['profile']
    user.gender     = athlete['sex'] == 'F' ? 'female' : 'male'
    user.access_token     = response.access_token
    user.refresh_token    = response.refresh_token
    user.token_expires_at = Time.at(response.expires_at)
    user.save!

    session[:user_id] = user.id

    redirect_to root_path, notice: "Logged in as #{user.first_name} #{user.last_name}"
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: "Logged out successfully"
  end
end
