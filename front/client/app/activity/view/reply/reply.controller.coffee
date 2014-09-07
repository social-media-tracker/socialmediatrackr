'use strict'

angular.module 'meanApp'
.controller 'ReplyCtrl', ($scope, $stateParams, Activity, $window, SharedData) ->

  $scope.reply = 
    message : ''

  $scope.submitReply = (reply) ->
    Activity.submitReply {id:$stateParams.id}, reply, (res) ->
      SharedData.log = res
      console.log SharedData
      $window.history.back();

