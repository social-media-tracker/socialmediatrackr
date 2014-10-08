'use strict'

angular.module 'meanApp'
.directive 'paginate', ->
  templateUrl: 'components/ui/paginate/paginate.html'
  restrict: 'EA'
  scope: {
    filter: '=',
    total: '=',
    showPages: '=',
    setPage: '&',
  }

  link: (scope, element, attrs) ->
  controller: ($scope, $attrs, $timeout) ->
    $scope.p = (p) ->
      console.log 'paginate p', p, $scope.filter
      # $scope.setPage(p)

      $scope.filter.page = p
      console.log '$scope.filter after p set', $scope.filter

    #prev page
    $scope.pp = ->
      $scope.filter.page += 1

    #last page
    $scope.lp = ->
      $scope.filter

    go = ->
      console.log $scope
      showPages = $scope.showPages || 10
      console.log 'showPages', showPages

      page = $scope.filter.page
      limit = $scope.filter.limit
      total = $scope.total

      console.log('plt', page, limit, total)

      numPages = Math.ceil(total/limit)

      startPage = page - showPages / 2
      startPage = 1 if (startPage < 1)
      endPage = startPage  + showPages
      endPage = numPages if endPage > numPages

      pages = []

      for i in [startPage..endPage]
        pages.push i


      prevPage = page - 1
      prevPage = 1 if prevPage < 1

      nextPage = page + 1
      nextPage = numPages if nextPage > numPages

      $scope.numPages = numPages
      $scope.prevPage = prevPage
      $scope.nextPage = nextPage
      $scope.pages = pages

    $timeout ->
      $scope.$watch 'total', ->
        go()
      $scope.$watch 'filter', ->
        go()
      , true
    , 500




