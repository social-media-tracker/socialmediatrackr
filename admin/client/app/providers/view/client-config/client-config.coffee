'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.view.client-config',
    url: '/client-config'
    templateUrl: 'app/providers/view/client-config/client-config.html'
    controller: 'ClientConfigCtrl'

