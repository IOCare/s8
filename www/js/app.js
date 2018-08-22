// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var serviceType = "ssdp:all";
var connectionType = "";
var ssidName;
var appVersion;
var db = null;
angular.module('starter', ['ionic', 'rt.debounce','starter.controllers','starter.services','ion-floating-menu', 'monospaced.elastic', 'angularMoment','ion-datetime-picker','angular.circular-slider'])

.run(function($ionicPlatform,$rootScope, $state,DB) {
  $ionicPlatform.ready(function() {
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

	try
	{
		if (cordova.platformId == 'android') {
			StatusBar.backgroundColorByHexString("#009688");
		}	
    //db = window.sqlitePlugin.openDatabase({name: 'iocareswitch.db', location: 'default'});
     DB.init();

    /*window.plugins.DeviceAccounts.getEmail(function(accounts){
      store.set('account',accounts);
      console.log('account registered on this device:', accounts);
    }, function(error){
      console.log('Fail to retrieve accounts, details on exception:', error);
    });*/


	}
	catch (err)
	{
		console.log('Error..'+err);
	}


try
  {
    //cordova.getAppVersion(function(version) {
       // appVersion = version;
       // console.log(version);
    //});

    cordova.getAppVersion.getVersionNumber().then(function (version) {
        //$('.version').text(version);
        appVersion = version;
        console.log('App Version:');
        console.log(version);        
    });


  }
  catch (err)
  {
    console.log('Error..'+err);
  }

	console.log('Botting..');

 //------------- Global config -------------------
      $rootScope.global = {
        theme: {
          primary_color: '#28A249', //'#4a87ee',
          additional_color: '#248E44', //'#0c63ee',
          text_color: '#fff',
          logo: store.get('last_logo') || './img/default_logo_big.png'
        }
      }

      var notificationOpenedCallback = function(jsonData) {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        $rootScope.m = [];
        if(store.get('msgs')==undefined){
          console.log('udefined ');
          store.set("msgs",[]);
        //$rootScope.m = store.get('msgs');
        }else
        {
          $rootScope.m = store.get('msgs');
        }
        $rootScope.m.push(jsonData);
        store.set("msgs", $rootScope.m);
        if (jsonData.additionalData && jsonData.additionalData.targetUrl) {
        //var state = $injector.get($state);
          $state.go(jsonData.additionalData.targetUrl);
        }
        var data = jsonData.notification.payload.additionalData;
        if (data && data.targetUrl) {
          //var state = $injector.get($state);
          $state.go(data.targetUrl);
        }
      };
  //var m = {"message":"As for this release, we have a new renderer effect, a new model, and the usual assortment of bug fixes and code cleanup. The new effect is screen-space ambient occlusion, or SSAO for short.","additionalData":{"title":"we have a new renderer effect","sound":"schoolchalehum","targetUrl":"app.scenes"},"isActive":false};
  //notificationOpenedCallback(m);

  var notificationOpenedCallback = function(jsonData) {
    //console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    console.log(jsonData.payload);
    if (jsonData.payload.additionalData.update=="yes") {
            url="10.1.25.9";
            GatewayService.updateGW(url);  

            var message = {topic:'fromapp',message:'update arrived ala re'};
            mqtt.publish(message);  
    }
  };

  try{
    window.plugins.OneSignal
      .startInit("f53421eb-bf39-462b-b9b1-2db4024bd36b")
      .handleNotificationOpened(notificationOpenedCallback)
      .handleNotificationReceived(notificationOpenedCallback)
      .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.InAppAlert)
      .endInit();
  }
  catch (err)
  {
    console.log('Error..'+err);
  }

  try{
    window.plugins.OneSignal.getTags(function(tags) {
        console.log('Tags Received: ' + JSON.stringify(tags));
        //$state.go('tab.settings');

    });      
  }
  catch (err)
  {
    console.log('Error..'+err);
  }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	try
	{
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
	}
	catch (err)
	{
		console.log('Error..'+err);
	}

  });


  //stateChange event
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authRequired && !lined){ 
      // User isn’t authenticated
      alert('Login Required!');
      $state.transitionTo("app.home");
      
      event.preventDefault(); 
    }
  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

