# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_01_180726) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "activity_type"
    t.datetime "created_at", null: false
    t.float "distance"
    t.integer "elapsed_time"
    t.string "name"
    t.boolean "processed", default: false, null: false
    t.datetime "start_date"
    t.string "strava_activity_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["strava_activity_id"], name: "index_activities_on_strava_activity_id", unique: true
    t.index ["user_id", "start_date"], name: "index_activities_on_user_id_and_start_date"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "segment_efforts", force: :cascade do |t|
    t.bigint "activity_id", null: false
    t.datetime "created_at", null: false
    t.integer "elapsed_time", null: false
    t.bigint "segment_id", null: false
    t.datetime "start_date"
    t.string "strava_effort_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["activity_id"], name: "index_segment_efforts_on_activity_id"
    t.index ["segment_id"], name: "index_segment_efforts_on_segment_id"
    t.index ["strava_effort_id"], name: "index_segment_efforts_on_strava_effort_id", unique: true
    t.index ["user_id", "segment_id", "elapsed_time"], name: "idx_on_user_id_segment_id_elapsed_time_c1f7831492"
    t.index ["user_id"], name: "index_segment_efforts_on_user_id"
  end

  create_table "segments", force: :cascade do |t|
    t.float "average_grade"
    t.datetime "created_at", null: false
    t.float "distance"
    t.float "elevation_high"
    t.float "elevation_low"
    t.float "end_latitude"
    t.float "end_longitude"
    t.float "maximum_grade"
    t.string "name"
    t.float "start_latitude"
    t.float "start_longitude"
    t.string "strava_id"
    t.datetime "updated_at", null: false
  end

  create_table "tournament_participants", force: :cascade do |t|
    t.decimal "bonus_score", precision: 10, scale: 4, default: "0.0"
    t.datetime "completed_at"
    t.integer "completion_order"
    t.datetime "created_at", null: false
    t.string "gender", null: false
    t.decimal "total_score", precision: 10, scale: 4, default: "0.0"
    t.bigint "tournament_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["tournament_id", "gender"], name: "index_tournament_participants_on_tournament_id_and_gender"
    t.index ["tournament_id", "user_id"], name: "index_tournament_participants_on_tournament_id_and_user_id", unique: true
    t.index ["tournament_id"], name: "index_tournament_participants_on_tournament_id"
    t.index ["user_id"], name: "index_tournament_participants_on_user_id"
  end

  create_table "tournament_scores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "elapsed_time", null: false
    t.decimal "score", precision: 10, scale: 4, default: "0.0"
    t.bigint "segment_effort_id", null: false
    t.bigint "segment_id", null: false
    t.bigint "tournament_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["segment_effort_id"], name: "index_tournament_scores_on_segment_effort_id"
    t.index ["segment_id"], name: "index_tournament_scores_on_segment_id"
    t.index ["tournament_id", "segment_id", "elapsed_time"], name: "idx_tournament_scores_segment_time"
    t.index ["tournament_id", "user_id", "segment_id"], name: "idx_tournament_scores_unique", unique: true
    t.index ["tournament_id"], name: "index_tournament_scores_on_tournament_id"
    t.index ["user_id"], name: "index_tournament_scores_on_user_id"
  end

  create_table "tournament_segments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_rated", default: false, null: false
    t.integer "order_number"
    t.bigint "segment_id", null: false
    t.bigint "tournament_id", null: false
    t.datetime "updated_at", null: false
    t.index ["segment_id"], name: "index_tournament_segments_on_segment_id"
    t.index ["tournament_id", "order_number"], name: "index_tournament_segments_on_tournament_id_and_order_number"
    t.index ["tournament_id", "segment_id"], name: "index_tournament_segments_on_tournament_id_and_segment_id", unique: true
    t.index ["tournament_id"], name: "index_tournament_segments_on_tournament_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "created_by_id", null: false
    t.text "description"
    t.datetime "ends_at"
    t.string "name", null: false
    t.integer "rated_segments_count", null: false
    t.datetime "starts_at"
    t.string "status", default: "draft", null: false
    t.integer "total_segments_count", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_tournaments_on_created_by_id"
    t.index ["status"], name: "index_tournaments_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "access_token"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "first_name"
    t.string "gender", default: "male"
    t.string "last_name"
    t.string "mobile_token"
    t.string "profile_picture"
    t.string "refresh_token"
    t.string "role", default: "user"
    t.string "strava_id"
    t.datetime "token_expires_at"
    t.datetime "updated_at", null: false
    t.index ["mobile_token"], name: "index_users_on_mobile_token", unique: true
    t.index ["strava_id"], name: "index_users_on_strava_id", unique: true
  end

  add_foreign_key "activities", "users"
  add_foreign_key "segment_efforts", "activities"
  add_foreign_key "segment_efforts", "segments"
  add_foreign_key "segment_efforts", "users"
  add_foreign_key "tournament_participants", "tournaments"
  add_foreign_key "tournament_participants", "users"
  add_foreign_key "tournament_scores", "segment_efforts"
  add_foreign_key "tournament_scores", "segments"
  add_foreign_key "tournament_scores", "tournaments"
  add_foreign_key "tournament_scores", "users"
  add_foreign_key "tournament_segments", "segments"
  add_foreign_key "tournament_segments", "tournaments"
  add_foreign_key "tournaments", "users", column: "created_by_id"
end
