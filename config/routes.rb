Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Strava OAuth
  root 'strava#index'
  get  '/auth/strava/callback', to: 'sessions#create'
  delete '/logout',             to: 'sessions#destroy'

  # Legacy admin views (Hotwire)
  resources :segments, only: [:new, :create, :index]

  # REST API v1
  namespace :api do
    namespace :v1 do
      # Auth
      get  'me', to: 'users#me'
      patch 'me', to: 'users#update_gender'

      # Segments
      resources :segments, only: [:index, :show]

      # Tournaments
      resources :tournaments, only: [:index, :show, :create, :update, :destroy] do
        member do
          post   :join
          delete :leave
          post   :activate
          post   :complete
        end

        # Segments within a tournament (admin)
        resources :tournament_segments, only: [:index, :create, :destroy], path: :segments

        # Leaderboard
        get :leaderboard, to: 'leaderboards#show'
      end

      # Strava webhook
      get  'strava/webhook', to: 'strava_webhook#verify'
      post 'strava/webhook', to: 'strava_webhook#receive'

      # Manual activity sync
      post 'sync_activities', to: 'activities#sync'
    end
  end
end
