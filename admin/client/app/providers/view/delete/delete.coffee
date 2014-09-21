'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.view.delete',
    url: '/delete'
    templateUrl: 'app/providers/view/delete/delete.html'
    controller: 'DeleteCtrl'
