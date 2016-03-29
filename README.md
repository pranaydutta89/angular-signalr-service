# Angularjs Signalr service
AngularJS wrapper for SingalR Hubs .Just do some config and ready to go.

# Features

1) Plug and play signalR service. <br/>
2) No need to worry about connection managements (start/stop etc). <br/>
3) No need to initialize hub everywhere. <br/>



# How to do ?

1) Init: Let's do some config

    var app =angular.module('foo',['signalr']); //include module

        //do some config
        app.config(['signalrProvider',function(signalrProvider){

        //register one function of each hub just to warmup signalR

        signalrProvider.config({
                logging: true, //optional:switches the signalR native logger
                register: [{
                    hub: 'fooHub',
                    method: 'fooFunction'
                }],
                transports:['webSockets'] //optional config same as signalr or will fallback to default transports

            });

        }]);

2) Use: invoke/on that's it,just like native signalR


    app.controller('fooController',['signalrService','$scope',function(signalrService,$scope){

    //call server function without any params
    signalrService.invoke('fooHub', 'fooFunction');

    //call server function with params (Note: params should be an object)
    signalrService.invoke('fooHub', 'sendMessage', {message:'dummy message'}).then(function(res){

         //get response from server function ,i.e: if hub method returns something catch here

    });


    //register client side function
    signalrService.on('fooHub', 'fooFunctionClient', function (message) {

        $scope.message = message;
        $scope.$apply();  //this step is important for triggering the digest cycle

            });

       }]);

3) Events:
    
    a) signalR state change : "signalrStateChange"
          //example
          $rootScope.$on('signalrStateChange', change.newState);
          
    b) signalR tranfering data: "signalrTransportState"
          //example
           $rootScope.$on('signalrTransportState', function(data){
              
              if(data == 'sending'){
              //signalr is transferring to server
              }
              
              if(data == 'received'){
              // signalr completed its transferring
              }
           
           });



 Browser compatibility/tested with:

 1) IE : 8+ <br/>
 2) Chrome  : latest -1 <br/>
 3) Firefox : latest -1 <br/>
 4) Safari  : latest -1 <br/>

