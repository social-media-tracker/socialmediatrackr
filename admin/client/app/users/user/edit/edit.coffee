'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users.user.edit',
    url: '/edit'
    templateUrl: 'app/users/user/edit/edit.html'
    controller: 'UserEditCtrl'
