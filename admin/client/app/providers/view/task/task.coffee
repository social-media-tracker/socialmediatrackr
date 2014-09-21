'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.view.task',
    url: '/tasks/:task_id/worklog'
    templateUrl: 'app/providers/view/task/task.html'
    controller: 'AdminTaskCtrl'
