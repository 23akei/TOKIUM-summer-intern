class CreateApprovers < ActiveRecord::Migration[7.0]
  def change
    create_table :approvers do |t|
      t.integer :user_id
      t.integer :flow_id
      t.integer :step

      t.timestamps
    end
    add_foreign_key :approvers, :users, column: :user_id
    add_foreign_key :approvers, :flows, column: :flow_id
  end
end
