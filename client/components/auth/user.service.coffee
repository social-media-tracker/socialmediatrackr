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

    get:
      method: 'GET'
      params:
        id: 'me'

