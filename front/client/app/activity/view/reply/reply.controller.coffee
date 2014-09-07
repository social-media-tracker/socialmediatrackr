'use strict'

angular.module 'meanApp'
.controller 'ReplyCtrl', ($scope, $stateParams, Activity) ->

  $scope.reply = 
    message : ''

  $scope.submitReply = (reply) ->
    Activity.submitReply {id:$stateParams.id}, reply, (res) ->
      console.log res

