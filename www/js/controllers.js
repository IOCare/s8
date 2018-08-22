angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, AuthService, $ionicLoading,$timeout, $ionicPopover, $location, $ionicPopup,$ionicSideMenuDelegate) {
  $scope.loginData = {name:null,img:null,email:null};
  $scope.lin = false;
  $scope.count = 0;

	$scope.Init = function(s)
	{

		$scope.show();
		AuthService.Login(s)
		.then(function (response) {
			console.log(response);
			$scope.lin=true;
			lined = true;
			$scope.loginData=response;
			$scope.hide();
			store.set("profile", response);
			window.Hotline.updateUser({ 
			  "name" : response.displayName, 
			  "email" : response.email, 
			  "externalId" : response.userId, 
			  "countryCode" : "+91", 
			  "phoneNumber" : ""//imageUrl
			});
			alert("Welcome "+response.displayName+"!");
			 
		}, function (resp) {
			console.log(resp);
			$scope.hide(); 
			//alert('error: ' + resp);
			$scope.lin=false;
			lined = false;
		});


	}

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Logging in..'
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.logOut = function(){
  	AuthService.Logout();
  	$scope.lin=false;
  	lined = false;
  }

  $scope.getUnreadCount = function(){
	try
	{
	window.Hotline.unreadCount(function(success,val) {
	//success indicates whether the API call was successful
		$scope.count = val;
	});
	}
	catch (err)
	{
		console.log('Error..'+err);
	}	
  }

})



