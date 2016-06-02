(function () {
   'use strict';

    angular
        .module('restApp')
        .controller('UsersCommunity', UsersCommunity);

    UsersCommunity.$inject = ['$scope', '$http', 'PaginationServicee', 'constant', '$location', '$rootScope'];
    function UsersCommunity($scope, $http, PaginationServicee, constant, $location, $rootScope) {

        $scope.searchingVal = "";
        $scope.orderBy = "ASC";

        (function(){
            return $http.get('rest.php/communities/show')
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(data) {
                $rootScope.xmlData = data.data;
            }
            function errorHandler(data){
            }
        }());

        $scope.searchCommunity = function(community_name) {
            if ($scope.communitySearch) {
                $scope.searchingVal = $scope.communitySearch;
            } else {
                $scope.searchingVal = "";
            }


            $http.get('rest.php/communities/show?search='+ $scope.searchingVal + "&order=" + $scope.orderBy)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(data) {
                $rootScope.xmlData = data.data;
            }
            function errorHandler(data){
            }
        };

        $scope.chngActiveStatus = function(data, status) {
            if (status == 0 && !confirm("Ви дійсно бажаєте дективувати громаду?")) {
                return;
            }
            var prev_stat = data.isactive;
            data.isactive = status;
            var post = $http.put('rest.php/communities/'+data.community_id, data)
            .catch(errorHandler);

            function errorHandler(result){
                data.isactive = prev_stat;
            }
        };

        //Pagination start

        $scope.currentPage = PaginationServicee.currentPage;

        $scope.getPages = function(pageCount) {
            return PaginationServicee.getPages(pageCount);
        };

        $scope.changeOrder = function() {
            if ($scope.orderBy == "ASC") {
                $scope.orderBy = "DESC";

            } else {
                $scope.orderBy = "ASC";
            }

            $http.get('rest.php/communities/show?search='+ $scope.searchingVal + "&order=" + $scope.orderBy)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(data) {
                $rootScope.xmlData = data.data;
            }
            function errorHandler(data){
                console.log("Can't reload list!");
            }
        };

        $scope.switchPage = function(index){
            var intervalID = setInterval(function(){
                if ($rootScope.xmlData.items) {
                    if($scope.request){
                        PaginationServicee.switchPage(index, constant.communitiesQuery + '/search?' + buildQuery($scope.request)+ '&')
                            .then(function(data){
                                $rootScope.xmlData = data.data;
                                $scope.currentPage = PaginationServicee.currentPage;
                        });
                    } else if ($scope.searchingVal) {
                         console.log(constant.perPage);
                        PaginationServicee.switchPage(index, 'communities/show?search='+ $scope.searchingVal + "&order=" + $scope.orderBy + "&page=" + index + "&per-page=" + constant.perPage)
                            .then(function(data){
                                $rootScope.xmlData = data.data;
                                $scope.currentPage = PaginationServicee.currentPage;
                        });
                    } else {
                        PaginationServicee.switchPage(index, constant.communitiesQuery + "/show" + '?')
                            .then(function(data){
                                $rootScope.xmlData = data.data;
                                $scope.currentPage = PaginationServicee.currentPage;
                        });
                    }
                    clearInterval(intervalID);
                }
            },10);
        };
      
        $scope.switchPage($scope.currentPage);

        $scope.setPage = function(pageLink, pageType){
            PaginationServicee.setPage(pageLink, pageType, $rootScope.xmlData._meta.pageCount)
                .then(function(data){
                    $rootScope.xmlData = data.data;
                    $scope.currentPage = PaginationServicee.currentPage;
            });
        };

    }
})();