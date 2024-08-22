class CreateApprovals < ActiveRecord::Migration[7.0]
  def change
    create_table :approvals do |t|
      t.integer :shinsei_id
      t.integer :step
      t.integer :approved_user_id
      t.string :status

      t.timestamps
    end
    add_foreign_key :approvals, :shinseis, column: :shinsei_id
    add_foreign_key :approvals, :users, column: :approved_user_id
  end
end
