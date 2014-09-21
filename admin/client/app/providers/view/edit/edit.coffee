'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.view.edit',
    url: '/edit'
    templateUrl: 'app/providers/view/edit/edit.html'
    controller: 'EditProviderCtrl'
