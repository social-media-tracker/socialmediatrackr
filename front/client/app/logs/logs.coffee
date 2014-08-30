'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'logs',
    url: '/logs'
    templateUrl: 'app/logs/logs.html'
    controller: 'LogsCtrl'
