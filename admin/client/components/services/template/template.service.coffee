'use strict'

angular.module 'meanApp'
.factory 'Template', ($resource) ->
  $resource '/api/templates/:id/:controller',
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
