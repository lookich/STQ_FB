class AddRatesName < ActiveRecord::Migration[6.0]
  def change
    add_column :admins, :rate_name, :string
  end
end
