'use strict'

angular.module 'meanApp'
.controller 'TasksCtrl', ($scope, Task, $state) ->
  $scope.tasks = Task.query()

  $scope.isActiveTask = (t) ->
    console.log 'tasks.task', {id:t._id}
    console.log $state.includes('/tasks/' + {id:t._id})
