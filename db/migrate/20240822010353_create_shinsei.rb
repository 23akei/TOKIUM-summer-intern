class CreateShinsei < ActiveRecord::Migration[7.0]
  def change
    create_table :shinseis do |t|
      t.string :title
      t.datetime :date
      t.integer :user_id
      t.string :description
      t.string :kind
      t.string :shop
      t.integer :flow_id
      t.string :approval_state

      t.timestamps
    end
  end
end
