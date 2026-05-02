Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Locale toggle
  post 'locale', to: 'locales#set', as: :set_locale

  # Strava OAuth
  root to: 'spa#index'
  get  '/auth/strava/callback', to: 'sessions#create'
  delete '/logout',             to: 'sessions#destroy'

  # Admin panel (Hotwire / Turbo)
  namespace :admin do
    root to: 'dashboard#index', as: :dashboard
    resources :tournaments do
      member do
        post :activate
        post :complete
      end
      resources :tournament_segments,    only: [:create, :update, :destroy], path: :segments
      resources :tournament_participants, only: [:create, :destroy], path: :participants
    end
    resources :segments, only: [:index, :show, :new, :create, :destroy]
    resources :users,    only: [:index, :show] do
      member do
        patch :update_role
        post  :reprocess_activities
        post  :reset_sync
      end
    end
  end

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

      # Activities
      get  'activities',      to: 'activities#index'
      post 'sync_activities', to: 'activities#sync'
    end
  end

  # React SPA catch-all — MUST be last so all other routes take precedence.
  # Lets React Router handle deep links and page refreshes.
  get '*path', to: 'spa#index',
      constraints: ->(req) {
        !req.path.start_with?('/api/', '/admin', '/auth/', '/logout', '/rails/', '/up') && !req.xhr?
      }
end
