'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'settings',
    url: '/settings'
    templateUrl: 'app/settings/settings.html'
    controller: 'SettingsCtrl'
    authenticate: true
