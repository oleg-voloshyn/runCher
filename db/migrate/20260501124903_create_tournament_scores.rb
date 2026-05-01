class CreateTournamentScores < ActiveRecord::Migration[8.1]
  def change
    create_table :tournament_scores do |t|
      t.references :tournament,      null: false, foreign_key: true
      t.references :user,            null: false, foreign_key: true
      t.references :segment,         null: false, foreign_key: true
      t.references :segment_effort,  null: false, foreign_key: true
      t.integer :elapsed_time,       null: false  # best time for this segment
      t.decimal :score, precision: 10, scale: 4, default: 0

      t.timestamps
    end

    add_index :tournament_scores, [:tournament_id, :user_id, :segment_id], unique: true, name: 'idx_tournament_scores_unique'
    add_index :tournament_scores, [:tournament_id, :segment_id, :elapsed_time], name: 'idx_tournament_scores_segment_time'
  end
end
