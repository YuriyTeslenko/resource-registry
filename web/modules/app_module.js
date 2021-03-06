(function(){

    'use strict';

    angular
        .module('restApp', ['ngRoute', 'restApp.map', 'ngCookies', 'calendar', 'datePicker', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = ['$locationProvider', '$routeProvider'];

    function config($locationProvider, $routeProvider) {

    $routeProvider
        .when('/site/index', {
            controller: 'index',
            templateUrl: 'views/site/index.html'
        })
        .when('/resource/resource', {
            templateUrl: 'views/resource/resource.html'
        })
        .when('/site/logs', {
             templateUrl: 'views/site/logs.html'
        })
        .when('/site/contact', {
            templateUrl: 'views/site/contact.html'
        })
        .when('/site/user_reg', {
            templateUrl: 'views/site/about.html',
            controller: 'index'
        })
        .when('/resource/index', {
            templateUrl: 'views/resource/resource.html',
            controller: 'index'
        })
        .when('/resource/create', {
            templateUrl: 'views/resource/create_resource.html',
            controller: 'index'
        })
        .when('/resource/update/:resourceId', {
            templateUrl: 'views/resource/update_resource.html',
            controller: 'update',
            resolve: {
                resourceId: function($route){
                    return $route.current.params.resourceId;
                }
            }
        })
        .when('/resource/search', {
            templateUrl: 'views/resource/search_resource.html',
            controller: 'ExtendedSearchController'
        })
        .when('/resource/delete/:resourceId', {
            templateUrl: 'views/resource/resource.html'
        })
        .when('/site/login', {
            controller: 'LoginController',
            templateUrl: 'views/site/login.html',
            controllerAs: 'vm'
        })
        .when('/site/registration', {
            controller: 'RegistrationCtrl',
            templateUrl: 'views/site/registration.html',
            controllerAs: 'vm'
        })
        .when('/site/home', {
            controller: 'IndexCtrl',
            controllerAs: 'pp',
            templateUrl: 'views/site/personal_page.html'
        })
        .when('/site/restorepassword', {
            controller: 'LoginController',
            templateUrl: 'views/site/restorepassword.html',
            controllerAs: 'vm'
        })
        .when('/resource/community', {
            controller: 'UsersCommunity',
            templateUrl: 'views/site/community.html',
            controllerAs: 'usersCtrl'
        })
        .otherwise({
            redirectTo: '/site/login'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http){

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var test = localStorage.getItem('username');
            /*if (!test) {
             $location.path('/site/login');
             }*/
            console.log('change');
        });
    }

})();
