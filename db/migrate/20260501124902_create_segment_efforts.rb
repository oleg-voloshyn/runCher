class CreateSegmentEfforts < ActiveRecord::Migration[8.1]
  def change
    create_table :segment_efforts do |t|
      t.references :user,       null: false, foreign_key: true
      t.references :segment,    null: false, foreign_key: true
      t.references :activity,   null: false, foreign_key: true
      t.string  :strava_effort_id, null: false
      t.integer :elapsed_time,  null: false  # seconds
      t.datetime :start_date

      t.timestamps
    end

    add_index :segment_efforts, :strava_effort_id, unique: true
    add_index :segment_efforts, [:user_id, :segment_id, :elapsed_time]
  end
end
