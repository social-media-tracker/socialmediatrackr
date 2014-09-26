'use strict'

angular.module 'meanApp'
.controller 'AdminTaskCtrl', ($scope, $stateParams, Task, Users, Auth, $http, Lightbox) ->
  
  $scope.u = Users.name

  $scope.images = {}

  catalogAttachments = (log) ->
    images = []
    for a in log.attachments
      images.push
        _id: a._id
        url: '/api/tasks/' + $scope.task._id + '/logs/' + log._id + '/attachments/' + a._id + '/view'
        caption: a.name
    if images.length
      $scope.images[log._id] = images

  Task.get {id:$stateParams.task_id}, (res) ->
    $scope.task = res
    ll = []
    for l in res.logs
      l.tabs = {comments:{active:false},attachments:{active:false}}
      ll.push l
      catalogAttachments(l)
    $scope.task.logs = ll

  $scope.logClick = (l, tab) ->
    if tab && l.showComments
      if l.tabs[tab].active
        l.showComments = false
        return
      l.tabs[tab].active = true
    else
      l.showComments = !l.showComments
      if (tab)
        console.log tab, l.tabs
        l.tabs[tab].active = true

  $scope.submitComment = (l) ->
    c = {message:l.newComment}
    $http.post('/api/tasks/' + $scope.task._id + '/logs/' + l._id + '/comments', c)
    .success (res) ->
      l.comments.push(res)

  findAttachmentIndex = (log, attachment) ->
    maxi = log.attachments.length
    for i in [0..maxi]
      return i if log.attachments[i]._id == attachment._id
    -1

  $scope.showAttachmentImage = (log, attachment) ->
    # find the index
    idx = findAttachmentIndex(log, attachment)
    console.log idx
    console.log $scope.images[log._id][idx]
    Lightbox.openModal($scope.images[log._id], idx)
  $scope.deleteAttachment = (task_id, log_id, attach_id) ->
    if confirm 'Are you sure you want to delete this attachment?'
      $http.delete('/api/tasks/' + task_id + '/logs/' + log_id + '/attachments/' + attach_id)
      .success (res) ->
        $scope.task.logs.map (l) ->
          if l._id == log_id
            l.attachments = l.attachments?.filter (a) ->
              return if a._id == attach_id then false else a


        console.log(res)