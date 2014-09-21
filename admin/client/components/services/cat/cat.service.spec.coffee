'use strict'

describe 'Service: cat', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  cat = undefined
  beforeEach inject (_cat_) ->
    cat = _cat_

  it 'should do something', ->
    expect(!!cat).toBe true