.controller('HomeCtrl', function($scope, Devices, BoardData, $stateParams,$ionicModal,$ionicSideMenuDelegate) {
	$scope.roomdata = {};
	//$scope.deviceData = {}
	$scope.rooms =[];
	//$scope.rooms.names = [];
	//$scope.rooms.data =[];


	$scope.Init = function()
	{
				try{
          Devices.setDevice([1,'ioc','dfdf','sss','rr','bgff']).then(function(result){
						console.log('inserted');
						console.log(result);
					});
				}catch(err){
					console.log('Home Init Error..'+err);
				}


		$ionicSideMenuDelegate.canDragContent(true);
		//$scope.rooms = ['Bedroom1','Bedroom2','Hall1','Kitchen','Hall2'];
		
		/*if(store.get('account')==undefined){
			console.log('undefined account');
		}else
		{
			$scope.accounts = store.get('account');
			console.log($scope.accounts);
		}*/


		if (store.get('rooms')==undefined)
		{
			var names = ['Sanjay Bedroom','Living Room'];
			for(var i = 0; i < names.length; i++) {
			  $scope.rooms.push({id: i, type:'bedroom', name: names[i]});
			}
			store.set('rooms',$scope.rooms);
		}

		$scope.rooms = store.get('rooms');
		//
		console.log($scope.rooms);

	}
	$scope.EditRoom = function(id) {
		$scope.roomdata.name = $scope.rooms[id].name;
		$scope.roomdata.id = id;
		$scope.roomdata.type = $scope.rooms[id].type;

		console.log($scope.roomdata);
		$scope.modal.show();
		//store.set('boards', { id: deviceName, name:deviceName, ip: url });
		//alert('device saved!');
	}
	$scope.AddRoom = function() {
		$scope.roomdata.name = '';
		$scope.roomdata.id = null;
		$scope.roomdata.type = '';

		console.log($scope.roomdata);
		$scope.modal.show();
		//store.set('boards', { id: deviceName, name:deviceName, ip: url });
		//alert('device saved!');

	}
	$scope.SaveRoom = function(u) {
		console.log(u);
		$scope.rooms = store.get('rooms');
		if (u.id==null)
		{
			console.log('New room');
			$scope.rooms.push({id: $scope.rooms.length, type: u.type, name: u.name});
		}else
		{
			$scope.rooms[u.id].name = u.name;
			$scope.rooms[u.id].type = u.type;
			console.log('existing room');
		}
		

		store.set('rooms',$scope.rooms);
		//alert('device saved!');
		$scope.modal.hide();
	}

	$ionicModal.fromTemplateUrl('templates/add-room.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

})

.controller('RoomCtrl', function($scope, DeviceService,$stateParams,$ionicModal,$ionicSlideBoxDelegate) {
	var id = $stateParams.roomid;
    $scope.slide = {};
    $scope.pressedButtonOBJ={};
	$scope.room = {};
	$scope.properties = {};
	$scope.roomdata = {};
	$scope.boards = [];
	$scope.boardButtons = [];
	$scope.slide={v:null};

	$scope.Init = function()
	{

                			
		$scope.boardButtons = [];
		var room = store.get('rooms');
		$scope.room = room[id];
		console.log('in room init ');
		console.log($scope.room);

		var boards = store.get('board');
		$scope.boards = boards.filter(function(obj) {
			return obj.roomid == $scope.room.id; // if truthy then keep item
		});//tested ok
		
		console.log($scope.boards);
		for(var i = 0; i < $scope.boards.length; i++) {
			var buttons = store.get($scope.boards[i].model);
		  $scope.boardButtons.push(buttons);
		}
		console.log($scope.boardButtons);
		try
		{
			$scope.properties={title:'Room - '+$scope.boards[0].model};
		}catch(e)
		{
			$scope.properties={title:'Room - Add Board'};
		}
		
		//$scope.boardButtons[BID][1].state=1;
		
	}
	$scope.AddDevice = function(e)
	{

		$scope.tempboards = store.get('board');
		$scope.roomdata.name = $scope.room.name;
		$scope.roomdata.roomid = $scope.room.id;
		$scope.openModal(1,e);
		//$scope.modal.show();
	}

	$scope.SaveDeviceAssignment = function(u) {
		console.log(u);
		$scope.tempboards = store.get('board');

		$scope.tempboards[u.boardid].roomid = u.roomid;

		//$scope.rooms = store.get('rooms');

		

		store.set('board',$scope.tempboards);
		$scope.Init();
		$scope.closeModal(1);
	}
	$scope.OpenDimmer = function(e,bid)
	{	
		$scope.pressedButtonOBJ.e = e;
		$scope.pressedButtonOBJ.id=e.target.id;
		$scope.pressedButtonOBJ.bid = bid;
		console.log('MyState is:');
		console.log($scope.boardButtons[bid][e.target.id].state);
		$scope.openModal(2,e);
	}

	$scope.onSlide2 = function() {
		console.log("im in slide");
		console.log($scope.boardButtons[$scope.pressedButtonOBJ.bid][$scope.pressedButtonOBJ.id].state);
		$scope.send_to_smitch($scope.pressedButtonOBJ.e,$scope.boardButtons[$scope.pressedButtonOBJ.bid][$scope.pressedButtonOBJ.id].state,$scope.pressedButtonOBJ.bid);
	};


	var Scene1Signature = 255;
    $scope.send_to_smitch = function(event, sw_st,BID)
    {  



	 	    $scope.targetIDs = [254,253,251,247,239,223,191,127];
		  	
		  	console.log(event.target.id)
		    switch(event.target.id) {
		      case '0':
		        if (sw_st)
		        {
		          console.log('im in 1 0');
		          //$scope.stateL1 =0;
		          console.log(sw_st);

		          $scope.boardButtons[BID][event.target.id].state=0;

		          console.log($scope.boardButtons[BID][event.target.id].state);

		          event.target.value=0;
		          Scene1Signature = 1;//Scene1Signature | 1;
				  //Scene1Signature = 0;

		        }
		        else
		        {

		          console.log('im in 0 0');
		          $scope.stateL1 = 1; 
		           console.log(sw_st);
		          $scope.boardButtons[BID][event.target.id].state=1;
		          event.target.value=1;
		          Scene1Signature & $scope.targetIDs[event.target.id];
		          console.log($scope.boardButtons[BID][event.target.id].state);
		        }
		        
		        break;
		      case '1':
		        if (sw_st)
		        {
		          console.log('im in 1 1');
		          $scope.stateL2 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 2;
		        }
		        else
		        {
		          console.log('im in 0 1');
		          $scope.stateL2 = 1; 
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '2':
		        if (sw_st)
		        {
		          console.log('im in 0');
		          $scope.stateL3 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 4;
		        }
		        else
		        {
		          $scope.stateL3 = 1; 
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '3':
		        if (sw_st)
		        {
		          $scope.stateL4 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 8;
				  //Scene1Signature = 0;
		        }
		        else
		        {
		          $scope.stateL4 = 1; 
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '4':
		        if (sw_st)
		        {
		          $scope.stateL5 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 16;
		        }
		        else
		        {
		          $scope.stateL5 = 1; 
		          $scope.boardButtons[0][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '5':
		        if (sw_st)
		        {
		          $scope.stateL6 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 32;
		        }
		        else
		        {
		          $scope.stateL6= 1;  
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '6':
		        if (sw_st)
		        {
		          $scope.stateL7 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 64;
		        }
		        else
		        {
		          $scope.stateL7 = 1; 
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '7':
		        if (sw_st)
		        {
		          $scope.stateL8 =0;
		          $scope.boardButtons[BID][event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 128;
		        }
		        else
		        {
		          $scope.stateL8 = 1; 
		          $scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      default:
		        {}
		    }
				console.log("Signature:");
				console.log(Scene1Signature);
			    console.log($scope.boardButtons[BID][0].url);
				console.log("boardButtons");
				console.log($scope.boardButtons);
			    
				var burl='';
				if ($scope.boardButtons[BID][0].url=='10.1.25.200:80')
				{
					burl = "http://"+$scope.boardButtons[BID][0].url+"/sw?swn=11&state="+Scene1Signature;
				}else if ($scope.boardButtons[BID][0].url=='10.1.25.15:80') 
				{
					burl = "http://"+$scope.boardButtons[BID][0].url+"/boards?swn=11&state="+Scene1Signature;
				}else{
					console.log(event.type);
					if (event.type=="hold"){

						$scope.boardButtons[BID][event.target.id].state = sw_st;
					}else{
						console.log('in switch handler');
				        if (sw_st)
				        {
				          $scope.boardButtons[BID][event.target.id].state=0;
				        }
				        else
				        {
				        	if ($scope.boardButtons[BID][event.target.id].type=="fan"){
				        		$scope.boardButtons[BID][event.target.id].state=99;
				        	}else
				        	{
				        		$scope.boardButtons[BID][event.target.id].state=1;
				        	}
				          
				        }
					}



			    	var b_type;
			    	if ($scope.boardButtons[BID][event.target.id].type=="fan"){b_type=2;}
			    	if ($scope.boardButtons[BID][event.target.id].type=="light"){b_type=1;}
			    	if ($scope.boardButtons[BID][event.target.id].type=="socket"){b_type=1;}
						
					var switchNo=0;
					switchNo = parseInt(event.target.id)+1;
					burl = "http://"+$scope.boardButtons[BID][0].url+"/boards?swn="+switchNo+"&state="+$scope.boardButtons[BID][event.target.id].state+"&type="+b_type;
				}

				var model = $scope.boardButtons[BID][0].model;
				var boardButtons = $scope.boardButtons[BID];
		/*Call Service*/
    	DeviceService.talkToSwitch(burl, model,boardButtons);
    }


    $scope.loadButons = function() { // Init function
	    $.ajax({
	        url: "http://"+boards.ip+"/status",
	        type: 'GET',
	        data: '',
	        beforeSend: function(xhr) { 
	          //xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onCheckLogin");
	          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	        }
	      })
	      .done(function(response) { 
	          console.log(response);
	          var boardStatus = byteString(parseInt(response.data.status));
	          console.log(boardStatus);
	          $scope.buttons.status = boardStatus ;

	          for(var i = 0; i < 8; i++) {
	              $scope.buttons.data.push({id: i, name: $scope.buttons.names[i],state: $scope.buttons.status[i]});
	          }

	        //$ionicLoading.hide();
	    
	      })
	      .fail(function(response) {
	        console.log("in error ");
	        //$ionicLoading.hide();
	      });
    }



$scope.options = {
  loop: false,
  speed: 500,
}

$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
  // data.slider is the instance of Swiper
  console.log('slide');
  console.log(data.slider);
  $scope.slider = data.slider;
});

$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
  console.log('Slide change is beginning');
});

$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
  // note: the indexes are 0-based
  console.log(data.slider.activeIndex);
  $scope.activeIndex = data.slider.activeIndex;
  $scope.previousIndex = data.slider.previousIndex;
  $scope.properties.title = 'Room - ' + $scope.boards[data.slider.activeIndex].model;
  $scope.$apply();
  console.log($scope.properties);
});
function dataChangeHandler(){
  // call this function when data changes, such as an HTTP request, etc
  if ( $scope.slider ){
    $scope.slider.updateLoop();
  }
}
$scope.slideTo = function(index) {
  $ionicSlideBoxDelegate.slide(index);
};
$scope.disableSwipe = function() {
   $ionicSlideBoxDelegate.enableSlide(false);
};

/*Multiple Modal*/
	/*$ionicModal.fromTemplateUrl('templates/add-device.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.closeModal = function() {
	$scope.modal.hide();
	};*/


    // Modal 1
    $ionicModal.fromTemplateUrl('templates/add-device.html', {
      id: '1', // id of add device
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/opendimmer.html', {
      id: '2', // Id of Dimmer
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

    $scope.openModal = function(index,e) {
      if (index == 1)
      {
      	$scope.oModal1.show();
      }else
      {
      	$scope.oModal2.show();
      } 
    };

    $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };

    /* Listen for broadcasted messages */

    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' is hidden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope 
    // and removing the scope from its parent.
    $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });	
/*Multiple Modal*/
	//console.log($scope.room);
})



.controller('CreateScenesController', function($scope, $filter,$state,BoardData, LoginService, DeviceService, $stateParams,$ionicModal) {
	$scope.rooms =[];
	$scope.scenes=[];
	$scope.last_sceneid;
	var id = $stateParams.roomid;
    $scope.pressedButtonOBJ={};
	$scope.room = {};
	$scope.properties = {};
	$scope.roomdata = {};
	$scope.boards = [];
	$scope.boardButtons = [];
	$scope.droproom={id: null};
	$scope.scene = {id:null,schedule:null,name:null,active:1,boards:[]};
	$scope.boardToSend = {id:null,schedule:null,url:"",model:"",board:[]};
	$scope.days=[{state:0},{state:0},{state:0},{state:0},{state:0},{state:0},{state:0}];
	// this is related to date and time picker. The code begins from here
	//$scope.timevalue ={value:new Date()};
	$scope.timevalue = {};
	$scope.timevalue.dt = new Date();

	$scope.changeState = function(e)
	{
		console.log(e.target);
		if($scope.days[e.target.id].state)
		{
			$scope.days[e.target.id].state=0;
		}else{
			$scope.days[e.target.id].state=parseInt(e.target.id);//+1;//Changing to 0 to 6
		}
		store.set("days",$scope.days);
	}	
// function to convert any date time to unix time stamp
	Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
	if(!Date.now) Date.now = function() { return new Date(); }
	Date.time = function() { return Date.now().getUnixTime(); }
	


	$scope.Init = function()
	{
		if (store.get("days")==undefined){
			console.log('days not found!');
			store.set("days",$scope.days);
		}else{
			console.log('days found in store!');
			$scope.days = store.get("days");
			console.log($scope.days);
		}

			store.forEach(function(key, val) {
				console.log(key.indexOf("scene"));
				if (key.indexOf("scene")==0)
				{
					//console.log(key, '=', val);
					$scope.scenes.push(val);
				}
			});
			if ($scope.scenes.length==0)
			{
				$scope.last_sceneid=0
			}else{
				console.log($scope.scenes.length);
				$scope.last_sceneid = $scope.scenes[$scope.scenes.length-1].id;
				$scope.last_sceneid =$scope.last_sceneid +1;
				
			}
			console.log($scope.last_sceneid);
		//$scope.rooms = ['Bedroom1','Bedroom2','Hall1','Kitchen','Hall2'];

		if (store.get('rooms')==undefined)
		{
			alert('No rooms to create scene. Create Rooms in Dashboard.');
		}

		$scope.rooms = store.get('rooms');
		//
		console.log($scope.rooms);

	}


	var Scene1Signature = 255;
    $scope.send_to_smitch = function(light,BID)
    {  
    	console.log('Im in Send');
		console.log(light.id);
		console.log(BID);
		console.log(light.state);

	 	    $scope.targetIDs = [254,253,251,247,239,223,191,127];
		  	
		    switch(light.id) {
		      case 0:
		        if (!light.state)
		        {
		          console.log('im in 1 0');
		          //$scope.stateL1 =0;
		          
		          //$scope.scene.boards[BID][light.id].state=0;
		          //event.target.value=0;
		          Scene1Signature = 1;//Scene1Signature | 1;
				  //Scene1Signature = 0;

		        }
		        else
		        {
		          console.log('im in 0 0');
		          $scope.stateL1 = 1; 
		          
		          //$scope.scene.boards[BID][light.id].state=1;
		          //event.target.value=1;
		          Scene1Signature & $scope.targetIDs[light.id];
		        }
		        
		        break;
		      case 1:
		        if (!light.state)
		        {
		          console.log('im in 1 1');
		          $scope.stateL2 =0;

		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 2;
		        }
		        else
		        {
		          console.log('im in 0 1');
		          $scope.stateL2 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 2:
		        if (!light.state)
		        {
		          console.log('im in 21');
		          $scope.stateL3 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 4;
		        }
		        else
		        {
		          $scope.stateL3 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 3:
		        if (!light.state)
		        {
		        	console.log('im in 0 1');
		          $scope.stateL4 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 8;
				  //Scene1Signature = 0;
		        }
		        else
		        {
		          $scope.stateL4 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 4:
		        if (!light.state)
		        {
		          $scope.stateL5 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 16;
		        }
		        else
		        {
		          $scope.stateL5 = 1; 
		          //$scope.scene.boards[0][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 5:
		        if (!light.state)
		        {
		          $scope.stateL6 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 32;
		        }
		        else
		        {
		          $scope.stateL6= 1;  
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 6:
		        if (!light.state)
		        {
		          $scope.stateL7 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 64;
		        }
		        else
		        {
		          $scope.stateL7 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 7:
		        if (!light.state)
		        {
		          $scope.stateL8 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 128;
		        }
		        else
		        {
		          $scope.stateL8 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      default:
		        {}
		    }
				console.log("Signature:");
				console.log(Scene1Signature);
			    //console.log($scope.boardButtons[BID][0].url);
				console.log("boardButtons");
				console.log($scope.boardButtons);
			    
				var burl='';
				if ($scope.boardButtons[BID][0].url=='10.1.25.142:80')
				{
					burl = "http://"+$scope.boardButtons[BID][0].url+"/sw?swn=11&state="+Scene1Signature;
				}else if ($scope.boardButtons[BID][0].url=='10.1.25.15:80') 
				{
					burl = "http://"+$scope.boardButtons[BID][0].url+"/boards?swn=11&state="+Scene1Signature;
				}else{
					var s;
					if(light.state>1){
						$scope.boardButtons[BID][light.id].state = light.state;
						s=light.state;
					}else{
						
				        if (light.state)
				        {
				          s=1;
				        }
				        else
				        {
				          s=0;
				        }

					}
					

   					var b_type;
			    	if (light.type=="fan"){b_type=2;}
			    	if (light.type=="light"){b_type=1;}
			    	if (light.type=="socket"){b_type=1;}
						
					var switchNo=0;
					switchNo = parseInt(light.id)+1;
					burl = "http://"+$scope.boardButtons[BID][0].url+"/boards?swn="+switchNo+"&state="+s+"&type="+b_type;
				}

				var model = $scope.boardButtons[BID][0].model;
				var boardButtons = $scope.boardButtons[BID];
				
		/*Call Service*/
    	DeviceService.talkToSwitch(burl, model,boardButtons);
    }


	$scope.LoadRoom = function()
	{



		console.log($scope.droproom.id);
		$scope.boardButtons = [];
		var room = store.get('rooms');
		$scope.room = room[$scope.droproom.id];
		console.log('in room init ');
		console.log($scope.room);

		var boards = store.get('board');
		$scope.boards = boards.filter(function(obj) {
			return obj.roomid == $scope.droproom.id; 
		});
		
		console.log($scope.boards);
		for(var i = 0; i < $scope.boards.length; i++) {
			var buttons = store.get($scope.boards[i].model);
		  $scope.boardButtons.push(buttons);
		}
		console.log($scope.boardButtons);
		try
		{
			$scope.properties={title:'Room - '+$scope.boards[0].model};
		}catch(e)
		{
			$scope.properties={title:'Room - Add Board'};
		}
		
		//$scope.boardButtons[BID][1].state=1;
		
		
	}

	$scope.SaveScene = function()
	{

		if ($scope.scene.name==null)
			{alert('Scene name empty!');
				return false;
			}
			var t = $filter('date')($scope.timevalue.dt,"hh:mm:ss a");
			console.log(t);
			//console.log($scope.timevalue.dt);
	        //var parsedUnixTime = new Date($scope.datee.dd).getUnixTime();
			//var IndiaUnixTimeStamp = parsedUnixTime + 18000 + 1800; // +5:30 hours

			$scope.scene.schedule = $scope.days[0].state+","+$scope.days[1].state+","+$scope.days[2].state+","+$scope.days[3].state+","+$scope.days[4].state+","+$scope.days[5].state+","+$scope.days[6].state+"#"+t;
			console.log($scope.scene.schedule);
			//$scope.scene.schedule = IndiaUnixTimeStamp;
			//console.log(IndiaUnixTimeStamp);
			//ScenesData.SetdvcList($scope.scene);
			console.log($scope.scene);
			$scope.scene.boards = $scope.boardButtons;
			console.log($scope.scene);
			$scope.scene.id = $scope.last_sceneid;
			store.set('scene'+$scope.last_sceneid,$scope.scene);
			$scope.ActivateScene($scope.scene);
			//alert("Scene Saved!");
			$state.go("app.scenes");
		
	}
	$scope.ActivateScene = function(scene)
	{
		//console.log(scene);
		$scope.boardToSend.id = scene.id;
		$scope.boardToSend.schedule = scene.schedule;
		$.each(scene.boards, function (i, board) {
		    
		    $scope.boardToSend.board = board;
		    //id:null,switches:null,url:"",model:"",board:[]
		    //var boardbyModel = store.get(board[i].model);

		    $scope.boardToSend.model=board[i].model;


		    $scope.boardToSend.url=board[i].url;
		    //$scope.boardToSend.id=boardbyModel.id;

		    console.log($scope.boardToSend);
		    LoginService.onSendBoard($scope.boardToSend);
		});

	}
})


.controller('ScenesController', function($scope,$state, ScenesData,LoginService,$stateParams,$ionicModal,$ionicSlideBoxDelegate) {
	 $scope.shouldShowDelete = false;
	 $scope.shouldShowReorder = false;
	 $scope.listCanSwipe = true
	 $scope.scenestate={showactive:null};


	$scope.properties = {};
	$scope.scenes = [];
	$scope.properties ={title:'Scenes'};
	$scope.boardToSend = {id:null,schedule:null,url:"",model:"",board:[]}

	$scope.UndoScene = function(scene)
	{
		scene.active=1;
	}

	$scope.CreateScene = function()
	{
		$state.go('app.createscene');
	}

	$scope.ShowInactive = function()
	{
		
		store.set('scstate',$scope.scenestate.showactive);
		console.log($scope.scenestate.showactive);
	}

	$scope.Init = function()
	{
		
		$scope.scenes = [];
		if(store.get("scstate")==undefined){
			console.log('undefined scenes');
			store.set('scstate',false);
		}else{
			$scope.scenestate.showactive = store.get("scstate");
		}
		//if(store.get("scene1")==undefined){
			//console.log('undefined scenes');
		//	store.set('scene1',sc1);
		//}else
		//{
			store.forEach(function(key, val) {
				console.log(key.indexOf("scene"));
				if (key.indexOf("scene")==0)
				{
					//console.log(key, '=', val);
					$scope.scenes.push(val);
				}
			});


			//var scenes = store.get('scenes');
			//ScenesData.SetdvcList(scenes);
			//$scope.scenes = scenes;
			console.log("All Scenes:");
			console.log($scope.scenes);
			ScenesData.SetdvcList($scope.scenes);

		//}

	}

	$scope.ActivateScene = function(scene)
	{
		//console.log(scene);
		$scope.boardToSend.id = scene.id;
		$scope.boardToSend.schedule = scene.schedule;
		$.each(scene.boards, function (i, board) {
		    
		    $scope.boardToSend.board = board;
		    //id:null,switches:null,url:"",model:"",board:[]
		    //var boardbyModel = store.get(board[i].model);

		    $scope.boardToSend.model=board[i].model;


		    $scope.boardToSend.url=board[i].url;
		    //$scope.boardToSend.id=boardbyModel.id;

		    console.log($scope.boardToSend);
		    LoginService.onSendBoard($scope.boardToSend);
		});

	}
	$scope.EditScene = function(scene)
	{
		//console.log(scene);
		$state.go("app.scene", {'id': scene.id});

	}
	$scope.DeleteScene = function(scene)
	{
		var sceneTodelet = store.get('scene'+scene.id);
		$scope.scenes.splice($scope.scenes.indexOf(scene), 1);
		sceneTodelet.active = 0;
        console.log(sceneTodelet);
		store.set('scene'+scene.id,sceneTodelet);
		$scope.Init();
	}	
	$scope.RestoreScene = function(scene)
	{
		var sceneTodelet = store.get('scene'+scene.id);
		$scope.scenes.splice($scope.scenes.indexOf(scene), 1);
		sceneTodelet.active = 1;
        console.log(sceneTodelet);
		store.set('scene'+scene.id,sceneTodelet);
		$scope.Init();
	}	
})


.controller('SceneCtrl', function($scope,ScenesData, $state, LoginService, DeviceService,$stateParams,$ionicModal) {//Board Configurator
	var sceneid = $stateParams.id;
	$scope.scene = {}
	$scope.buttons ={};
	$scope.buttons.names = [];
	$scope.buttons.data =[];
	$scope.formatted={date:null};
	$scope.boardToSend = {id:null,schedule:null,url:"",model:"",board:[]}
	// this is related to date and time picker. The code begins from here

	$scope.datee = { //declare a object date variable for 2 way binding
		"dd":"0"
	};
	
// function to convert any date time to unix time stamp
	Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
	if(!Date.now) Date.now = function() { return new Date(); }
	Date.time = function() { return Date.now().getUnixTime(); }
	
// function to call on hit of save button
		//$scope.datee.dd = $scope.datetimeValue;

// code ends here. 	
	
	$scope.Init = function()
	{
		console.log(sceneid);
		$scope.scene = ScenesData.GetdvcListById(sceneid);
		console.log($scope.scene );
		//var t = new Date($scope.scene.schedule);
		var d = moment.unix($scope.scene.schedule- 18000 - 1800);
		console.log(moment(d).format("YYYY-MM-DD HH:mm:ss"));
		//t.setSeconds($scope.scene.schedule - 18000 - 1800);
		$scope.formatted.date = moment(d).format("YYYY-MM-DD HH:mm:ss");

		//if (store.get($scope.myboard.model)!=undefined)//defined
		//{moment(fulldate).format("yyyy-MM-dd H:mm:ss");
			//$scope.buttons.data = store.get($scope.myboard.model);
		//}

	}
	$scope.SaveScene = function(sceneid)
	{



		console.log(sceneid);
		console.log($scope.formatted.date);
        var parsedUnixTime = new Date($scope.formatted.date).getUnixTime();
		var IndiaUnixTimeStamp = parsedUnixTime + 18000 + 1800; // +5:30 hours
		$scope.scene.schedule = IndiaUnixTimeStamp;
		console.log(parsedUnixTime);
		//ScenesData.SetdvcList($scope.scene);
		console.log($scope.scene);
		store.set('scene'+sceneid,$scope.scene);
		$scope.ActivateScene($scope.scene);
		//alert("Scene Saved!");
		$state.go("app.scenes");
	}

	$scope.ActivateScene = function(scene)
	{
		//console.log(scene);
		$scope.boardToSend.id = scene.id;
		$scope.boardToSend.schedule = scene.schedule;
		$.each(scene.boards, function (i, board) {
		    
		    $scope.boardToSend.board = board;
		    //id:null,switches:null,url:"",model:"",board:[]
		    //var boardbyModel = store.get(board[i].model);

		    $scope.boardToSend.model=board[i].model;


		    $scope.boardToSend.url=board[i].url;
		    //$scope.boardToSend.id=boardbyModel.id;

		    console.log($scope.boardToSend);
		    LoginService.onSendBoard($scope.boardToSend);
		});

	}
	var Scene1Signature = 255;
    $scope.send_to_smitch = function(light,BID)
    {  
    	console.log('Im in Send');
		console.log(light.id);
		console.log(BID);
		console.log(light.state);

	 	    $scope.targetIDs = [254,253,251,247,239,223,191,127];
		  	
		    switch(light.id) {
		      case 0:
		        if (!light.state)
		        {
		          console.log('im in 1 0');
		          //$scope.stateL1 =0;
		          
		          //$scope.scene.boards[BID][light.id].state=0;
		          //event.target.value=0;
		          Scene1Signature = 1;//Scene1Signature | 1;
				  //Scene1Signature = 0;

		        }
		        else
		        {
		          console.log('im in 0 0');
		          $scope.stateL1 = 1; 
		          
		          //$scope.scene.boards[BID][light.id].state=1;
		          //event.target.value=1;
		          Scene1Signature & $scope.targetIDs[light.id];
		        }
		        
		        break;
		      case 1:
		        if (!light.state)
		        {
		          console.log('im in 1 1');
		          $scope.stateL2 =0;

		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 2;
		        }
		        else
		        {
		          console.log('im in 0 1');
		          $scope.stateL2 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 2:
		        if (!light.state)
		        {
		          console.log('im in 0');
		          $scope.stateL3 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 4;
		        }
		        else
		        {
		          $scope.stateL3 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 3:
		        if (!light.state)
		        {
		        	console.log('im in 0 1');
		          $scope.stateL4 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 8;
				  //Scene1Signature = 0;
		        }
		        else
		        {
		          $scope.stateL4 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 4:
		        if (!light.state)
		        {
		          $scope.stateL5 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 16;
		        }
		        else
		        {
		          $scope.stateL5 = 1; 
		          //$scope.scene.boards[0][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 5:
		        if (!light.state)
		        {
		          $scope.stateL6 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 32;
		        }
		        else
		        {
		          $scope.stateL6= 1;  
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 6:
		        if (!light.state)
		        {
		          $scope.stateL7 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 64;
		        }
		        else
		        {
		          $scope.stateL7 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      case 7:
		        if (!light.state)
		        {
		          $scope.stateL8 =0;
		          //$scope.scene.boards[BID][light.id].state=0;
		          Scene1Signature = Scene1Signature | 128;
		        }
		        else
		        {
		          $scope.stateL8 = 1; 
		          //$scope.scene.boards[BID][light.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[light.id];
		        }
		        break;
		      default:
		        {}
		    }
				console.log("Signature:");
				console.log(Scene1Signature);
			    //console.log($scope.boardButtons[BID][0].url);
				console.log("boardButtons");
				console.log($scope.scene.boards);
			    
				var burl='';
				if ($scope.scene.boards[BID][0].url=='10.1.25.14:80')
				{
					burl = "http://"+$scope.scene.boards[BID][0].url+"/sw?swn=11&state="+Scene1Signature;
				}else if ($scope.scene.boards[BID][0].url=='10.1.25.15:80') 
				{
					burl = "http://"+$scope.scene.boards[BID][0].url+"/boards?swn=11&state="+Scene1Signature;
				}else{
					var s;
					if(light.state>1){
						$scope.scene.boards[BID][light.id].state = light.state;
						s=light.state;
					}else{
						
				        if (light.state)
				        {
				          s=1;
				        }
				        else
				        {
				          s=0;
				        }

					}

   					var b_type;
			    	if (light.type=="fan"){b_type=2;}
			    	if (light.type=="light"){b_type=1;}
			    	if (light.type=="socket"){b_type=1;}
					
					var switchNo=0;
					switchNo = parseInt(light.id)+1;
					burl = "http://"+$scope.scene.boards[BID][0].url+"/boards?swn="+switchNo+"&state="+s+"&type="+b_type;
				}

				var model = $scope.scene.boards[BID][0].model;
				var boardButtons = $scope.scene.boards[BID];
		/*Call Service*/
    	DeviceService.talkToSwitch(burl, model,boardButtons);
    }




})

.controller('SwitchesCtrl', function($scope, $stateParams) {

})

.controller('RemoteTypeCtrl', function($scope, $stateParams,IRService) {
	var sceneid = $stateParams.id;

	$scope.types = [];
	$scope.Init = function()
	{//GetBrands
		console.log('in Home Init');
		IRService.GetTypes()
		.then(function (response) {
				console.log(response);
				$scope.types = response;
			}, function (resp) {
				console.log(resp);
				//alert('Error Connecting to server. Make sure you have active Internet connection!');
			});

		
	}	

})
.controller('BrandsCtrl', function($scope, $stateParams,IRService) {
	$scope.typeID = $stateParams.id;
	$scope.listlength = 20;
	$scope.brands = [];
	$scope.Init = function()
	{//GetBrands
		console.log('in Home Init');
		IRService.GetBrandsByType($scope.typeID)
		.then(function (response) {
				console.log(response);
				$scope.brands = response;
			}, function (resp) {
				console.log(resp);
				//alert('Error Connecting to server. Make sure you have active Internet connection!');
			});

		
	}	
   $scope.loadMore = function(){
    if (!$scope.friends){
      $scope.$broadcast('scroll.infiniteScrollComplete');
      return;
    }

    if ($scope.listlength < $scope.friends.length)
      $scope.listlength+=10;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }
})

.controller('RemoteCtrl', function($scope, $stateParams,IRService) {
	$scope.brand = $stateParams.brand;
	$scope.type = $stateParams.type;
	$scope.keys=[];
	$scope.Init = function()
	{
		console.log($scope.brand);
		console.log($scope.type);
		IRService.FetchCode($scope.brand,$scope.type)
		.then(function (response) {
				console.log(response);
				$scope.keys = response;
			}, function (resp) {
				console.log(resp);
				//alert('Error Connecting to server. Make sure you have active Internet connection!');
			});

		
	}
	$scope.SendGC = function(event)
	{
		var code = $scope.keys[event.target.id].code;
		code = code.substring(4)+"\r\n";
		//console.log(code);
		//console.log($scope.keys);
		var array = code.split(',');
		console.log(array.length);
		IRService.sendGCcode(code,array.length);
	}



})

.controller('LoadCtrl', function($scope, $stateParams,$ionicLoading) {
		$scope.hide = function(){
		$ionicLoading.hide();
		console.log('trying to hid');
	}
})

.controller('ConfigureCtrl', function($scope, Devices, BoardData, DeviceService,$stateParams,$ionicLoading, $ionicPopover) {

  $scope.SSDPdevices = {};
  $scope.storageDevice = [];
  $scope.deviceData = {}

  $scope.doRefresh = function() {

		$scope.RunDiscovery();

  };


	$scope.show = function() {
		$ionicLoading.show({
			template: '<div ng-controller="LoadCtrl">Scaning....<br /><br /><button ng-click="hide()" class="button button-positive button-icon icon ion-close-circled"></button></div>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 0
		});
	}
	$scope.hide = function(){
		$ionicLoading.hide();
		console.log('trying to hid');
	}
	$scope.init = function()
	{
		console.log("im in discovery...");
		$scope.show();
		//$scope.boards = [];
		try{
		console.log(store.get('board'));
		}
		catch(e){
			console.log(e);
		}
		if (store.get('board')==undefined)
		{
			console.log("im in undefined...");
			try{
				$scope.RunDiscovery();
			}
			catch(e){
				console.log(e);
			}

		}else
		{
			console.log("im in defined...");
			$scope.boards = store.get('board');
			BoardData.SetdvcList($scope.boards);
			//$scope.fsuccess(devices);
			$scope.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
	$scope.RunDiscovery = function()
	{
		console.log("im in scan discovery...");
		$scope.show();
		$scope.boards = [];

		DeviceService.GetBoards("https://www.iocare.in/mehta.json")
		.then(function (response) {
				console.log(response);
				$scope.boards = JSON.parse(response);

				store.set('board',$scope.boards);

				angular.forEach($scope.boards, function(board) {
						Devices.setDevice(board).then(function(result){
							console.log('inserted');
							console.log(result);
	
						});
				});
	
				$scope.hide();
				console.log("Boards");
				console.log($scope.boards);
				console.log("detecting devices");
				//$scope.dd = DeviceData;
				console.log(BoardData.SetdvcList($scope.boards));///clever
				$scope.$broadcast('scroll.refreshComplete');
				
			}, function (resp) {
				console.log(resp);
				$scope.hide();
				//alert('Error Connecting to server. Make sure you have active Internet connection!');
			});



	}
	$scope.fsuccess = function(devices)
	{
		console.log(devices);
		//store.set('board',devices);
		//| filter:{server:'SMITCH'}
		$scope.boards = [];

		$scope.boards = devices.filter(function(obj) {
			try{
				var company = obj.Server.split(' ')[0];
				return ((company == 'ioCare/1.0') || (company == 'Arduino/1.0')); // if truthy then keep item
			}
			catch(err){
				console.log(err);
			}
			
		}).map(function(obj,index) {
		   var rObj = {};

			try {
				//http://10.1.25.14:80/description.xml"
				var server = obj.LOCATION;
	    		var ip;
			    if (server.indexOf("://") > -1) {
			        ip = server.split('/')[2];
			    }
			    else {
			        ip = server.split('/')[0];
			    }

    			//find & remove port number
    			//ip = url.split('/')[2].split(':')[0];

				var company = obj.Server.split(' ')[0];
				var modelType = obj.Server.split(' ')[2];
				var model = modelType.split('/')[0];
				var type = modelType.split('/')[1];
					rObj["id"] = index;
					rObj["company"] = company;
					rObj["config"] = obj.xml;
					rObj["model"] = model;
					rObj["type"] = type;
					rObj["url"] = ip;
					rObj["roomid"] = null;
			}
			catch(err) {
				console.log(err+' - Error in SSDP');
			}
		   return rObj;
		});

		store.set('board',$scope.boards);

            angular.forEach($scope.boards, function(board) {
                Devices.setDevice(board).then(function(result){
		        			console.log('inserted');
		        			console.log(result);
			    			});
            });



		//$scope.boards = devices;
		console.log("devices");
		console.log(devices);
		console.log("Boards");
		console.log($scope.boards);
		console.log("detecting devices");
		//$scope.dd = DeviceData;
		console.log(BoardData.SetdvcList($scope.boards));///clever
		$scope.hide();
		$scope.$broadcast('scroll.refreshComplete');

	}
	$scope.ffailure = function()
	{
		console.log("Failed..");
	}


  $scope.scanDevices = function()
  {
		//serviceDiscovery.getNetworkServices(serviceType, $scope.ssdpSuccess, $scope.ssdpFailure); 
		$scope.RunDiscovery();
    console.log('discovering...'); 
  }

  $scope.ssdpSuccess = function(devices) {
      console.log(devices);
      $scope.SSDPdevices = devices;
      $scope.$apply();
  }

  $scope.ssdpFailure = function() {
      alert("Error calling Service Discovery Plugin");
  }


})

.controller('BoardCtrl', function($scope, DeviceService,BoardData, $stateParams,$ionicModal) {//Board Configurator
	var id = $stateParams.boardId;
	$scope.deviceData = {}
	$scope.buttons ={};
	$scope.buttons.names = [];
	$scope.buttons.data =[];
	

	$scope.Init = function()
	{
		$scope.myboard = BoardData.GetdvcListById(id);
		console.log("all my boards");
		console.log($scope.myboard)
		if (store.get($scope.myboard.model)!=undefined)//defined
		{
			$scope.buttons.data = store.get($scope.myboard.model);
			if ($scope.myboard.type == "Switch8"){
				for(var i = 0; i < 8; i++) {
					$scope.buttons.data[i].url =$scope.myboard.url;
				}	//update board button URls from new scanned board
			}else{
				for(var i = 0; i < 4; i++) {
					$scope.buttons.data[i].url =$scope.myboard.url;
				}	//update board button URls from new scanned board
			}

		}
	
		console.log($scope.myboard);
	
		if (($scope.myboard.type == "Switch8") || ($scope.myboard.type == "Smitch"))
		{
			$scope.buttons.names = ['Light1','Light2','Light3','Light4','Light5','Light6','Light7','Light8'];
			$scope.buttons.status = [0,0,0,0,0,0,0,0];

			if (store.get($scope.myboard.model)==undefined)
			{
				console.log('in ud');
				for(var i = 0; i < 8; i++) {
				  $scope.buttons.data.push({id: i, url:$scope.myboard.url,type:'light', name: $scope.buttons.names[i],state: $scope.buttons.status[i],model:$scope.myboard.model});
				}
			}

		}else
		{
			$scope.buttons.names = ['Light1','Light2','Light3','Light4'];
			$scope.buttons.status = [0,0,0,0];

			if (store.get($scope.myboard.model)==undefined)
			{
				console.log('in ud4');
				for(var i = 0; i < 4; i++) {
				  $scope.buttons.data.push({id: i, url:$scope.myboard.url,type:'light', name: $scope.buttons.names[i],state: $scope.buttons.status[i],model:$scope.myboard.model});
				}
			}

		}
		$scope.SaveBoardConfig();
	}

//Scene related to board has to be deleted if boards are reconfigured.

	var Scene1Signature = 255;
    $scope.send_to_smitch = function(event, sw_st,BID) //Board Controller wala
    {  
    		console.log(event);
    		console.log(sw_st);
    		
    		BID = id;
    		console.log(BID);
	 	    $scope.targetIDs = [254,253,251,247,239,223,191,127];
		  	
		    switch(event.target.id) {
		      case '0':
		        if (sw_st)
		        {
		          console.log('im in 1 0');
		          //$scope.stateL1 =0;
		          
		          $scope.buttons.data[event.target.id].state=0;
		          event.target.value=0;
		          Scene1Signature = 1;//Scene1Signature | 1;
				  //Scene1Signature = 0;

		        }
		        else
		        {
		          console.log('im in 0 0');
		          $scope.stateL1 = 1; 
		          
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }

		          event.target.value=1;
		          Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        
		        break;
		      case '1':
		        if (sw_st)
		        {
		          console.log('im in 1 1');
		          $scope.stateL2 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 2;
		        }
		        else
		        {
		          console.log('im in 0 1');
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }		          

		          $scope.stateL2 = 1; 
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '2':
		        if (sw_st)
		        {
		          console.log('im in 0');
		          $scope.stateL3 =0;
		          //$scope.boardButtons[BID][event.target.id].state=0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 4;
		        }
		        else
		        {
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }		          
		          $scope.stateL3 = 1; 
		          //$scope.boardButtons[BID][event.target.id].state=1;
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '3':
		        if (sw_st)
		        {
		          $scope.stateL4 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 8;
				  //Scene1Signature = 0;
		        }
		        else
		        {
		        	console.log('in in in in in ');
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }		          
		          $scope.stateL4 = 1; 
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '4':
		        if (sw_st)
		        {
		          $scope.stateL5 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 16;
		        }
		        else
		        {
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }		          
		          $scope.stateL5 = 1; 
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '5':
		        if (sw_st)
		        {
		          $scope.stateL6 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 32;
		        }
		        else
		        {
		          
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }
		          $scope.stateL6= 1;  
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '6':
		        if (sw_st)
		        {
		          $scope.stateL7 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 64;
		        }
		        else
		        {
		          
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }
		          $scope.stateL7 = 1; 
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      case '7':
		        if (sw_st)
		        {
		          $scope.stateL8 =0;
		          $scope.buttons.data[event.target.id].state=0;
		          Scene1Signature = Scene1Signature | 128;
		        }
		        else
		        {
		          
		          if ($scope.buttons.data[event.target.id].type=="fan"){
		          		$scope.buttons.data[event.target.id].state=50;
		          }else{
		          		$scope.buttons.data[event.target.id].state=1;
		          }
		          $scope.stateL8 = 1; 
		          Scene1Signature = Scene1Signature & $scope.targetIDs[event.target.id];
		        }
		        break;
		      default:
		        {}
		    }
				console.log("Signature:");
				console.log(Scene1Signature);
				console.log("URL:");
			    console.log($scope.buttons.data[event.target.id].url);
				console.log("boardButtons");
				//console.log($scope.boardButtons);
			    
				var burl='';
				if ($scope.buttons.data[event.target.id].url=='10.1.25.14:80')
				{
					burl = "http://"+$scope.buttons.data[event.target.id].url+"/sw?swn=11&state="+Scene1Signature;
				}else if ($scope.buttons.data[event.target.id].url=='10.1.25.15:80') 
				{
					burl = "http://"+$scope.buttons.data[event.target.id].url+"/boards?swn=11&state="+Scene1Signature;
				}else{

   					var b_type;
			    	if ($scope.buttons.data[event.target.id].type=="fan"){b_type=2;}
			    	if ($scope.buttons.data[event.target.id].type=="light"){b_type=1;}
			    	if ($scope.buttons.data[event.target.id].type=="socket"){b_type=1;}

					var switchNo=0;
					switchNo = parseInt(event.target.id)+1;
					burl = "http://"+$scope.buttons.data[event.target.id].url+"/boards?swn="+switchNo+"&state="+$scope.buttons.data[event.target.id].state+"&type="+b_type;
				}

				var model = $scope.buttons.data[event.target.id].model;
				var boardButtons = $scope.buttons.data;
		/*Call Service*/
    	DeviceService.talkToSwitch(burl, model,boardButtons);
    }



	$scope.SaveBoardConfig = function() {
		console.log($scope.buttons.data);
		store.set($scope.myboard.model,$scope.buttons.data);

	}

  $scope.EditDevice = function(id) {
  	
	//$scope.myboard = BoardData.GetdvcListById(id);
	//console.log(id);
    $scope.deviceData.name = $scope.buttons.data[id].name;
    $scope.deviceData.url = $scope.buttons.data[id].url;
	$scope.deviceData.id = id;
	$scope.deviceData.type = $scope.buttons.data[id].type;

    console.log($scope.deviceData);
    $scope.modal.show();
    //store.set('boards', { id: deviceName, name:deviceName, ip: url });
    //alert('device saved!');
  }

  $scope.SaveDevice = function(u) {
    console.log(u);
	$scope.buttons.data[u.id].name = u.name;
	$scope.buttons.data[u.id].type = u.type;
	store.set($scope.myboard.model,$scope.buttons.data);
    //alert('device saved!');
    $scope.modal.hide();
  }

  $ionicModal.fromTemplateUrl('templates/edit-device.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };


})

.controller('LoginCtrl', function($scope,LoginService, $ionicPopup, $location, $state, $stateParams,$ionicSideMenuDelegate) {
//StatusBar.hide();
   $scope.data = {};
 $ionicSideMenuDelegate.canDragContent(false);
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //$state.go('app.home');
			$location.path('/app/home')
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})
.controller('SettingsCtrl', function($scope, $stateParams,$ionicLoading) {
	$scope.routers = [];
	$scope.settingsData = {externalIp:'',home_router:''};

	$scope.onInit = function(value) {
		console.log("In settings");
		$scope.settingsData = store.get('settingsData');

		//WifiWizard.listNetworks($scope.listHandler, $scope.fail);
		//WifiWizard.getScanResults({numLevels: false}, $scope.listHandler, $scope.fail);
		$scope.show();

	};



	$scope.listHandler = function(ssids) {
		console.log(ssids);

		$scope.routers = ssids.filter(function(obj) {
			return obj != '"""'; 
		});
		console.log($scope.routers);
		$scope.hide();
	};

	$scope.fail = function(value) {
		console.log(value);
		$scope.hide();
	};
	$scope.SaveSettings = function() {
		console.log($scope.settingsData);
		$scope.settingsData.home_router = $scope.settingsData.home_router.replace(/"/g , "");
		store.set('settingsData',$scope.settingsData);
		console.log('Setting Saved!');
	};
	$scope.show = function() {
		$ionicLoading.show({
			template: '<div ng-controller="LoadCtrl">Scaning Network..<br /><br /><button ng-click="hide()" class="button button-positive button-icon icon ion-close-circled"></button></div>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
	}
	$scope.hide = function(){
		$ionicLoading.hide();
		console.log('trying to hid');
	}

})

.controller('AboutCtrl', function($scope, $stateParams) {
	$scope.ver = "0.0";
	$scope.onInit = function(value) {
		$scope.ver = appVersion;
	};
})


.controller('MessagesCtrl', function($scope, BoardData, $stateParams,$ionicLoading, $ionicPopover) {
	$scope.msgs = [];

	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true

	$scope.data = {
		showDelete: false
	};

	$scope.view = function(item) {
		alert(item.notification.payload.body);
	};
	$scope.share = function(item) {
		alert('Share It -  Coming Soon! ');
	};

	$scope.moveItem = function(item, fromIndex, toIndex) {
		$scope.msgs.splice(fromIndex, 1);
		$scope.msgs.splice(toIndex, 0, item);
	};

	$scope.onItemDelete = function(item) {
		$scope.msgs.splice($scope.msgs.indexOf(item), 1);
		store.set('msgs',$scope.msgs);
	};

  $scope.doRefresh = function() {

  };


	$scope.show = function() {
		$ionicLoading.show({
			template: '<div ng-controller="LoadCtrl">Scaning....<br /><br /><button ng-click="hide()" class="button button-positive button-icon icon ion-close-circled"></button></div>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 0
		});
	}
	$scope.hide = function(){
		$ionicLoading.hide();
		console.log('trying to hid');
	}
	$scope.init = function()
	{
		console.log("im in init...");
		//$scope.show();

		if (store.get('msgs')==undefined)
		{
		}else
		{
			$scope.msgs = store.get('msgs')
		}
	}

	$scope.fsuccess = function(devices)
	{
		$scope.boards = [];

		$scope.boards = devices.filter(function(obj) {
			var company = obj.server.split(' ')[0];
			return company == 'ioCare/1.0'; // if truthy then keep item
		}).map(function(obj,index) {
		   var rObj = {};

			try {
				var company = obj.server.split(' ')[0];
				var modelType = obj.server.split(' ')[2];
				var model = modelType.split('/')[0];
				var type = modelType.split('/')[1];
					rObj["id"] = index;
					rObj["company"] = company;
					rObj["config"] = obj.config;
					rObj["model"] = model;
					rObj["type"] = type;
					rObj["url"] = obj.url;
					rObj["roomid"] = null;
			}
			catch(err) {
				console.log(err+' - Error in SSDP');
			}
		   return rObj;
		});

		//store.set('board',$scope.boards);

	}


})
.controller('MessageCtrl', function($scope, $stateParams,$ionicLoading, $ionicPopover) {
	$scope.mid = $stateParams.mid;
	$scope.msg = {};
	$scope.Init = function()
	{
		var msgs = store.get('msgs');
		$scope.msg = msgs[$scope.mid];
	}

})
.factory('BoardData', function() {
   return {
        dvcList: [],
        GetdvcList: function () {
            return this.dvcList;
        },
        SetdvcList: function (dvc) {
			this.dvcList = dvc;
            return true;
        },
        GetdvcListById: function (id) {
            //iterate MoviesList and return proper movie
			return this.dvcList[id];
        }
    }
})
.factory('ScenesData', function() {
   return {
        scenes: [],
        GetdvcList: function () {
            return this.scenes;
        },
        SetdvcList: function (scenes) {
			this.scenes = scenes;
		//	store.set('scenes', scenes);
            return true;
        },
        GetdvcListById: function (id) {
            //iterate MoviesList and return proper movie
			return this.scenes[id];
        }
    }
})


/* configure moment relative time
moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});*/