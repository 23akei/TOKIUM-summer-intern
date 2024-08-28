Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # /users
      resources :users, only: [:create]
      get 'users', to: 'users#index'
      get 'users/role/:role', to: 'users#get_by_role'
      get 'users/:id', to: 'users#show'

      # /application
      post 'application', to: 'shinseis#create'
      get 'application', to: 'shinseis#index'
      get 'application/:id', to: 'shinseis#show'
      get 'application/user/:user_id', to: 'shinseis#user'

      # /submittions
      post 'submittions', to: 'submittions#create'
      get 'submittions/user/:user_id', to: 'submittions#user'

      # /flows
      post 'flows', to: 'flows#create'
      get 'flows', to: 'flows#index'
      get 'flows/condition_keys', to: 'flows#condition_keys'
      get 'flows/condition_comparators', to: 'flows#condition_comparators'
      get 'flows/:id', to: 'flows#show'

      # /approvals
      put 'approvals', to: 'approvals#update'
      get 'approvals/user/:id', to: 'approvals#get_applications_by_user_needs_to_approve'

      # /webhook
      post 'webhook', to: 'webhooks#create'
      get 'webhook', to: 'webhooks#index'
      get 'webhook/user/:user_id', to: 'webhooks#user'
      get 'webhook/entries', to: 'webhooks#entries'
    end
  end
end
