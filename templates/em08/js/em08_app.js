// use this url to call up page
//http://localhost/ibuilder/template.html?media=/repository/data/ib/iterations/80003&entryPoint=data.json

/* 
  ===================================================================
  EM MOVABLE OBJECT TEMPLATE em08 APP
  Based on Douglas Crockford's "revealing module pattern"
  ===================================================================
*/

var movableObjectsTemplate = function (){

	var _currVars = {};
	_currVars.html = "";
	var _myDispatcher; // dispatcher object to send  checkanswer button messages
	var _dispatcher;   // main dispatcher

	//var _myType;
	var _isMobile;
	var _$MoveableObjects;
	var _cloneLimit = 200; // my limit - cannot have infinite amount
	var _allowDirectionsHints = true;
	//object to save out with game
	_currVars.myVars = {};
	//_currVars.myVars.hintClicks = 0;
	//_currVars.myVars.directionsClicks = 0;
	_currVars.myVars.myType = "";
	
	// init object - set dispatchers
    // ===================================================================
    function init(p_appDispatcher, p_dispatcher){
        _myDispatcher = p_appDispatcher;
        _dispatcher = p_dispatcher;

		// remove event handlers attached 
		// by builder and used in authoring iterations
		// and replace them
		$(".hint_close").off('click');
		$(".hint_close").on("click", closeHintWindow);
		
		$(".directions_close").off('click');
		$(".directions_close").on("click", closeDirectionsWindow);
		
		//bind for outside messages from dispatcher here....
		_dispatcher.bind("iteration.hints.show.em01", function(p_state){
			openHintWindow();
        })

		_dispatcher.bind("iteration.directions.show.em01", function(p_state){
			openDirectionsWindow();
        })

        _dispatcher.bind("iteration.destroystate.em01", function(p_state){
			destroyState();
        })

       _$MoveableObjects = $("#move_object_set");

		return this;
    }

   // hides shows top lockout layer 
   // ===================================================================
   function showLockoutLayer(){
	  $('#lockout').show();
   }

   function hideLockoutLayer(){
      $('#lockout').hide();
   }

	
   // hides hint directions windows
   // ===================================================================
   function closeHintWindow(){
		$('#hint_set').hide();
   }

   
   function closeDirectionsWindow(){
	    $('#directions_set').hide();
   }


   // opens hint window - bound to outside dispatcher call
   // ===================================================================
   function openHintWindow(){
	     if(_allowDirectionsHints === false){return};
	    if($('#directions_set').is(":visible") === true){
			closeDirectionsWindow();
		}
	
	    // only increment count if window is invisible
	    if ($('#hint_set').is(":visible") === false){
		  	//_currVars.myVars.hintClicks ++;
             dispatcher.dispatch("iteration.hints.clicked"); 
			$('#hint_set').show();
	    }
   }


    // opens directions window - bound to outside dispatcher call
    // ===================================================================
   function openDirectionsWindow(){
	     if(_allowDirectionsHints === false){return};
	   	if($('#hint_set').is(":visible") === true){
			closeHintWindow();
		}
		
		// only increment count if window is invisible
	   	if ($('#directions_set').is(":visible") === false){
		  	//_currVars.myVars.directionsClicks++;
		    // valid click here
		    dispatcher.dispatch("iteration.directions.clicked"); 
			$('#directions_set').show();
	    }	
   }


   // start a new game
   // clone all objects, detemine mobile, 
   // attach draggable and clean the white lock-ot screen
   // ===================================================================
   function startNewGame(p_type){
	
	   _currVars.myVars.myType = p_type;
	   // check for open response here....

	   cloneMoveableObjectsAtStart();
	   isCurrentDeviceMobile();
	   attachDraggableToElements();
	   hideLockoutLayerAtStart();
	   sendState();
   }


	// hides white lock-out layer  and changes it to transparent
	// for further use. Does this work on ie 9?
    // ===================================================================
   function hideLockoutLayerAtStart(){
	// hide lockout layer and change it from white to transparent
	 $("#lockout").css({"visibility":"hidden","background": "transparent"});
   }


   function isCurrentDeviceMobile(){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			_isMobile = true;
		}
	}


   // use to send state object
   // ===================================================================
   function sendState(){
	var tStateObj = {};
	tStateObj.myHtml = $(".content").html();
	tStateObj.myVars = _currVars.myVars;
	var tState = JSON.stringify(tStateObj);
	_dispatcher.dispatch("iteration.currentstate", {"currentstate": tState});
   }


   // restore old state by replacing html in content div
   // ===================================================================
   function restoreOldGame(p_JSON,p_type){
	 //alert("restore")
	 _currVars.myVars.myType = p_type;
	 var tempObj = JSON.parse(p_JSON);
	 $(".content").html(tempObj.myHtml)
	_currVars.myVars = tempObj.myVars;
	_$MoveableObjects = $("#move_object_set");
	isCurrentDeviceMobile();
	

	if(p_type === "teacherview"){
	 // do not allow dragging in teacher view
	 // insert any future teacher mods here
	}else{
	  attachDraggableToElements();		
	}

	hideLockoutLayerAtStart();
   }


   // set html to blank?, return JSON object IS THIS USED
   // ===================================================================
   function saveState(){
	 	_currVars.myHtml = $(".content").html();
		//$(".content").html("");
		return JSON.stringify(_currVars);
   }


   // function mainly for testing only - but may incorporate
   // ===================================================================
   function destroyState(){
	    $(".content").html("");
	    _currVars.myVars = {};
		_currVars.myVars.hintClicks = 0;
		_currVars.myVars.directionsClicks = 0;
   }


   // testing dispatcher
   // ===================================================================
   function test(){
	 _myDispatcher.setCheckButtonToActive();
   }


    // remember to load load touch-punch
    // ===================================================================
    function attachDraggableToElements(){
			if (_isMobile === true){
					_$MoveableObjects.find(".move_object").draggable({

					                create:  function ( event, ui ) {
						                  prevPos = ui.position;
						            },
									drag: function ( event, ui ) {
										// fixes flicker
								        if ( prevPos ) {
								            diffX = Math.abs( prevPos.left - ui.position.left );
								            diffY = Math.abs( prevPos.top - ui.position.top );
								            maxDiff = Math.max( diffX, diffY );
								            if ( maxDiff > 60 ) {
								                ui.position = prevPos;
								            }
								        }

								        prevPos = ui.position;
								        //event.preventDefault();  
								    },
									containment:$("#wrapper"),
									cursor:'pointer',
									stack: ".move_object",

									stop: function(event, ui) {
										prevPos = null;
										sendState();
									   }
				}); 
				} else {
					_$MoveableObjects.find(".move_object").draggable({
										containment:$("#wrapper"),
										cursor:'pointer',
										stack: ".move_object",
										drag:function(event,ui){
											//event.preventDefault();  
										},
										stop: function(event, ui) {
											prevPos = null;
											sendState();
										   }
				}); 
			}		
		}
		
		
	   // clone objects and add to html if larger amount of them needed
	   // as specified in attribute
	   // ===================================================================
		function cloneMoveableObjectsAtStart(){

				_$MoveableObjects.find(".move_object").each(function (index, element) {
			    	var tCurrObj = $(this);
					var tClonesNeeded = parseInt(tCurrObj.attr("data-count"),10);
					var tID = tCurrObj.attr("id");
					if(tClonesNeeded > _cloneLimit){
						tClonesNeeded = _cloneLimit;
						}
					for(var i = 1; i < tClonesNeeded; i++){
						var _$Clone = $(this).clone();
						_$Clone.removeAttr("id");
						_$Clone.addClass("clone_object")
						_$Clone.attr("data-cloneorigin", tID);
						_$Clone.attr("data-clonenumber", i );
						_$Clone.appendTo(_$MoveableObjects);	
					}
				});
		    }

	
	// return public functions
	// ===================================================================
	return { 
		init:init,
		saveState:saveState,
		startNewGame:startNewGame,
		restoreOldGame:restoreOldGame,
		destroyState:destroyState,
		test:test	
	}
	
}