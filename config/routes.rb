Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create, :index]
      get 'users/role/:role', to: 'users#get_by_role'
      get 'users/:id', to: 'users#show'
    end
  end
end
