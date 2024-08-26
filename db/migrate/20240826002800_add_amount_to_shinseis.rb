class AddAmountToShinseis < ActiveRecord::Migration[7.0]
  def change
    add_column :shinseis, :amount, :integer
  end
end
