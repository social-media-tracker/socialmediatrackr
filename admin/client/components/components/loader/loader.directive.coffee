'use strict'

angular.module 'meanApp'
.directive 'smtLoader', ->
  template: '<div><h2><i class="fa fa-spin fa-spinner"></i> Loading...</h2></div>'
  restrict: 'EA'
