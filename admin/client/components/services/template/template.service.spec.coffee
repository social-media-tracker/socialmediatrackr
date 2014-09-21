'use strict'

describe 'Service: template', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  template = undefined
  beforeEach inject (_template_) ->
    template = _template_

  it 'should do something', ->
    expect(!!template).toBe true
