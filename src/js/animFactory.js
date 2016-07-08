(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('animFactory', animFactory);
    animFactory.$inject = ['$log'];

    function animFactory($log) {
        return {
            settingsAnim: settingsAnim
        };

        function settingsAnim() {

            $(".slide-toggle").click(function() {
                var el = $(this).toggleClass('active').attr('data-toggle');

                $(el).slideToggle("slow", function() {

                });
            });

        }
    }
})();