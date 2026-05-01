module Api
  module V1
    # Strava Webhook Event API
    # Docs: https://developers.strava.com/docs/webhooks/
    class StravaWebhookController < ActionController::API
      VERIFY_TOKEN = ENV.fetch('STRAVA_WEBHOOK_VERIFY_TOKEN', 'runcher_verify_token')

      # GET /api/v1/strava/webhook
      # Strava calls this once during webhook subscription setup.
      def verify
        if params['hub.verify_token'] == VERIFY_TOKEN
          render json: { 'hub.challenge': params['hub.challenge'] }
        else
          render json: { error: 'Invalid verify token' }, status: :forbidden
        end
      end

      # POST /api/v1/strava/webhook
      # Strava sends this whenever an athlete creates/updates/deletes an activity.
      def receive
        event = params.permit(:aspect_type, :event_time, :object_id, :object_type, :owner_id, :subscription_id, updates: {}).to_h

        if event['object_type'] == 'activity' && event['aspect_type'] == 'create'
          user = User.find_by(strava_id: event['owner_id'].to_s)
          SyncStravaActivityJob.perform_later(user.id, event['object_id'].to_s) if user
        end

        head :ok
      end
    end
  end
end
