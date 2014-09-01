'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users.user.checklist',
    url: '/checklist'
    templateUrl: 'app/users/user/checklist/checklist.html'
    controller: 'ChecklistCtrl'
