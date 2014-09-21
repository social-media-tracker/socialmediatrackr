'use strict'

describe 'Directive: userForm', ->

  # load the directive's module and view
  beforeEach module 'meanApp'
  beforeEach module 'components/user-form/user-form.html'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  # it 'should make hidden element visible', inject ($compile) ->
  #   element = angular.element '<user-form></user-form>'
  #   element = $compile(element) scope
  #   scope.$apply()
  #   expect(element.text()).toBe 'this is the userForm directive'

