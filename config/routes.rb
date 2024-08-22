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
    end
  end
end
