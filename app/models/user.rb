class User < ApplicationRecord
  has_many :tournament_participants, dependent: :destroy
  has_many :tournaments, through: :tournament_participants
  has_many :created_tournaments, class_name: 'Tournament', foreign_key: :created_by_id, dependent: :nullify
  has_many :activities, dependent: :destroy
  has_many :segment_efforts, dependent: :destroy
  has_many :tournament_scores, dependent: :destroy

  GENDERS = %w[male female].freeze
  ROLES   = %w[user moderator admin].freeze

  validates :strava_id, presence: true, uniqueness: true
  validates :gender, inclusion: { in: GENDERS }
  validates :role,   inclusion: { in: ROLES }

  def admin?     = role == 'admin'
  def moderator? = %w[moderator admin].include?(role)
  def full_name  = "#{first_name} #{last_name}".strip

  def token_expired?
    token_expires_at.present? && Time.current >= token_expires_at
  end

  def ensure_fresh_token!
    raise "No Strava token — please log out and log in again via Strava" if access_token.blank? && refresh_token.blank?
    return unless token_expired? || access_token.blank?

    client = Strava::OAuth::Client.new(
      client_id:     ENV['STRAVA_CLIENT_ID'],
      client_secret: ENV['STRAVA_CLIENT_SECRET']
    )
    response = client.oauth_token(grant_type: 'refresh_token', refresh_token: refresh_token)
    update!(
      access_token:     response.access_token,
      refresh_token:    response.refresh_token,
      token_expires_at: Time.at(response.expires_at)
    )
  end
end
