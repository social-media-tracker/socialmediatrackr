'use strict'

angular.module 'meanApp'
.controller 'MainCtrl', ($scope, $rootScope, Auth, $location, $window) ->
  # make my life on dev easier:
  # $scope.user = {email:'admin@admin.com',password:'admin'}
  # $scope.user = {email:'thomporter@gmail.com',password:'test'}
  $scope.errors = {}
  $scope.login = (form) ->
    $scope.submitted = true

    if form.$valid
      # Logged in, redirect to home
      Auth.login
        email: $scope.user.email
        password: $scope.user.password

      .then (data) ->
        # login form hack to make browsers pop the remember username/password prompt.
        $frm = $('#rememberLoginForm');
        action = if data.role == 'admin' then '/users' else '/tasks'
        $frm.find('input[name="redir"]').val action
        $frm.find('input[name="username"]').val $scope.user.email
        $frm.find('input[name="password"]').val $scope.user.password
        $frm.submit()

         

      .catch (err) ->
        $scope.errors.other = err.message

  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider

