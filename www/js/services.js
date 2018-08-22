angular.module('starter.services', ['starter.config'])

.service('AuthService', function ($q, $http) {
    return {
	
		Login: function (s) {
			var deferred = $q.defer(),
                promise = deferred.promise;

            //g-Auth Starts
            try{
            	if (s) 
            	{
					window.plugins.googleplus.trySilentLogin(
					    {
					      //'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
					      'webClientId': '234825981747-geubot7c3sua02ccnma32a7elm49t550.apps.googleusercontent.com', // optional Web clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
					      'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
					    },
					    function (obj) {
							deferred.resolve(obj);
					    },
					    function (msg) {
					      	deferred.reject(msg);
					    }
					);
            	}else
            	{
					window.plugins.googleplus.login(
					    {
					      //'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
					      'webClientId': '234825981747-geubot7c3sua02ccnma32a7elm49t550.apps.googleusercontent.com', // optional Web clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
					      'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
					    },
					    function (obj) {
							deferred.resolve(obj);
					    },
					    function (msg) {
					      	deferred.reject(msg);
					    }
					);            		
            	}


			}
			catch (err)
			{
				console.log('Error..'+err);
				deferred.reject(err);
			}

			//g-Auth Ends
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },
		Logout: function () {
			var deferred = $q.defer(),
                promise = deferred.promise;

            //g-Auth Starts
			window.plugins.googleplus.logout(
				function (msg) {
					deferred.resolve(msg);
				}
			);
			//g-Auth Ends
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    }

	};
})

