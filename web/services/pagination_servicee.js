(function () {

    angular.module('restApp')
        .factory('PaginationServicee', PaginationServicee);

        PaginationServicee.$inject = ['$rootScope','$http','$location','constant'];
        function PaginationServicee ( $rootScope, $http, $location, constant) {

            var obj = {};

            obj.currentPage = 1;

            obj.getPages = function() {
                var pageCount = $rootScope.xmlData._meta.pageCount, currentPage = $rootScope.xmlData._meta.currentPage,
                    paginationRange = constant.paginationRange, beforeCenter, afterCenter;
                obj.pages = [];

                if (paginationRange%2 == 0) {
                    beforeCenter = (paginationRange/2)-1; 
                    afterCenter = paginationRange/2;
                } else {
                    beforeCenter = Math.floor(paginationRange/2);
                    afterCenter = beforeCenter;
                }

                for (var i=1; i<=pageCount; i++) {
                    if (i >= currentPage - paginationRange && i <= currentPage + paginationRange) obj.pages.push(i);
                }



                for (var i = 0; i<=obj.pages.length-1; i++) {
                    if (obj.pages[obj.pages.length-1] - currentPage >= afterCenter && currentPage - obj.pages[0] > beforeCenter  ) {
                        obj.pages.shift();
                    } else if ( obj.pages[obj.pages.length-1] - currentPage < afterCenter && obj.pages.length > paginationRange) {
                        obj.pages.shift();
                    }
                }
                
                while (obj.pages.length > paginationRange) obj.pages.pop();
                if (obj.pages[0]!=1 && currentPage - beforeCenter >= 0) obj.pages[0] = "...";
                if (obj.pages[obj.pages.length-1]!=pageCount) obj.pages[obj.pages.length-1] = "...";        
                return obj.pages;
            };




            obj.switchPage = function(index, query){
                obj.currentPage = index;
                return $http.get(constant.serviceBase + query + "page=" + index + "&per-page=" + $rootScope.xmlData._meta.perPage);
            };




            obj.setPage = function(pageLink, pageType, pageCount){
                switch(pageType){
                    case 'first':
                        obj.currentPage = 1;
                        break;
                    case 'last':
                        obj.currentPage = pageCount;
                        break;
                    case 'prev':
                        obj.currentPage -= 1;
                        break;
                    case 'next':
                        obj.currentPage += 1;
                        break;
                }
                var currentLocation = $location.protocol() + "://" + $location.host();
                var pageRest = pageLink.slice(currentLocation.length, pageLink.length);
                return $http.get(constant.serviceBase.substring(0, constant.serviceBase.length - 1) + pageRest);
            };

            return obj;







        }
})();

