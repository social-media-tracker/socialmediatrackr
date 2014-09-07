'use strict'

angular.module 'meanApp'
.controller 'ViewCtrl', ($scope, $state, $stateParams, $window, Activity, Attachment, Lightbox, SharedData) ->
  $scope.ctrl = 
    attachmentsLoaded: false
  $scope.data = SharedData
  $scope.data.log = Activity.get({id:$stateParams.id})
  $scope.attachments = []
  $scope.images = []

  Attachment.query {log:$stateParams.id}, (res) ->
    console.log res
    $scope.attachments = res
    for a in $scope.attachments
      if a.type == 'Image'
          $scope.images.push
            _id: a._id
            url: '/api/attachments/' + a._id + '/passthru'
            caption: a.name
    $scope.ctrl.attachmentsLoaded = true

  $scope.showAttachments = (log) ->
    log.attachments?.length && !$state.includes('activity.view.reply')

  $scope.back = ->
    $window.history.back();

  findAttachmentIndex = (attachment) ->
    console.log $scope.attachments
    maxi = $scope.attachments.length
    for i in [0..maxi]
      return i if $scope.attachments[i]._id == attachment._id
    -1

  $scope.showAttachmentImage = (attachment) ->
    # find the index
    idx = findAttachmentIndex(attachment)
    console.log idx
    console.log $scope.images[idx]
    Lightbox.openModal($scope.images, idx)
  $scope.showReplies = (log) ->
    return log.replies?.length > 0
