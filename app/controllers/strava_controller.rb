class StravaController < ApplicationController
    def index
			client_id = ENV['STRAVA_CLIENT_ID']
			redirect_uri = ENV['STRAVA_REDIRECT_URI']
			scope = 'read,read_all,profile:read_all,activity:read_all'
			approval_prompt = 'auto'
			response_type = 'code'
    
    	@auth_url = "https://www.strava.com/oauth/authorize?client_id=#{client_id}&redirect_uri=#{redirect_uri}&response_type=#{response_type}&scope=#{scope}&approval_prompt=#{approval_prompt}"
    end      
    
  
    def callback
			code = params[:code]
			client_id = ENV['STRAVA_CLIENT_ID']
			client_secret = ENV['STRAVA_CLIENT_SECRET']
		
			response = Faraday.post('https://www.strava.com/oauth/token') do |req|
				req.headers['Content-Type'] = 'application/json'
				req.body = {
					client_id: client_id,
					client_secret: client_secret,
					code: code,
					grant_type: 'authorization_code'
				}.to_json
			end
		
			if response.success?
				token_data = JSON.parse(response.body)
				session[:access_token] = token_data['access_token']
				redirect_to activities_path
			else
				redirect_to root_path, alert: 'Authorization failed.'
			end
		end		
  
    def activities
			if session[:access_token].present?
				client = Strava::Api::Client.new(access_token: session[:access_token])
				@athlete = client.athlete
				@activities = client.athlete_activities
			else
				redirect_to root_path, alert: 'Authorization required.'
			end
		end		
  end
  