/*
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })*/

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
        resolve: {
            cordova: function($q) {
                var deferred = $q.defer();
                ionic.Platform.ready(function() {
                    console.log('ionic.Platform.ready');
                    deferred.resolve();
                });
                return deferred.promise;
            }
        },    
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
		cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
			controller: 'HomeCtrl'
      }
    },
		authStatus: true
  })


  .state('app.room', {
    url: '/home/:roomid',
		cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/room.html',
			controller: 'RoomCtrl'
      }
    }
  })

  .state('app.switches', {
      url: '/switches',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/switches.html',
			  controller: 'SwitchesCtrl'
        }
      }
    })

  .state('app.remote_type', {
      url: '/remote_type',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/remote_types.html',
			  controller: 'RemoteTypeCtrl'
        }
      }
    })

  .state('app.brands', {
      url: '/brands/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/brands.html',
        controller: 'BrandsCtrl'
        }
      }
    })

  .state('app.remote', {
      url: '/remote/:type/:brand',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/remote_buttons.html',
        controller: 'RemoteCtrl'
        }
      }
    })


  .state('app.configure', {
      url: '/configure',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/configure.html',
			  controller: 'ConfigureCtrl'
        }
      }
    })

  .state('app.board', {
      url: '/configure/:boardId',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/board.html',
			  controller: 'BoardCtrl'
        }
      }
    })


    .state('app.scenes', {
      url: '/scenes',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/scenes.html',
          controller: 'ScenesController'
        }
      }
    })

  .state('app.scene', {
      url: '/scene/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/scene.html',
        controller: 'SceneCtrl'
        }
      }
    })

  .state('app.createscene', {
      url: '/createscene',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/create-scene.html',
        controller: 'CreateScenesController'
        }
      }
    })


  .state('app.settings', {
      url: '/settings',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
			  controller: 'SettingsCtrl'
        }
      }
    })
  .state('app.messages', {
      url: '/messages',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/messages.html',
        controller: 'MessagesCtrl'
        }
      }
    })
  .state('app.message', {
      url: '/messages/:mid',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/message.html',
        controller: 'MessageCtrl'
        }
      }
    })  
  .state('app.about', {
      url: '/about',
		  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
			  controller: 'AboutCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

function byteString(n) {
  if (n < 0 || n > 255 || n % 1 !== 0) {
      throw new Error(n + " does not fit in a byte");
  }
  var bitstring = ("000000000" + n.toString(2)).substr(-8);
  return bitstring.split('').map(function(item) {
      return parseInt(item, 10);
    });
}

function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN]  = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI]     = 'WiFi connection';
  states[Connection.CELL_2G]  = 'Cell 2G connection';
  states[Connection.CELL_3G]  = 'Cell 3G connection';
  states[Connection.CELL_4G]  = 'Cell 4G connection';
  states[Connection.CELL]     = 'Cell generic connection';
  states[Connection.NONE]     = 'No network connection';
  if (networkState != Connection.WIFI) 
  {
    showBottom('Connection type: ' + states[networkState]);
  }else{
    console.log('Connection type: ' + states[networkState]);
    showBottom('Connection type: ' + states[networkState]);
  }
}


function showBottom(msg) {
  window.plugins.toast.showWithOptions(
  {
    message: msg,
      duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "bottom",
      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
    }
    );
}
function sendTags() {
  window.plugins.OneSignal.sendTags({appversion: "1.0.1"});
  console.log("Tags Sent");
}
function getTags() {
  window.plugins.OneSignal.getTags(function(tags) {
      console.log('Tags Received: ' + JSON.stringify(tags));
      //$state.go('tab.update');
  });
}

function onOnline() {
    // Handle the online event
    var networkState = navigator.connection.type;

    /*if (networkState !== Connection.NONE) {
        if (dataFileEntry) {
            tryToUploadFile();
        }
    }*/
    showToast('Connection type: ' + networkState);
    connectionType = networkState;
}
function onOffline() {
    // Handle the online event
    var networkState = navigator.connection.type;
    showToast('offline:'+networkState);
}
function showToast(msg) {
  window.plugins.toast.showWithOptions(
    {
      message: msg,
      duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "bottom",
      addPixelsY: -40,
          styling: {
          opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
          backgroundColor: '#004d40', // make sure you use #RRGGBB. Default #333333
          textColor: '#FFFFFF', // Ditto. Default #FFFFFF
          textSize: 20.5, // Default is approx. 13.
          cornerRadius: 16 // minimum is 0 (square). iOS default 20, Android default 100
          //horizontalPadding: 20, // iOS default 16, Android default 50
          //verticalPadding: 16 // iOS default 12, Android default 30
      }
    }
  );
}