'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'tasks',
    url: '/tasks'
    templateUrl: 'app/tasks/tasks.html'
    controller: 'TasksCtrl'
