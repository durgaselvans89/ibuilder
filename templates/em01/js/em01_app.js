

//http://localhost/ibuilder/template.html?media=/repository/data/ib/iterations/80003&entryPoint=data.json


/* STATIC TEMPLATE */

var staticTemplate = function (){

	var _currVars = {};
	_currVars.html = "";
	var _myDispatcher; // dispatcher object to send messages
	var _dispatcher;   // main dispatcher

	var _myType;
	
	
	var _allowDirectionsHints = true;
	
	
	//object to save out with game
	_currVars.myVars = {};
	_currVars.myVars.hintClicks = 0;
	//_currVars.myVars.directionsClicks = 0;
	_currVars.myVars.myType = "";
	
	

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

		return this;
    }


	

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
			//console.log("current number of hint clicks is " + _currVars.myVars.hintClicks );
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
			//console.log("current number of directions clicks is " + _currVars.myVars.directionsClicks );
			dispatcher.dispatch("iteration.directions.clicked"); 
			$('#directions_set').show();
	    }	
   }


   // start a new game
   function startNewGame(p_type){
	  hideLockoutLayerAtStart();
	   // send state immediately for static
	   //$("#lockout").css({"background": "transparent"});
	   
	   _currVars.myVars.myType = p_type;
	   sendState();
   }

   function hideLockoutLayerAtStart(){
	// hide lockout layer and change it from white to transparent
	 $("#lockout").css({"visibility":"hidden","background": "transparent"});
	
   }


   // use to send state
   // static does not require 
   // any logic variables to be sent or collected
   function sendState(){
	var tStateObj = {};
	tStateObj.myHtml = $(".content").html();
	tStateObj.myVars = _currVars.myVars;
	var tState = JSON.stringify(tStateObj);
	_dispatcher.dispatch("iteration.currentstate", {"currentstate": tState});
   }



   // restore old state by replacing html in content div
   function restoreOldGame(p_JSON,p_type){
	  _currVars.myVars.myType = p_type;
	  var tempObj = JSON.parse(p_JSON);
	  $(".content").html(tempObj.myHtml)
	  _currVars.myVars = tempObj.myVars;
	  //$("#lockout").css("visibility","hidden");
	hideLockoutLayerAtStart();
   }


   	// set html to blank?, return JSON object
   function saveState(){
	 	_currVars.myHtml = $(".content").html();
		//$(".content").html("");
		return JSON.stringify(_currVars);
   }

   // function mainly for testing only - but may incorporate
   function destroyState(){
	    //console.log("destroying the html");
	    $(".content").html("");
	    _currVars.myVars = {};
		//_currVars.myVars.hintClicks = 0;
		//_currVars.myVars.directionsClicks = 0;
   }


   // testing dispatcher
   function test(){
	 _myDispatcher.setCheckButtonToActive();
   }

	
	return { 
		init:init,
		saveState:saveState,
		startNewGame:startNewGame,
		restoreOldGame:restoreOldGame,
		destroyState:destroyState,
		test:test	
	}
	
}