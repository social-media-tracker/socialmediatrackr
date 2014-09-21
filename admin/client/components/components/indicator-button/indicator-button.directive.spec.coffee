'use strict'

describe 'Directive: indicatorButton', ->

  # load the directive's module and view
  beforeEach module 'meanApp'
  beforeEach module 'components/components/indicator-button/indicator-button.html'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<indicator-button></indicator-button>'
    element = $compile(element) scope
    scope.$apply()
    expect(element.text()).toBe 'this is the indicatorButton directive'

