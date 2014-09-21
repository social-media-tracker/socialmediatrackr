'use strict'

describe 'Filter: trunc', ->

  # load the filter's module
  beforeEach module 'meanApp'

  # initialize a new instance of the filter before each test
  trunc = undefined
  beforeEach inject ($filter) ->
    trunc = $filter 'trunc'

  it 'should return the input prefixed with \'trunc filter:\'', ->
    text = 'angularjs'
    expect(trunc text).toBe 'trunc filter: ' + text
