class CreateWebhooks < ActiveRecord::Migration[7.0]
  def change
    create_table :webhooks do |t|
      t.integer :user_id
      t.text :url
      t.string :entry

      t.timestamps
    end
  end
end
