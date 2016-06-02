(function () {

    angular.module('restApp')
        .factory('PaginationService', PaginationService);

        PaginationService.$inject = ['$http','$location','constant'];
        function PaginationService ($http, $location, constant) {

            var obj = {};

            obj.currentPage = 1;

            obj.getPages = function(pageCount) {
                obj.pages = [];
                var halfRange = Math.ceil(constant.pageRange/2);
                var position;

                if (obj.currentPage <= halfRange) {
                    position = 'start';
                } else if (pageCount - halfRange < obj.currentPage) {
                    position = 'end';
                } else {
                    position = 'middle';
                }

                function countPageNumber(i) {
                    if (i === 1) {
                        return i;
                    } else if (i === constant.pageRange) {
                        return pageCount;
                    } else if (constant.pageRange < pageCount) {
                        if (pageCount - halfRange < obj.currentPage) {
                            return pageCount - constant.pageRange + i;
                        } else if (halfRange < obj.currentPage) {
                            return obj.currentPage - halfRange + i;
                        } else {
                            return i;
                        }
                    } else {
                        return i;
                    }
                }

                var ellipse = constant.pageRange < pageCount;
                var i = 1;
                while (i <= pageCount && i <= constant.pageRange) {
                    var pageNumber = countPageNumber(i);

                    var startEllipse = (i === 2 && (position === 'middle' || position === 'end'));
                    var endEllipse = (i === constant.pageRange - 1 && (position === 'middle' || position === 'start'));
                    if (ellipse && (startEllipse || endEllipse)) {
                        obj.pages.push('...');
                    } else {
                        obj.pages.push(pageNumber);
                    }

                    i ++;
                }
                return obj.pages;
            };

            obj.switchPage = function(index, query){
                obj.currentPage = index;
                return $http.get(constant.serviceBase + query + 'page=' + index + '&per-page=' + constant.perPage);
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