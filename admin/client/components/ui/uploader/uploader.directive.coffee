'use strict'

angular.module 'meanApp'
.directive 'smtUploader', ->
  templateUrl: 'components/ui/uploader/uploader.html'
  restrict: 'E'
  scope: {
    uploader: '='
  }
  link: (scope, element, attrs) ->
