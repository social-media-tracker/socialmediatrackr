'use strict'

angular.module 'meanApp'
.directive 'adminActivity', ->
  templateUrl: 'components/admin-activity/admin-activity.html'
  restrict: 'E'
  scope: {
    userId:'@',
    dateTimeFormat: '@'
  }

  controller: ($scope, $filter, $http, $timeout, $attrs, FileUploader, Auth, Lightbox) -> 
    $scope.ctrl = 
      submittingForm: false
      showMore: false

    # when uploading files during new item submit:
    uploadingFromSubmit = false
    newLogWaitingOnAttachments = false

    $scope.uploadKey = false
    gettingUploadKey = false
    uploadedAttachmentIds = []
    uploader = new FileUploader 
      url: '/api/logs/upload'
      headers: Authorization: 'Bearer ' + Auth.getToken()
      formData: []

    uploader.onAfterAddingFile = (fileItem) ->
      unless $scope.itemId || $scope.uploadKey || gettingUploadKey
        gettingUploadKey = true
        $http.get('/api/logs/uploadKey')
        .then (res) ->
          $scope.uploadKey = res.data.key
          $scope.newLog.uploadKey = res.data.key
          gettingUploadKey = false
    
    uploader.onBeforeUploadItem = (item) ->
      console.log item
      item.url = '/api/logs/upload?uploadKey=' + $scope.uploadKey
      item

    uploader.onCompleteItem = (item, res) ->
      console.log 'onCompleteItem args'
      console.log arguments
      console.log 'onCompleteItem res'
      console.log res

      uploadedAttachmentIds.push res._id


    uploader.onCompleteAll = ->
      if uploadingFromSubmit
        uploadingFromSubmit = false
        uploader.clearQueue()
        $scope.uploadKey = false
        $scope.ctrl.submittingForm = false
        $scope.ctrl.showMore = false
        if newLogWaitingOnAttachments
          newLogWaitingOnAttachments.attachmets = uploadedAttachmentIds
          $scope.logs.push newLogWaitingOnAttachments
          newLogWaitingOnAttachments = false
          uploadedAttachmentIds = []

    $scope.uploader = uploader

    instaUploader = new FileUploader 
      url: '/api/logs/upload'
      headers: Authorization: 'Bearer ' + Auth.getToken()
      formData: []

    instaUploader.onAfterAddingFile = (fileItem) ->
      console.log fileItem
      instaUploader.uploading =  true
      instaUploader.uploadAll()
    
    instaUploader.onCompleteAll = ->
      instaUploader.uploading =  false

    instaUploader.onCompleteItem = (fileItem, res) ->

      instaUploader.uploading =  false
      for l in $scope.logs
        if l._id == res.log
          l.attachments.push res

    $scope.instaUploader = instaUploader
  
    # console.log $scope.user
    $scope.users = []

    $scope.filter = 
      apiURL: '/api/logs?user=-1'
      perPage: 20
      user: $scope.userId


    $scope.loading = true
    if $scope.userId
      $scope.filter.user = $scope.userId
    else
      $scope.filter.user = -1

    getNewLog = ->
      d = new Date()
      return {message:'',createdAt:d,tz_offset:d.getTimezoneOffset()}

    #delay setting up the watches for a short time to let the compiler fill in data
    $scope.newLog = getNewLog()
    $timeout ->

      $scope.$watch 'userId', (u) ->
        if u
          $scope.filter.apiURL = '/api/logs?user=' + u
          $scope.filter.user = u
        else
          $scope.filter.apiURL = '/api/logs?user=-1'
          $scope.filter.user = -1

      $scope.$watch 'logs.length', (len) ->
        $scope.loading = false

    , 100



    $scope.deleteLog = (log) ->
      $scope.selectedLog = log._id
      $timeout ->
        if confirm('Are you sure you want to delete this activity?')
          $http.delete '/api/logs/' + log._id
          .then (res) ->
            return alert res.error if res.error
            logs = []
            for l in $scope.logs
              logs.push l if l._id != $scope.selectedLog
            $scope.logs = logs
            $scope.selectedLog = false
        else
          $scope.selectedLog = false
      , 100

    $scope.addLog = (log, user) ->
      return alert('Enter a log message') unless log.message
      log.user = user
      doSubmit = true
      haveUploads = uploader.getNotUploadedItems().length > 0
      doSubmit = !haveUploads || confirm('Submit log & upload attachments?')
      if doSubmit
        $scope.ctrl.submittingForm = true
        $http.post '/api/logs', log
        .then (res) ->
          return $scope.newLogError = res.data.error if res.data.error
          the_log = res.data
          $scope.newLogError = ''
          if (haveUploads)
            uploadingFromSubmit = true
            newLogWaitingOnAttachments = the_log
            uploader.uploadAll()
          else
            $scope.ctrl.showMore = false
            $scope.ctrl.submittingForm = false
            $scope.logs.push the_log
            $scope.newLog = getNewLog()

    $scope.toggleAttachments = (log) ->
      return log.showAttachments = false if (log.showAttachments) 
      for l in $scope.logs
        l.showAttachments = false
      log.showAttachments = true
      return if log.attachmentsLoaded
      $http.get('/api/attachments/?log=' + log._id)
      .then (res) ->
        log.attachments = res.data
        log.images = log.images || []
        for a in res.data
          if a.type == 'Image'
              log.images.push
                _id: a._id
                url: '/api/attachments/' + a._id + '/passthru'
                caption: a.name
        log.attachmentsLoaded = true
    
    $scope.beforeSaveAttachmentName = (data, id) ->
      $http.post('/api/attachments/' + id + '/updateName',{name:data})
    $scope.beforeSaveLogMessage = (data, id) ->
      $http.put('/api/logs/' + id, {message: data})
    
    $scope.deleteAttachment = (a, log) ->
      
      $scope.deletingAttachment = a._id
      $timeout ->

        if !confirm('Are you sure you want to delete this attachment?')
          $scope.deletingAttachment = false
          return
        $http.delete('/api/attachments/' + a._id)
        .then (res) ->
          aa = []
          for x in log.attachments
            aa.push x unless x._id == a._id
          log.attachments = aa
      , 25

    findAttachmentIndex = (attachment, log) ->
      maxi = log.attachments.length
      for i in [0..maxi]
        console.log i
        return i if log.attachments[i]._id == attachment._id
      return -1

    $scope.showAttachmentImage = (attachment, log) ->
      # find the index
      idx = findAttachmentIndex(attachment, log)
      Lightbox.openModal(log.images, idx)


      
