class CreateTournamentSegments < ActiveRecord::Migration[8.1]
  def change
    create_table :tournament_segments do |t|
      t.references :tournament, null: false, foreign_key: true
      t.references :segment,    null: false, foreign_key: true
      t.boolean :is_rated,      null: false, default: false
      t.integer :order_number   # 1..N, only for rated segments

      t.timestamps
    end

    add_index :tournament_segments, [:tournament_id, :segment_id], unique: true
    add_index :tournament_segments, [:tournament_id, :order_number]
  end
end
