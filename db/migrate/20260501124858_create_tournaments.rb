class CreateTournaments < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.string  :name,                   null: false
      t.text    :description
      t.string  :status,                 null: false, default: 'draft'
      t.datetime :starts_at
      t.datetime :ends_at
      t.integer :total_segments_count,   null: false
      t.integer :rated_segments_count,   null: false
      t.references :created_by, foreign_key: { to_table: :users }, null: false

      t.timestamps
    end

    add_index :tournaments, :status
  end
end
