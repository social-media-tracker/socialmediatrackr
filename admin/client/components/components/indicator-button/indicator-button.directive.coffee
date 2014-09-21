'use strict'

angular.module 'meanApp'
.directive 'indicatorButton', ->
  templateUrl: 'components/components/indicator-button/indicator-button.html'
  restrict: 'E'
  scope: 
    'isdisabled' : '@'
    'state' : '@'
    'errortext' : '@'

  link: (scope, element, attrs) ->
    scope.errorText = 'Error' unless scope.errorText
    scope.value = attrs.value
    scope.buttonTexts = 
      default: if attrs.value then attrs.value else '<i class="fa fa-save"></i> Save'
      saving: if attrs.savingText then attrs.savingText else '<i class="fa fa-spinner fa-spin"></i> Saving'
      success: if attrs.successText then attrs.successText else '<i class="fa fa-check"></i> Saved'

  controller: ($scope, $element, $attrs) ->

    $scope.className = ->
      cl = 'btn btn-'
      if $scope.state == 'default'
        cl += 'primary'
      else if $scope.state == 'saving'
        cl += 'warning'
      else if $scope.state == 'error'
        cl += 'danger'
      else
        cl += $scope.state
      cl

    $scope.isDisabled = ->
      $scope.isdisabled == '1' || $scope.state == 'saving'

    $scope.buttonText = ->
      return $scope.errortext if $scope.state == 'error'
      $scope.buttonTexts[$scope.state]