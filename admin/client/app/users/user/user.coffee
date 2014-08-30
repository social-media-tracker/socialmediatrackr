'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users.user',
    url: '/:id'
    templateUrl: 'app/users/user/user.html'
    controller: 'UserCtrl'