.service('DeviceService', function ($q, $http) {
    return {
	
		showToast1:function (msg) {
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
		},
		GetBoards: function (burl) {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts
		    $.ajax({
		        url: ""+burl,
		        type: 'GET',
		        data: '',
		        beforeSend: function(xhr) { 
		          //xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onCheckLogin");
				  xhr = {};
		          //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
			  //console.log(response);

				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },				
		talkToSwitch: function (burl, model,boardButtons) {
			var deferred = $q.defer(),
                promise = deferred.promise;


                //this.showToast1('sent'+model);
                var settingsData = store.get('settingsData');

                var ipLast = burl.split('.')[3];
                var ipLastDigit = ipLast.split(':')[0];
                var parameters = ipLast.split(':')[1];
                parameters = parameters.split('/')[1];
                
                var forwardPort = parseInt(ipLastDigit)+40000;
                console.log('IPLAST:'+forwardPort);
                console.log(connectionType);
                //if ((connectionType=='2g') || (connectionType=='3g') || (connectionType=='4g'))
                //{
                	
                //	burl = "http://"+settingsData.externalIp+":"+forwardPort+"/"+parameters;
                //}else 
                //{
                	//if (ssidName!=settingsData.home_router)
                	//{
                		//burl = "http://"+settingsData.externalIp+":"+forwardPort+"/"+parameters;
                	//}
                //}
                
                console.log(burl);


			//Ajax Starts
		    $.ajax({
		        url: ""+burl,
		        type: 'GET',
		        data: '',
		        beforeSend: function(xhr) { 
		          //xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onCheckLogin");
				  xhr = {};
		          //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
			  console.log(response);
			  store.set(model,boardButtons);
				if (burl=='http://10.1.25.14:80')
				{
					console.log('old board');
				}else
				{
					console.log('new board');
				}
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    }
	};
})
.service('LoginService', function ($q, $http) {
    return {
        loginUser: function (loginData) {
            var deferred = $q.defer(),
                promise = deferred.promise;
			//$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
			//$http.defaults.headers.common['X-OCTOBER-REQUEST-HANDLER'] = 'onSignin';

			$.ajax({
			  url: "http://arnoldcentralschool.org/account",
			  type: 'POST',
			  data: loginData,
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onSignin");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
			})
			.done(function(response) { 
				//$rootScope.$apply(function() {d.resolve(data); });
				console.log("in Post-success ");
				deferred.resolve(response);

			})
			.fail(function(response) {
				//$rootScope.$apply(function() {d.reject(data); });
				console.log("in Post-error ");
				deferred.reject(response);
			});


            /*$http({
                url: 'https://www.travelmg.in/new/account',
                method: "POST",
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
                data: {login: loginData.login, password: loginData.password}
					//headers: {'X-OCTOBER-REQUEST-HANDLER': 'onSignin'},
					//headers: {'X-Requested-With': 'XMLHttpRequest'}
                //headers: {'Content-Type': 'application/json'}
            })
                .then(function (response) {
                    if (response.data.error.code === "000") {
                        console.log("User login successful: " + JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    } else {
                        console.log("User login failed: " + JSON.stringify(response.data.error));
                        deferred.reject(response.data);
                    }
					console.log("good");
					console.log(response);
                }, function (error) {
                    console.log("Server Error on login: " + JSON.stringify(error));
                    deferred.reject(error);
                });*/

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        
        registerUser: function (regData) {
            var deferred = $q.defer(),
                promise = deferred.promise;
            
 			$.ajax({
			  url: "http://arnoldcentralschool.org/account",
			  type: 'POST',
			  data: regData,
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onRegister");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
				})
				.done(function(response) { 
					console.log("in Post-success ");
					deferred.resolve(response);
				})
				.fail(function(response) {
					console.log("in Post-error ");
					deferred.reject(response);
				});
            
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },

        onUpdate: function (userData) {
            var deferred = $q.defer(),
                promise = deferred.promise;
            
 			$.ajax({
			  url: "http://arnoldcentralschool.org/account",
			  type: 'POST',
			  data: userData,
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onUpdate");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
				})
				.done(function(response) { 
					console.log("in Post-success ");
					deferred.resolve(response);
				})
				.fail(function(response) {
					console.log("in Post-error ");
					deferred.reject(response);
				});
            
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },

        getProfile: function () {
            var deferred = $q.defer(),
                promise = deferred.promise;
            
			$.ajax({
			  url: "http://arnoldcentralschool.org/api/check-login",
			  type: 'POST',
			  data: '',
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onCheckLogin");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
			})
			.done(function(response) { 
				console.log("in Post-success ");
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in Post-error ");
				deferred.reject(response);
			});
            
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },

        doLogout: function () {
            var deferred = $q.defer(),
                promise = deferred.promise;
            
			$.ajax({
			  url: "http://arnoldcentralschool.org/api/check-login",
			  type: 'POST',
			  data: '',
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onDoLogout");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
			})
			.done(function(response) { 
				deferred.resolve(response);
			})
			.fail(function(response) {
				deferred.reject(response);
			});
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },


        onSendBoard: function (board) {
            var deferred = $q.defer(),
                promise = deferred.promise;
            
 			$.ajax({
			  url: "http://"+board.url+"/manage_scene",
			  type: 'POST',
			  data: board,
			  beforeSend: function(xhr) {
				//xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onUpdate");
				//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  }
				})
				.done(function(response) { 
					console.log("in Post-success ");
					deferred.resolve(response);
				})
				.fail(function(response) {
					console.log("in Post-error ");
					deferred.reject(response);
				});
            
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }        


    };
})
.service('IRService', function ($q, $http) {
    return {
		FetchCode: function (brand,type) {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts switch.iocare.in
		    $.ajax({
		        url: "http://switch.iocare.in/ir-db",
		        type: 'POST',
		        data: {brand:brand,type:type},
		        beforeSend: function(xhr) { 
		          xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onGetscript");
				  //xhr = {};
		          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
				
				console.log("in success ");
				var resp= $.parseJSON(response.result);
				//console.log(resp);
				deferred.resolve(resp);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
				console.log('Done');
                return promise;
            };
            promise.error = function (fn) {
				console.log("in promise error ");
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },
		GetBrands: function () {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts switch.iocare.in
		    $.ajax({
		        url: "http://switch.iocare.in/ir-db",
		        type: 'POST',
		        data: {},
		        beforeSend: function(xhr) { 
		          xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onGetBrands");
				  //xhr = {};
		          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
				
				console.log("in success ");
				//var resp= $.parseJSON(response.result);
				//console.log(resp);
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
				console.log('Done');
                return promise;
            };
            promise.error = function (fn) {
				console.log("in promise error ");
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },
		GetBrandsByType: function (type) {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts switch.iocare.in
		    $.ajax({
		        url: "http://switch.iocare.in/ir-db",
		        type: 'POST',
		        data: {type:type},
		        beforeSend: function(xhr) { 
		          xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onGetCodesByType");
				  //xhr = {};
		          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
				
				console.log("in success ");
				//var resp= $.parseJSON(response.result);
				//console.log(resp);
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
				console.log('Done');
                return promise;
            };
            promise.error = function (fn) {
				console.log("in promise error ");
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },	    
		GetTypes: function () {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts switch.iocare.in
		    $.ajax({
		        url: "http://switch.iocare.in/ir-db",
		        type: 'POST',
		        data: {},
		        beforeSend: function(xhr) { 
		          xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onGetTypes");
				  //xhr = {};
		          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
				
				console.log("in success ");
				//var resp= $.parseJSON(response.result);
				//console.log(resp);
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
				console.log('Done');
                return promise;
            };
            promise.error = function (fn) {
				console.log("in promise error ");
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    },
		sendGCcode: function (code,length) {
			var deferred = $q.defer(),
                promise = deferred.promise;

			//Ajax Starts
		    $.ajax({
		        url: "http://10.1.25.16/sendgc?code="+code+"&length="+length,
		        type: 'GET',
		        data: '',
		        beforeSend: function(xhr) { 
		          //xhr.setRequestHeader("X-OCTOBER-REQUEST-HANDLER", "onCheckLogin");
				  xhr = {};
		          //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		        }
		      })
			.done(function(response) { 
				console.log(response);
				console.log("in sendGCcode success ");
				deferred.resolve(response);
			})
			.fail(function(response) {
				console.log("in error ");
				console.log(response);
				//$ionicLoading.hide();
				deferred.reject(response);
			});
			//ajax Ends
            promise.success = function (fn) {
                promise.then(fn);
				console.log('Done');
                return promise;
            };
            promise.error = function (fn) {
				console.log("in promise error ");
                promise.then(null, fn);
                return promise;
            };
            return promise;

	    }



	};
})
.factory('DeviceData', function() {
   return {
        Scene1Signature:255,
        GetSignature: function () {
            return this.Scene1Signature;
        },
        SetSignature: function (Scene1Signature) {
			this.Scene1Signature = Scene1Signature;
            return true;
        }
    }
})
// DB wrapper
.factory('DB', function($q, DB_CONFIG) {
    var self = this;
    self.db = null;

    self.init = function() {
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        //self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
        //self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name, location: 'default'});
        self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', 200000);
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];

            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });

            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            console.log('Table ' + table.name + ' initialized');
        });
    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };

    self.fetchAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };

    self.fetch = function(result) {
        return result.rows.item(0);
    };

    return self;
})
// Resource service example
.factory('Devices', function(DB) {
    var self = this;
    
    self.all = function() {
        return DB.query('SELECT * FROM devices')
        .then(function(result){
            return DB.fetchAll(result);
        });
    };
    
    self.getById = function(id) {
        return DB.query('SELECT * FROM devices WHERE id = ?', [id])
        .then(function(result){
            return DB.fetch(result);
        });
    };

    self.setDevice = function(deviceArray) {
        return DB.query('INSERT INTO devices VALUES (?,?,?,?,?,?)', deviceArray)
        .then(function(result){
            return DB.fetch(result);
        });
    };

    return self;
});