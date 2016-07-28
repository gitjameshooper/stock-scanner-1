(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('xtraFactory', xtraFactory);
    xtraFactory.$inject = ['$log'];

    function xtraFactory($log) {
        return {
            settingsAnim: settingsAnim,
            toggleTest: toggleTest,
            jQueryExtends: jQueryExtends
        };

        function settingsAnim() {
            
            $(".slide-toggle").click(function() {
                var el = $(this).toggleClass('active').attr('data-toggle');

                $(el).slideToggle("slow", function() {

                });
            });

        }
        function jQueryExtends() {
            $.extend({
                playSound: function() {
                    return $(
                        '<audio autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '.mp3" />' + '<source src="' + arguments[0] + '.ogg" />' + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' + '</audio>'
                    ).appendTo('body');
                }
            });
        }
    }
})();