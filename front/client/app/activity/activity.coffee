'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'activity',
    url: '/activity'
    templateUrl: 'app/activity/activity.html'
    controller: 'ActivityCtrl'
