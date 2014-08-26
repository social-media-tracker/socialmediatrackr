'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'checklist',
    url: '/checklist'
    templateUrl: 'app/checklist/checklist.html'
    controller: 'ChecklistCtrl'
