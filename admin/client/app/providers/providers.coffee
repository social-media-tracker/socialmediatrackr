'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers',
    url: '/providers'
    templateUrl: 'app/providers/providers.html'
    controller: 'ProvidersCtrl'
