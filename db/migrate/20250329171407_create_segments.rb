class CreateSegments < ActiveRecord::Migration[7.1]
  def change
    create_table :segments do |t|
      t.string :strava_id
      t.string :name
      t.float :distance
      t.float :average_grade
      t.float :maximum_grade
      t.float :elevation_high
      t.float :elevation_low
      t.float :start_latitude
      t.float :start_longitude
      t.float :end_latitude
      t.float :end_longitude

      t.timestamps
    end
  end
end
