'use strict'

angular.module 'meanApp'
.factory 'SharedData', ->
  return {
    log: false
  }