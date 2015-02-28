/**
 * Created by prandutt on 2/19/2015.
 */




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
        $log.log('Invalid config');
        return;
    }

    var signalRhubs = $.hubConnection();
    var currentState;

    if (!signalRhubs) {
        $log.log('SignalR is not referenced.');
        return;
    }

    signalRhubs.logging = configuration.logging || false;


    angular.forEach(configuration.register, function (key, value) {
        var x = signalRhubs.createHubProxy(key.hub);
        x.on(key.method, function (data) {
        });
    });


    signalRhubs.stateChanged(function (change) {
        $timeout(function () {
            $rootScope.$emit('signalrStateChange', change.newState);
        }, 200);
        
        currentState = change.newState;

    });



    signalRhubs.connectionSlow(function () {
        $log.warn('We are currently experiencing difficulties with the connection.')
    });

    signalRhubs.error(function (error) {
        $log.error('SignalR error: ' + error)
    });


    $(signalRhubs).bind("onDisconnect", function (e, data) {
        $timeout(function () {
            $log.warn('Signalr Connection dead.')
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

        signalRhubs.start().done(function () {

            if (paramObject) {

                hubProxy.invoke(serverFunction, paramObject).done(function (data) {
                    
                    def.resolve(data || null);
                    emitRecieve();
                    
                }).fail(function (error) {
                    
                    $log.error('SignalR error: ' + error)
                    def.reject();
                    emitRecieve();
                });
            }
            else {
                hubProxy.invoke(serverFunction).done(function (data) {
                    
                    def.resolve(data || null);
                    emitRecieve();
                }).fail(function (error) {
                    
                    $log.error('SignalR error: ' + error)
                    def.reject();
                    emitRecieve();
                });
            }
        }).fail(function () {
            $log.error('Failed to start signalR')
            def.reject();
        });
        return def.promise;
    }

    function emitRecieve() {
        $timeout(function () {
            $rootScope.$emit('signalrTransportState', 'received');
        }, 400);
    }

    this.on = function (hubName, clientSubscribeFunction, func) {
        var hubProxy = signalRhubs.createHubProxy(hubName)
        hubProxy.on(clientSubscribeFunction, func);
    }

}
