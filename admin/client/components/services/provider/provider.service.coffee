'use strict'

angular.module 'meanApp'
.service 'Provider', ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  
  return $resource "/api/users", {id: "@id"}, {
    update: {method: 'PUT'}
  }
