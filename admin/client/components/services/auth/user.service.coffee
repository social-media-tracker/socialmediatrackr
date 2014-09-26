'use strict'

angular.module 'meanApp'
.factory 'User', ($resource) ->
  $resource '/api/users/:id/:controller',
    id: '@_id'
  ,
    changePassword:
      method: 'PUT'
      params:
        controller: 'password'
    changeSubscriptions:
      method: 'PUT'
      params:
        controller: 'subscriptions'
    clients:
      method: 'GET'
      isArray: true
      params:
        role: 'user'
    providers:
      method: 'GET'
      isArray: true
      params:
        role: 'provider'
    admins:
      method: 'GET'
      isArray: true
      params:
        role: 'admin'
    ids:
      method: 'GET'
      isArray: true
      params:
        ids: '@ids'
        
    get:
      method: 'GET'
      params:
        id: 'me'

    addToProvider:
      url: '/api/users/:clientId/addToProvider/:providerId'
      method: 'GET'
      params:
        clientId: '@clientId'
        providerId: '@providerId'

    removeFromProvider:
      url: '/api/users/:clientId/removeFromProvider/:providerId'
      method: 'GET'
      params:
        clientId: '@clientId'
        providerId: '@providerId'

    getAll:
      url: '/api/users?role=all'
      isArray: true