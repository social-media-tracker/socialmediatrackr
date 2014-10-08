'use strict'

describe 'Directive: paginate', ->

  # load the directive's module and view
  beforeEach module 'meanApp'
  beforeEach module 'components/ui/paginate/paginate.html'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<paginate></paginate>'
    element = $compile(element) scope
    scope.$apply()
    expect(element.text()).toBe 'this is the paginate directive'

