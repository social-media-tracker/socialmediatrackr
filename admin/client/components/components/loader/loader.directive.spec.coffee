'use strict'

describe 'Directive: loader', ->

  # load the directive's module
  beforeEach module 'meanApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<loader></loader>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the loader directive'
