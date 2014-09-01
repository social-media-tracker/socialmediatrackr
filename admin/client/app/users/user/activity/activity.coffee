'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users.user.activity',
    url: '/activity'
    templateUrl: 'app/users/user/activity/activity.html'
    controller: 'ActivityCtrl'
