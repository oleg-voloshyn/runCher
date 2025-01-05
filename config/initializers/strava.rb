StravaClient = Strava::Api::Client.new(
  client_id: ENV['STRAVA_CLIENT_ID'],
  client_secret: ENV['STRAVA_CLIENT_SECRET']
)
