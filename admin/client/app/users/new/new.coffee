'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users.new',
    url: '/new'
    templateUrl: 'app/users/new/new.html'
    controller: 'NewUserCtrl'
