# Angular-Signalr-service


# Features

1) Plug and play signalR service. <br/>
2) No need to worry about connection managements (start/stop etc). <br/>
3) No need to initialize hub everywhere. <br/>



# How to do ?

1) Init: Let's do some config

    var app =angular.module('foo',['signalr']); //include module

        //do some config
        app.config(['signalrProiver',function(signalrProiver){

        //register one function of each hub just to warmup signalR

        signalrProvider.config({
                logging: true, //optional:switches the signalR native logger
                register: [{
                    hub: 'fooHub',
                    method: 'fooFunction'
                }],

            });

        }]);

2) Use: invoke/on that's it,just like native signalR


    app.controller('fooController',['signalrService','$rootScope','$scope',function(signalrService,$rootScope,$scope){

    //call server function without any params
    signalrService.invoke('fooHub', 'fooFunction');

    //call server function with params (Note: params should be an object)
    signalrService.invoke('fooHub', 'sendMessage', {message:'dummy message'}).then(function(res){

         //get response from server function ,i.e: if hub method returns something catch here

    });


    //register client side function
    signalrService.on('fooHub', 'fooFunctionClient', function (message) {

        $scope.message = message;
        $rootScope.$apply();  //this step is important for triggering the digest cycle

            });

       }]);




 Browser compatibility/tested with:

 1) IE : 8+
 2) Chrome : latest -1
 3) firefox : latest -1

