class Activity < ApplicationRecord
  belongs_to :user
  has_many :segment_efforts, dependent: :destroy

  validates :strava_activity_id, presence: true, uniqueness: true

  scope :unprocessed, -> { where(processed: false) }

  # Stores a Strava activity payload. Returns nil if it already exists.
  def self.sync_from_strava(user, data)
    find_or_initialize_by(strava_activity_id: data['id'].to_s).tap do |a|
      return nil unless a.new_record?

      a.assign_attributes(
        user:          user,
        name:          data['name'],
        activity_type: data['type'],
        start_date:    data['start_date'],
        elapsed_time:  data['elapsed_time'],
        distance:      data['distance']
      )
      a.save!
    end
  end
end
