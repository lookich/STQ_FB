class CreateAdmins < ActiveRecord::Migration[6.0]
  def change
    create_table :admins do |t|
      t.float "rate"
      t.datetime "datetime"

      t.timestamps
    end
  end
end
