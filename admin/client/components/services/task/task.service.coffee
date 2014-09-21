'use strict'

angular.module 'meanApp'
.service 'Task', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  return $resource "/api/tasks/:id", {id: "@id"}, {
    update: {method: 'PUT'},
    completed: 
      method: 'POST'
      url: '/api/tasks/:id/completed'

    uncompleted: 
      method: 'POST'
      url: '/api/tasks/:id/uncompleted'


  }

