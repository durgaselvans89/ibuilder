// use this url to call up page
//http://localhost/ibuilder/template.html?media=/repository/data/ib/iterations/80003&entryPoint=data.json

/* 
  ===================================================================
  EM MULTIPLE CHOICE TEMPLATE em02 APP
  Based on Douglas Crockford's "revealing module pattern"
  ===================================================================
*/

var multipleChoice = function (){

    
	
	// always re-init in each entry mode
	// cannot be saved because they are objects-
	// reinit each time through
	var _myDispatcher; // dispatcher object to send  checkanswer button messages
	var _dispatcher;   // main dispatcher

	//var _myType; //save?
	
	// can vary- iteration may be played
	// on multiple devices by same student, 
	// so check at start each time played
	var _isMobile;
	//var _setButtonToActiveAfterFeedback;
	
	// object to save out with game
	// all variables go in here
	// all variables are retained in this object
    // for replay and state saving
	var _currVars = {};
	_currVars.html = "";
	

	
	//_currVars.myVars.myType = "";
	_currVars.myVars = {};
	_currVars.myVars.attemptsAllowed = 0;
	_currVars.myVars.setButtonToActiveAfterFeedback = false;
	
	_currVars.myVars.myType = "";
	
	_currVars.myVars.selectedAnswers = [];
	_currVars.myVars.correctAnswers = [];
	_currVars.myVars.correctAnswerCount = 0;
	_currVars.myVars.checkbuttonstates = {};
	_currVars.myVars.checkbuttonstates.currState = "";

	_currVars.myVars.checkbuttonstates.ACTIVE = "active";
	_currVars.myVars.checkbuttonstates.INACTIVE = "inactive";
	_currVars.myVars.checkbuttonstates.COMPLETED_CORRECT = "completedcorrect";
	_currVars.myVars.checkbuttonstates.COMPLETED_INCORRECT = "completedincorrect";
	_currVars.myVars.checkbuttonstates.DO_NOT_SHOW = "donotshow";
	
	_currVars.myVars.feedbackSetup = "single" ;// also multiple?
	
	// prevents interaction when restoring a lost game
	_currVars.myVars.allowCheckbuttonInteraction;
	
	var _testSoundCount = 0;
	
	var _currentIterationNumber;
	
	var _soundCounter;
	
	//_currVars.myVars.gamestate
	var _allowDirectionsHints = true;
	
	
	// init object - set dispatchers
    // ===================================================================
    function init(p_appDispatcher, p_dispatcher){
        _myDispatcher = p_appDispatcher;
        _dispatcher = p_dispatcher;

       	makeSoundCounter();

        var pageName = document.URL;
		pageName = pageName.split('/');
		//alert(pageName.length);
		//alert(pageName[pageName.length - 1]);
		pageName = pageName[pageName.length - 1];
		pageName = pageName.split('&');
		//alert(pageName[0]);
		_currentIterationNumber = pageName[0];
       //alert(_currentIterationNumber);

		// remove event handlers attached 
		// by builder and used in authoring iterations
		// and replace them
		$(".hint_close").off('click');
		$(".hint_close").on("click", closeHintWindow);
		
		$(".directions_close").off('click');
		$(".directions_close").on("click", closeDirectionsWindow);
		
		//bind for outside messages from dispatcher here....
		_dispatcher.bind("iteration.hints.show.em02", function(p_state){
			openHintWindow();
        })

		_dispatcher.bind("iteration.directions.show.em02", function(p_state){
			openDirectionsWindow();
        })

        _dispatcher.bind("iteration.destroystate.em02", function(p_state){
			destroyState();
        })

		//_dispatcher.dispatch("iteration.checkanswer");
		 _dispatcher.bind("iteration.checkanswer.em02", function(p_state){
				checkAnswer();
	    })


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


   function makeSoundCounter(){
	
	
	  _soundCounter = {};
	
	  _soundCounter["feedback_correct"] = {};
	  _soundCounter["feedback_correct"].trigger = 0;
	  _soundCounter["feedback_correct"].limit = JSONObject["feedback_correct"].length;
	
	  _soundCounter["feedback_incorrect"] = {};
	  _soundCounter["feedback_incorrect"].trigger = 0;
	  _soundCounter["feedback_incorrect"].limit = JSONObject["feedback_incorrect"].length;
	
	  _soundCounter["feedback_not_all_correct"] = {};
	  _soundCounter["feedback_not_all_correct"].trigger = 0;
	  _soundCounter["feedback_not_all_correct"].limit = JSONObject["feedback_not_all_correct"].length;
	  //console.log("the limit is " + _soundCounter["feedback_not_all_correct"].limit);
	
	  _soundCounter["feedback_one_wrong"] = {};
	  _soundCounter["feedback_one_wrong"].trigger = 0;
	  _soundCounter["feedback_one_wrong"].limit = JSONObject["feedback_one_wrong"].length;
	
	//feedback_last_attempt
	   _soundCounter["feedback_last_attempt"] = {};
	  _soundCounter["feedback_last_attempt"].trigger = 0;
	  _soundCounter["feedback_last_attempt"].limit = JSONObject["feedback_last_attempt"].length;
	
	
   	  _soundCounter["feedback_some_wrong"] = {};
	  _soundCounter["feedback_some_wrong"].trigger = 0;
	  _soundCounter["feedback_some_wrong"].limit = JSONObject["feedback_some_wrong"].length;
	
	
	  _soundCounter["feedback_all_wrong"] = {};
	  _soundCounter["feedback_all_wrong"].trigger = 0;
	  _soundCounter["feedback_all_wrong"].limit = JSONObject["feedback_all_wrong"].length;
	
       _soundCounter["custom_feedback"] = {};
	   _soundCounter["custom_feedback"].trigger = 0;
	   _soundCounter["custom_feedback"].limit  = JSONObject["custom_feedback"].length;
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
		    dispatcher.dispatch("iteration.directions.clicked"); 
			$('#directions_set').show();
	    }	
   }


   // start a new game
   // determine mobile, attach scripts onto all answer divs,
   // 
   // ===================================================================
   function startNewGame(p_type, p_attemptsAllowed, p_feedbackType, p_isOpenResponse){
	
	   // modify this to handle infinity -- ie make it 2000
	   _currVars.myVars.attemptsAllowed = p_attemptsAllowed;
	
	  	_currVars.myVars.feedbackSetup = p_feedbackType;
	
	   _currVars.myVars.myType = p_type;
	
		
	   isCurrentDeviceMobile();

	   captureAnswerDataAtStart();
	
	   attachClickHandlersToAnswerDivs();
	
	   if(p_isOpenResponse === "true"){
		_currVars.myVars.myType = "openresponse";
		_currVars.myVars.allowCheckbuttonInteraction = false;
		hideLockoutLayerAtStart();
		sendState();
		return;		
	   }
	
	   if(_currVars.myVars.myType === "assessment"){
		//alert("i am an asessment");
		_currVars.myVars.allowCheckbuttonInteraction = false;
		hideLockoutLayerAtStart();
		return;
		
	   }
	
	   _currVars.myVars.allowCheckbuttonInteraction = true;
	
	   //show check answer button as inactive
	   _myDispatcher.setCheckButtonToInactive();
	
	   hideLockoutLayerAtStart();

	   sendState();
   }

   // attach handler for clicks at start and return
   function attachClickHandlersToAnswerDivs(){
	  
	  $('.answer').each(function() {
		$("#" + this.id).on( "mousedown", clickHandler ).css({ "cursor": "pointer"});
	  });
   }

   function turnAllClickHandlersOff() {
	$('.answer').each(function() {
		$("#" + this.id).off( "mousedown", clickHandler );
	  });
	
   }
	

   function changeCursorsToPointers(){
		
   }

   function clickHandler(e){

	   var tClickedID = e.currentTarget.id;
	   var $tClickedDiv = $("#"+ e.currentTarget.id);
	   var tIndex = $.inArray( tClickedID, _currVars.myVars.selectedAnswers );
	   if( tIndex > -1){
		    // is currently selected - so unselect
		     $tClickedDiv.removeClass("em_highlight");
		     _currVars.myVars.selectedAnswers.splice(tIndex,1);
		     
	   } else {
		   // is not selected
		   $tClickedDiv.addClass("em_highlight");
		   _currVars.myVars.selectedAnswers.push(tClickedID);
	   }
	
	    // set feedback message to blank after any click
	   $("#feedback_message").html("");
	
	   // decide if the checkanswer button should be visible now-
	   if(_currVars.myVars.allowCheckbuttonInteraction === true){
		   if (_currVars.myVars.selectedAnswers.length > 0){
			   _currVars.myVars.checkbuttonstates.currState =  _currVars.myVars.checkbuttonstates.ACTIVE;
			  _myDispatcher.setCheckButtonToActive();
		    } else{
	           _currVars.myVars.checkbuttonstates.currState =  _currVars.myVars.checkbuttonstates.INACTIVE;
			 _myDispatcher.setCheckButtonToInactive();
		    }
	   }
	
	   sendState();
	
   }


    function playFeedBack(p_type,p_callback,p_lastAttempt){
		_allowDirectionsHints = false;
	    // stop all sounds first
		soundManager.stopAll();
	
	    // place name into array
		var tSoundArray = [ p_type ];
		var tCallback = p_callback;
		var tTextString = "";
		
		if(_soundCounter[p_type].trigger === _soundCounter[p_type].limit){
			_soundCounter[p_type].trigger = 0;
		}
		
		if(_soundCounter["custom_feedback"].trigger === _soundCounter["custom_feedback"].limit){
			_soundCounter["custom_feedback"].trigger = 0;
		}
		
		var trigger = _soundCounter[p_type].trigger;
		if(( typeof JSONObject[p_type][trigger].name !== "undefined")&&( JSONObject[p_type][trigger].name !== "none") ){
			tSoundArray.push(JSONObject[p_type][trigger].name);
			//tSoundArray.push(JSONObject[p_type][2].name evaluates as none - Sound "none" not found. );
			tTextString += JSONObject[p_type][trigger].text;
			
		}
		_soundCounter[p_type].trigger ++;
		
		// add only if some text already exists
		tTextString += "<br>";
		
		if(p_lastAttempt === true){	
			//alert("Play last attempt vo here....");
			if(( typeof JSONObject["feedback_last_attempt"][0].name !== "undefined")&&( JSONObject["feedback_last_attempt"][0].name !== "none")){
				tSoundArray.push(JSONObject["feedback_last_attempt"][0].name);
				tTextString += JSONObject["feedback_last_attempt"][0].text;
			}
			
		} else if( p_type !== "feedback_correct" ){
		var custom_trigger = _soundCounter["custom_feedback"].trigger;
			if(( typeof JSONObject["custom_feedback"][custom_trigger].name !== "undefined")&&( JSONObject["custom_feedback"][custom_trigger].name !== "none")){
				tSoundArray.push(JSONObject["custom_feedback"][custom_trigger].name);
				tTextString += JSONObject["custom_feedback"][custom_trigger].text;
			}
			_soundCounter["custom_feedback"].trigger++;
		 }
		
		$("#feedback_message").html(tTextString);
		
	
	  sm_app.playSound(tSoundArray,tCallback);
	
    }


    function checkAnswer(){
	
		if(_currVars.myVars.checkbuttonstates.currState !==  _currVars.myVars.checkbuttonstates.ACTIVE){
			//alert("returning")
			return;
		}
		
		// second check to prevent interaction
		if(_currVars.myVars.allowCheckbuttonInteraction === false){
			return;
		}
		
		
		
		//alert("clicked check button");
		
		//set button to inactive when evaluating....
		
		// lock the screen out....
		// lock out hints / directions / and checkanswer as well
		showLockoutLayer();
		
		//set check answer state to gray....
		_myDispatcher.setCheckButtonToInactive();
		_currVars.myVars.checkbuttonstates.currState =  _currVars.myVars.checkbuttonstates.INACTIVE;
	
		
		// decrement tries...OK - use here
		_currVars.myVars.attemptsAllowed --;
		
		// find out how many are correct and how many are incorrect....
		var tLen = _currVars.myVars.selectedAnswers.length;
		var tTotalCorrect = 0;
		var tTotalIncorrect = 0;
		for(var i = 0; i < tLen; i++){
			// find out if it is in the answer array --
			// if not, it is incorrect
			if ($.inArray( _currVars.myVars.selectedAnswers[i] , _currVars.myVars.correctAnswers ) > -1){
				tTotalCorrect++;
			} else{
				tTotalIncorrect++;
			}
		}


        // switch here depending on mode- if assessment- use same info but go elsewhere....
	    displayAnswerEvaluation(tTotalCorrect,tTotalIncorrect);
	
	    // else return total incorrect, total correct, incomplete? - 0,0
	
    }



    function evaluateForAssessmentAndShowCheckanswerState(){
		var tLen = _currVars.myVars.selectedAnswers.length;
		var tTotalCorrect = 0;
		var tTotalIncorrect = 0;
		for(var i = 0; i < tLen; i++){
			// find out if it is in the answer array --
			// if not, it is incorrect
			if ($.inArray( _currVars.myVars.selectedAnswers[i] , _currVars.myVars.correctAnswers ) > -1){
				tTotalCorrect++;
			} else{
				tTotalIncorrect++;
			}
		}
		
		
		//compare counts to see if answer button will be displayed...
		if ((tTotalCorrect <  _currVars.myVars.correctAnswerCount) && (tTotalIncorrect === 0)){
			// student did not answer enough - do not show anything in checkanswer
		}else if ((tTotalCorrect + tTotalIncorrect) === 0){
			// student answered nothing - do not show anything in checkanswer
		}else if ((tTotalCorrect ===  _currVars.myVars.correctAnswerCount) && (tTotalIncorrect === 0)){
			// answered question correctly - show green button
			_myDispatcher.setCheckButtonToCorrect();
		}else{
			//answered incorrectly - show red button
			_myDispatcher.setCheckButtonToIncorrect();
		}
		
	
    }

    /***************** FEEDBACK STARTS HERE **************************** FEEDBACK STARTS HERE ************************************* FEEDBACK STARTS HERE ***************/
	/***************** FEEDBACK STARTS HERE **************************** FEEDBACK STARTS HERE ************************************* FEEDBACK STARTS HERE ***************/
    function displayAnswerEvaluation(p_totalCorrect, p_totalIncorrect){
	      // see if correct....
	      var tTotalCorrect = p_totalCorrect;
		  var tTotalIncorrect = p_totalIncorrect;
		  
		  // catch if this is the last attempt
		  var tLastAttempt = false;
		  if (_currVars.myVars.attemptsAllowed === 0){
			var tLastAttempt = true;
		  }
		
		  // ANSWER IS CORRECT
		  if ((tTotalCorrect === _currVars.myVars.correctAnswerCount) && (tTotalIncorrect === 0) ){
			
			console.log("correct -- feedback_correct_vo_1 or feedback_correct_vo_2");
			
			//_currVars.myVars.checkbuttonstates.
		   _currVars.myVars.checkbuttonstates.currState =	_currVars.myVars.checkbuttonstates.COMPLETED_CORRECT;
		   _myDispatcher.setCheckButtonToCorrect();
		
		   _currVars.myVars.allowCheckbuttonInteraction = false;
		
		    sendState();
		
		   turnAllClickHandlersOff();

		    playFeedBack("feedback_correct","getsoundcallback",tLastAttempt );
		   
			
		  } else if (_currVars.myVars.attemptsAllowed === 1000){
			/* FEEDBACK_LAST_ATTEMPT ************************************************************************  REPLACE THIS */
			// REMOVE THIS AREA
			//console.log("game over- incorrect - see you teacher -- feedback_last_attempt");
			
			//_myDispatcher.setCheckButtonToIncorrect();
			//_currVars.myVars.checkbuttonstates.currState =	_currVars.myVars.checkbuttonstates.COMPLETED_INCORRECT;
			//turnAllClickHandlersOff();

			//playFeedBack("feedback_last_attempt","getsoundcallback");
			
			
		  } else if (_currVars.myVars.feedbackSetup === "single" ){

		    //console.log("that is not correct - feedback_incorrect");

			if (tLastAttempt === true){
				setScreenToIncorrect()
				playFeedBack("feedback_incorrect","getsoundcallback",tLastAttempt);
					} else{
				_currVars.myVars.setButtonToActiveAfterFeedback = true;
				sendState();
				playFeedBack("feedback_incorrect","getsoundcallback",tLastAttempt);
			
			}
		
		
		
			
		  } else if ((tTotalCorrect  < _currVars.myVars.correctAnswerCount)&& ( tTotalIncorrect === 0)){

			console.log("you need to choose more answers -- feedback_not_all_correct");

			if (tLastAttempt === true){
				setScreenToIncorrect()
				playFeedBack("feedback_not_all_correct","getsoundcallback",tLastAttempt);
					} else{
				_currVars.myVars.setButtonToActiveAfterFeedback = true;
				sendState();
				playFeedBack("feedback_not_all_correct","getsoundcallback",tLastAttempt);
			
			}
			
	      } else if(tTotalIncorrect === 1){

		    console.log("one of your answers is incorrect - feedback_one_wrong");

		    if (tLastAttempt === true){
				setScreenToIncorrect()
				playFeedBack("feedback_one_wrong","getsoundcallback",tLastAttempt);
					} else{
				_currVars.myVars.setButtonToActiveAfterFeedback = true;
				sendState();
				playFeedBack("feedback_one_wrong","getsoundcallback",tLastAttempt);
			
			}

		
	      } else if(tTotalIncorrect < (tTotalIncorrect + tTotalCorrect) ){

			console.log("some of your answers are incorrect -- feedback_some_wrong");

			if (tLastAttempt === true){
				setScreenToIncorrect()
				playFeedBack("feedback_some_wrong","getsoundcallback",tLastAttempt);
					} else{
				_currVars.myVars.setButtonToActiveAfterFeedback = true;
				sendState();
				playFeedBack("feedback_some_wrong","getsoundcallback",tLastAttempt);
			
			}
			
			
	      } else{

		    if (tLastAttempt === true){
				setScreenToIncorrect()
				playFeedBack("feedback_all_wrong","getsoundcallback",tLastAttempt);
					} else{
				_currVars.myVars.setButtonToActiveAfterFeedback = true;
				sendState();
				playFeedBack("feedback_all_wrong","getsoundcallback",tLastAttempt);
			}
		
	      }	 		
    }

	function setScreenToIncorrect(){
		_myDispatcher.setCheckButtonToIncorrect();
		_currVars.myVars.allowCheckbuttonInteraction = false;
		_currVars.myVars.checkbuttonstates.currState =	_currVars.myVars.checkbuttonstates.COMPLETED_INCORRECT;
		sendState();
	}


   function captureAnswerDataAtStart(){
	
	  $('.answer').each(function() {
		
		if( $("#" + this.id).attr("data-correct")=== "true"){
			_currVars.myVars.correctAnswers.push(this.id);
		}
		
	  });
	
	_currVars.myVars.correctAnswerCount = _currVars.myVars.correctAnswers.length;

   }




	// hides white lock-out layer  and changes it to transparent
	// for further use. Does this work on ie 9?
    // ===================================================================
   function hideLockoutLayerAtStart(){
	  $("#lockout").css({"background": "", "display":"none"});
   }


   function showLockoutLayer(){
	 $("#lockout").css({ "display":"inline"});
   }

   function hideLockoutLayer(){
     $("#lockout").css({ "display":"none"});
   }


   function isCurrentDeviceMobile(){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			_isMobile = true;
		}
	}


   // use to send state object
   // ===================================================================
   function sendState(){
	console.log("sending state");
	var tStateObj = {};
	tStateObj.myHtml = $(".content").html();
	tStateObj.myVars = _currVars.myVars;
	var tState = JSON.stringify(tStateObj);
	_dispatcher.dispatch("iteration.currentstate", {"currentstate": tState});
   }


   function displayTeacherView(p_JSON){
	//alert("got it");
	showLockoutLayer();
	
	var tempObj = JSON.parse(p_JSON);
	 
	_currVars.myVars = tempObj.myVars;
	_currVars.myVars.allowCheckbuttonInteraction = false;
	$(".content").html(tempObj.myHtml);
	
	$("#feedback_message").html("");
	hideLockoutLayerAtStart();
	
	// exit as open response does not show any button
	if(_currVars.myVars.myType === "openresponse"){ "return"}
	
	if(_currVars.myVars.myType === "assessment"){
		evaluateForAssessmentAndShowCheckanswerState();
		return;
	}
	
	//determine how to display check answer buttons....
	if (_currVars.myVars.checkbuttonstates.currState ===  _currVars.myVars.checkbuttonstates.ACTIVE){
		_myDispatcher.setCheckButtonToActive();

	}
	
	// if used left when vo was playing
	if ((_currVars.myVars.checkbuttonstates.currState ===  _currVars.myVars.checkbuttonstates.INACTIVE)&&(_currVars.myVars.setButtonToActiveAfterFeedback === true)){
	   _myDispatcher.setCheckButtonToActive();
	}

    // got it correct
    if(_currVars.myVars.checkbuttonstates.currState ===	_currVars.myVars.checkbuttonstates.COMPLETED_CORRECT){
	   _myDispatcher.setCheckButtonToCorrect();
    }

    if(_currVars.myVars.checkbuttonstates.currState ===	_currVars.myVars.checkbuttonstates.COMPLETED_INCORRECT){
	  	_myDispatcher.setCheckButtonToIncorrect();
    }
	
	
	
   }
	



   // restore old state by replacing html in content div
   // ===================================================================
   function restoreOldGame(p_JSON){
	
	

	 var tempObj = JSON.parse(p_JSON);
	 $(".content").html(tempObj.myHtml)
	_currVars.myVars = tempObj.myVars;
	
	alert(_currVars.myVars.myType);

	 isCurrentDeviceMobile();
	
	 $("#feedback_message").html("");
	
	if((_currVars.myVars.myType === "openresponse") ||(_currVars.myVars.myType === "assessment")) {
		
		//determine checkanswer button state
		
		_currVars.myVars.allowCheckbuttonInteraction = false;
		attachClickHandlersToAnswerDivs();
		hideLockoutLayerAtStart();
		sendState();
		return;		
	 }
	
	
	
	 // assess state of check answer button here....
	if (_currVars.myVars.checkbuttonstates.currState ===  _currVars.myVars.checkbuttonstates.ACTIVE){
		_myDispatcher.setCheckButtonToActive();
		attachClickHandlersToAnswerDivs();
	}
	
	// if used left when vo was playing
	if ((_currVars.myVars.checkbuttonstates.currState ===  _currVars.myVars.checkbuttonstates.INACTIVE)&&(_currVars.myVars.setButtonToActiveAfterFeedback === true)){
	   _currVars.myVars.checkbuttonstates.currState =  _currVars.myVars.checkbuttonstates.ACTIVE;
	   _currVars.myVars.setButtonToActiveAfterFeedback = false;
	   _myDispatcher.setCheckButtonToActive();
	   attachClickHandlersToAnswerDivs();
	}

    // got it correct
    if(_currVars.myVars.checkbuttonstates.currState ===	_currVars.myVars.checkbuttonstates.COMPLETED_CORRECT){
	   _myDispatcher.setCheckButtonToCorrect();
	   _currVars.myVars.allowCheckbuttonInteraction = false;
    }

    if(_currVars.myVars.checkbuttonstates.currState ===	_currVars.myVars.checkbuttonstates.COMPLETED_INCORRECT){
	  	_myDispatcher.setCheckButtonToIncorrect();
		_currVars.myVars.allowCheckbuttonInteraction = false;
		attachClickHandlersToAnswerDivs();
    }
	   
	
	
	//console.log("here are attempts "+ 	_currVars.myVars.attemptsAllowed);
	 
	 hideLockoutLayerAtStart();
   }


   // set html to blank?, return JSON object IS THIS USED
   // ===================================================================
   function saveState(){
	    console.log("saving state");
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
	 //_myDispatcher.setCheckButtonToActive();
   }


   function getsoundcallback(){
	 console.log("GOT THE SOUND CALL BACK")
	
	// this variable is to help with saving state
	 if (_currVars.myVars.setButtonToActiveAfterFeedback === true){
		//set the checkanswer button state back and allow clicking
		_currVars.myVars.setButtonToActiveAfterFeedback = false;
		_currVars.myVars.checkbuttonstates.currState =	_currVars.myVars.checkbuttonstates.ACTIVE;
	    _myDispatcher.setCheckButtonToActive();
	
	 }else{
		//game is over .. 
		
	}
	  _allowDirectionsHints = true;
	
	  hideLockoutLayer();
	
	  sendState();
	
   }
		
		


	
	// return public functions
	// ===================================================================
	return { 
		init:init,
		saveState:saveState,
		startNewGame:startNewGame,
		restoreOldGame:restoreOldGame,
		destroyState:destroyState,
		getsoundcallback:getsoundcallback,
		displayTeacherView:displayTeacherView,
		test:test
	}
	
}