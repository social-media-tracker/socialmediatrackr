'use strict'

angular.module 'meanApp'
.service 'Activity', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  return $resource "/api/logs/:id", {id: "@id"}, {
    update: {method: 'PUT'}
  }

