class CreateTournamentParticipants < ActiveRecord::Migration[8.1]
  def change
    create_table :tournament_participants do |t|
      t.references :tournament, null: false, foreign_key: true
      t.references :user,       null: false, foreign_key: true
      t.string  :gender,        null: false
      t.integer :completion_order  # 1 = first to finish all rated segments
      t.datetime :completed_at
      t.decimal :total_score,   precision: 10, scale: 4, default: 0
      t.decimal :bonus_score,   precision: 10, scale: 4, default: 0

      t.timestamps
    end

    add_index :tournament_participants, [:tournament_id, :user_id], unique: true
    add_index :tournament_participants, [:tournament_id, :gender]
  end
end
