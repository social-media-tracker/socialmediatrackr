'use strict'

angular.module 'meanApp'
.directive 'adminActivity', ->
  templateUrl: 'components/admin-activity/admin-activity.html'
  restrict: 'E'
  scope: {
    userId:'@',
    dateTimeFormat: '@'
  }

  controller: ($scope, $http, $timeout, $attrs, FileUploader, Auth) -> 
    $scope.ctrl = 
      submittingForm: false
      showMore: true

    # when uploading files during new item submit:
    uploadingFromSubmit = false

    $scope.uploadKey = false
    gettingUploadKey = false
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

    uploader.onCompleteAll = ->
      if uploadingFromSubmit
        uploadingFromSubmit = false
        uploader.clearQueue()
        $scope.uploadKey = false
        $scope.ctrl.submittingForm = false
        $scope.ctrl.showMore = false

    $scope.uploader = uploader
  
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
          $scope.logs.unshift res.data
          $scope.newLogError = ''
          if (haveUploads)
            uploadingFromSubmit = true
            uploader.uploadAll()
            $scope.newLog = getNewLog()
          else
            $scope.ctrl.showMore = false
          


