(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('oAuthService', oAuthService);
    oAuthService.$inject = ['$http', '$log'];

    function oAuthService($http, $log) {
        return {
            getOAuth: getOAuth
        };

        function getOAuth() {
            return $http.get('/json/tk-creds.json')
                .then(getOAuthDone)
                .catch(getOAuthFail);
        }

        function getOAuthDone(response) {
            var tkOAuth,
                creds = response.data;
                 
                
            tkOAuth = { 
                consumer : OAuth({
                    consumer: {
                        public: creds.consumer_key,
                        secret: creds.consumer_secret
                    },
                    signature_method: 'HMAC-SHA1'
                }), 
                token : {
                    public: creds.access_token,
                    secret: creds.access_secret
                },
                tkRequestData :{ 
                    url: 'https://api.tradeking.com/v1/market/ext/quotes.json?symbols=',
                    method: 'GET'
                }  
            };
            return tkOAuth;
        }

        function getOAuthFail(error) {
            $log.error('Failed to get OAuth - ' + error.statusText);
            return false;
        }
    }
})();