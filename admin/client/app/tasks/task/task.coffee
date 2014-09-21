'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'tasks.task',
    url: '/:id'
    templateUrl: 'app/tasks/task/task.html'
    controller: 'TaskCtrl'
