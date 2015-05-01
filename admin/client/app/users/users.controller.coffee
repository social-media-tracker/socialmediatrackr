'use strict'

angular.module 'meanApp'
.controller 'UsersCtrl', ($scope, $rootScope, $http, $state, $stateParams, Auth, User) ->
  $rootScope.selectedUser = false

  # $http.get '/api/users'
  # .success (users) ->
    # $scope.users = users

  $scope.users = User.query()

  $scope.delete = (user) ->
    User.remove id: user._id
    angular.forEach $scope.users, (u, i) ->
      $scope.users.splice i, 1 if u is user

  $scope.selectUser = (user) ->
    window.scrollTo 0,0
    $state.go 'users.user.activity', id: user._id

  $scope.isSelected = (user) ->
  	user._id is $rootScope.selectedUser
