'use strict'

angular.module 'meanApp'
.factory 'Cat', ($resource) ->
  $resource '/api/cats/:id/:controller',
    id: '@_id'
  ,
    tasks:
      method: 'GET'
      isArray: true
      params:
        type: 'task'
        
    activities:
      method: 'GET'
      isArray: true
      params:
        type: 'activity'
