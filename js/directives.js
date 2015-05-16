'use strict';

myApp.directive("scroll", function ($window) {


    return function(scope, element, attrs) {
        angular.element(element).bind("scroll", function() {


            // Hundle header background 

            // set var 
            var eltWithoutHeaderBg = [
                "/profil",
                "/annonce"
            ];
            var activePage = scope.activePage;
            var scrollTop = element[0].scrollTop;
            var $headerContainer = angular.element(".header-container");

            // if active page need a header background gestion
            if(eltWithoutHeaderBg.indexOf(activePage) >= 0){     

                var opacity = (Math.round((scrollTop/32)*100))/100;

                // make sure opacity will set to 1 after 27
                if(scrollTop>27){
                    opacity = 1;
                }

                // edit opacity
                $headerContainer.css('background-color', 'rgba(28,29,30, '+opacity+')');

            }

        });
    };

});