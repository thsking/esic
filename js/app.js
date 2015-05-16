'use strict';

var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate','ngResource']);

myApp.config(['$routeProvider','$httpProvider',
    function($routeProvider, $httpProvider) {

        $routeProvider.
            when('/users-list', {
                templateUrl: 'partials/users-list.html',
                controller: 'usersListCtrl'
            }).
            when('/annonces-list', {
                templateUrl: 'partials/annonces-list.html',
                controller: 'annoncesListCtrl'
            }).
            when('/annonce', {
                templateUrl: 'partials/annonce.html',
                controller: 'annonceCtrl'                
            }).
            when('/messages-list', {
                templateUrl: 'partials/messages-list.html',
                controller: 'messagesListCtrl'
            }).
            when('/message', {
                templateUrl: 'partials/message.html',
                controller: 'messageCtrl'
            }).
            when('/profil', {
                templateUrl: 'partials/profil.html',
                controller: 'profilCtrl'
            }).
            when('/edit-profil', {
                templateUrl: 'partials/edit-profil.html',
                controller: 'editProfilCtrl'
            }).
            when('/gestion-annonces', {
                templateUrl: 'partials/gestion-annonces.html',
                controller: 'gestionAnnoncesCtrl'              
            }).
            when('/new-annonce', {
                templateUrl: 'partials/new-annonce.html',
                controller: 'newAnnonceCtrl'
            }).
            otherwise({
                redirectTo: '/annonces-list'
            });


        $httpProvider.interceptors.push('myHttpInterceptor');
            
}]);

myApp.factory('myHttpInterceptor', function ($q, $window,$rootScope,$timeout) {



    $rootScope.layout = {};
    $rootScope.layout.loading = false;
    

    return {
      // optional method
      'request': function(config) {

        // do something on success
        var refreshIndex  =(config.url).indexOf('refresh=true');

        if(refreshIndex<0){
          $rootScope.layout.loading = true;
        }

        return config;
      },

      // optional method
     'requestError': function(rejection) {
        // do something on error
        if (canRecover(rejection)) {
          return responseOrNewPromise
        }
        return $q.reject(rejection);
      },



      // optional method
      'response': function(response) {
        // do something on success
        $timeout(function(){
          $rootScope.layout.loading = false;
        }, 1000);
        return response;
      },

      // optional method
     'responseError': function(rejection) {
        // do something on error
        if (canRecover(rejection)) {
          return responseOrNewPromise
        }
        return $q.reject(rejection);
      }
    };


});