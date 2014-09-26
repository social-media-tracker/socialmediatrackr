'use strict'

angular.module 'meanApp'
.controller 'TaskCtrl', ($scope, $stateParams, Task, $http, Auth, Users, FileUploader, Lightbox) ->

  $scope.ctrl = 
    loading: true
    submittingForm: false
    newLogError: ''


  $scope.task = {}

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

  
  Task.get {id:$stateParams.id}, (res) ->
    $scope.task = res
    $scope.ctrl.loading = false
    ll = []
    for l in res.logs
      l.tabs = {comments:{active:false},attachments:{active:false}}
      ll.push l
      catalogAttachments(l)
    $scope.task.logs = ll

  newLogWaitingOnAttachments = false

  uploadedAttachmentIds = []

  uploader = new FileUploader 
    url: '/api/tasks/upload' # bogus URL, url is set onBeforeUploadItem
    headers: Authorization: 'Bearer ' + Auth.getToken()
    formData: []

  uploader.onBeforeUploadItem = (item) ->
    item.url = '/api/tasks/' + $stateParams.id + '/logs/' + newLogWaitingOnAttachments.logs[newLogWaitingOnAttachments.logs.length-1]._id + '/attachments'
    item

  uploader.onCompleteItem = (item, res) ->
    uploadedAttachmentIds.push res._id


  uploader.onCompleteAll = ->
    uploader.clearQueue()
    $scope.ctrl.submittingForm = false
    $scope.ctrl.showUploader = false
    if newLogWaitingOnAttachments
      newLogWaitingOnAttachments = false
      Task.get {id:$stateParams.id}, (res) ->
        $scope.task = res
        $scope.ctrl.submittingForm = false
        $scope.images = {}
        for l in res.logs
          l.tabs = {comments:{active:false},attachments:{active:false}}
          catalogAttachments(l)
        resetLog()

      uploadedAttachmentIds = []
    else
      $scope.ctrl.submittingForm = false
      resetLog()
      uploadedAttachmentIds = []

  $scope.uploader = uploader


  resetLog = ->
    $scope.log = {}

  resetLog()

  $scope.logClick = (l, tab) ->
    if tab && l.showComments
      if l.tabs[tab].active
        l.showComments = false
        return
      l.tabs[tab].active = true
    else
      l.showComments = !l.showComments
      if (tab)
        l.tabs[tab].active = true

  $scope.submitComment = (l) ->
    console.log l
    c = {message:l.newComment}
    $http.post('/api/tasks/' + $scope.task._id + '/logs/' + l._id + '/comments', c)
    .success (res) ->
      res.user = Auth.getCurrentUser()
      l.comments.push(res)


  $scope.submitLog = (t) ->
    return alert('Please enter a message.') unless t.message

    haveUploads = uploader.getNotUploadedItems().length > 0
    doSubmit = !haveUploads || confirm('Submit log & upload attachments?')

    if doSubmit
      $scope.ctrl.submittingForm = true
      $http.post('/api/tasks/' + $scope.task._id + '/logs', t)
      .success (res) ->
        $scope.task = res
        $scope.ctrl.newLogError = ''
        if (haveUploads)
          uploadingFromSubmit = true
          newLogWaitingOnAttachments = res
          uploader.uploadAll()
        else
          $scope.ctrl.showMore = false
          $scope.ctrl.submittingForm = false
          resetLog()



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
