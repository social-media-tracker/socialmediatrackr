'use strict'

describe 'Directive: adminChecklist', ->

  # load the directive's module and view
  beforeEach module 'meanApp'
  beforeEach module 'components/admin-checklist/admin-checklist.html'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<admin-checklist></admin-checklist>'
    element = $compile(element) scope
    scope.$apply()
    expect(element.text()).toBe 'this is the adminChecklist directive'

