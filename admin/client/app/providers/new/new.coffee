'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.new',
    url: '/new'
    templateUrl: 'app/providers/new/new.html'
    controller: 'NewProviderCtrl'
