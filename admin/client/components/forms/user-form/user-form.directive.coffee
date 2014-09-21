'use strict'

angular.module 'meanApp'
.directive 'userForm', ->
  templateUrl: 'components/forms/user-form/user-form.html'
  restrict: 'E'
  scope:
    user: '=ngModel'

  link: (scope, element, attrs) ->

  controller: ($scope, $attrs, $timeout, $http, $state) ->
    console.log('UserForm Controller')
    console.log('attrs role', $attrs.role)
    console.log('scope user', $scope.user)
    $scope.role = $attrs.role
    $scope.ctrl =
      buttonState: 'default'
      errorText: ''

    $scope.isNew = if $scope.user?._id then false else true
    console.log 'isnew', $scope.isNew

    if ($scope.isNew)
      console.log 'New User Form'
      $scope.user = {
        subscriber_subscriptions:{}
      }
    else
      $scope.user.subscriber_subscriptions = $scope.user.subscriber_subscriptions || {}

    $scope.formHeader = ->

      heading = if $scope.isNew then 'Add ' else 'Edit '
      heading + $scope.role

    $scope.submit = (user) ->
      console.log user
      $scope.ctrl.buttonState = 'saving'
      if user._id
        $http.put('/api/users/' + user._id,user).success (res) ->
          $scope.ctrl.buttonState = 'success'
          $timeout ->
            $scope.ctrl.buttonState = 'default'
          , 5000
        .error (err) ->
          $scope.ctrl.errorText = 'Server Error'
          console.log err
          $scope.ctrl.buttonState = 'error'
          $timeout ->
            $scope.ctrl.buttonState = 'default'
          , 15000
      else
        user.role = $scope.role.toLowerCase() || 'user'
        user.role = 'user' if user.role == 'client'
        
        $http.post('/api/users',user).success (res) ->
          $scope.ctrl.buttonState = 'success'
          if (user.role == 'provider')
            $state.go('providers.view',{id:res._id })
          else
            $state.go('users.user',{id:res._id })
          
        .error (err) ->
          $scope.ctrl.errorText = 'Server Error'
          console.log err
          $scope.ctrl.buttonState = 'error'
          $timeout ->
            $scope.ctrl.buttonState = 'default'
          , 15000

