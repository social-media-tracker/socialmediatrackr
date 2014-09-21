'use strict'

angular.module 'meanApp'
.service 'Attachment', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  return $resource "/api/attachments/:id", {id: "@id"}, {
    update: {method: 'PUT'}
  }