
(function(angular, undefined){
    'use strict';

angular.module('signalr', []).provider('signalrService', function () {

    var configuration;
    this.config = function (config) {
        configuration = config;
    };

    this.$get = ['$log', '$timeout', '$q', '$rootScope', function ($log, $timeout, $q, $rootScope) {
        return new signalrService(configuration, $log, $timeout, $q, $rootScope);
    }];

});


function signalrService(configuration, $log, $timeout, $q, $rootScope) {


    if (!(configuration && configuration.register)) {
        $log.error('Invalid config');
        return;
    }

    var signalRhubs = $.hubConnection();
    var currentState;

    if (!signalRhubs) {
        log('SignalR is not referenced.');
        return;
    }

    signalRhubs.logging = configuration.logging || false;


    angular.forEach(configuration.register, function (key, value) {
        var x = signalRhubs.createHubProxy(key.hub);
        x.on(key.method, function (data) {
        });
    });


    signalRhubs.stateChanged(function (change) {

        currentState = change.newState;
        $timeout(function () {
            $rootScope.$emit('signalrStateChange', change.newState);
        }, 200);

    });



    signalRhubs.connectionSlow(function () {
        log('We are currently experiencing difficulties with the connection.')
    });

    signalRhubs.error(function (error) {
        log('SignalR error: ' + error)
    });

    signalRhubs.received(function () {
        $timeout(function () {
            $rootScope.$emit('signalrTransportState', 'received');
        }, 400);
    });

    $(signalRhubs).bind("onDisconnect", function (e, data) {
        $timeout(function () {
            log('Signalr Connection dead.')
        }, 10000);
    });

    this.getCurrentState = function () {
        return currentState;
    }


    this.invoke = function (hubName, serverFunction, paramObject) {

        $timeout(function () {
            $rootScope.$emit('signalrTransportState', 'sending');
        },200);
        var def = $q.defer();

        var hubProxy = signalRhubs.createHubProxy(hubName)



        signalRhubs.start({ transport: configuration.transports || ['webSockets', 'serverSentEvents', 'longPolling', 'foreverFrame'] }).done(function () {

            if (paramObject) {

                hubProxy.invoke(serverFunction, paramObject).done(function (data) {
                    
                    def.resolve(data || null);
                   
                    
                }).fail(function (error) {
                    
                   log('SignalR error: ' + error)
                    def.reject();
                  
                });
            }
            else {
                hubProxy.invoke(serverFunction).done(function (data) {
                    
                    def.resolve(data || null);

                }).fail(function (error) {
                    
                    log('SignalR error: ' + error)
                    def.reject();
                   
                });
            }
        }).fail(function () {
            log('Failed to start signalR');
            def.reject();
        });
        return def.promise;
    }

    

    this.on = function (hubName, clientSubscribeFunction, func) {
        var hubProxy = signalRhubs.createHubProxy(hubName)
        hubProxy.on(clientSubscribeFunction, func);
    }


    function log(messageLog) {
        if (!!console && configuration.logging) {
            $log.error(messageLog)
        }
    }

}

}(angular));
