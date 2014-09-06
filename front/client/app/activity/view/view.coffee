'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'activity.view',
    url: '/:id'
    templateUrl: 'app/activity/view/view.html'
    controller: 'ViewCtrl'
