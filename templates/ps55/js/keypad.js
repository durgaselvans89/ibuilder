
/**
 * Keypad controller
 * http://stackoverflow.com/questions/648004/what-is-fastest-children-or-find-in-jquery
 * The .find() approach is faster because the first selection is handled without going through the Sizzle selector engine –
 * ID-only selections are handled using document.getElementById(), which is extremely fast because it is native to the browser.
 */

var pageName = location.pathname.substring(1);
pageName = pageName.split('/');

var keyPad = function() {
	
	// catch ie log problems
	if ( ! window.console ) console = { log: function(){} };
	

	var _clickedKeyClassName = null;                // String - name of class attached to clicked key on keyboard - used to lookup keycode
	var _$clickedKey;								// jQuery cache of clicked key
	
	var _thisKeypadDivName;							// String - the name of the div containing keys, etc. Used for assignment, namespacing, etc
													// also save as jquery cache?

	var _thisKeypadNumber = 0;               		// the number designation of this keypad (1,2,3) - store for now - database use?
	var _isMobileFlag = false;               		// is this on a mobile device
	var _hasFractionFlag = false;					// does this keypad show a fraction - if so, additional things needed
	
	var _masterHtmlArray = [];						// holds the keycodes that are collected and then rendered as html; 
	                                            	// looks like ["55", "56", "55,*,57", "57"] this is what is used to reconstruct the output - it is rendered into the div as an attribute
	var _topFractionHtmlArray = [];  		    	// holds keycodes from top and bottom fraction fields
	var _botFractionHtmlArray = [];             	// before they are combined into format "55,*,57" for MathJax
	var _stringOfHtml = "";                     	// String - used to build main display html and fraction html for display - change to keycode array?

	var _keyBoardLookUp = new keyboardLookUp(); 	// instantiation of keyboardlookup.js - returns keycodes for class names.
										
    var _$displayWindow;							// jQuery caching of screen elements - main keypad display text area					
    var _$topFractionDisplay;						// top fraction display area
    var _$botFractionDisplay;						// bottom fraction display area
	var _$blinkingCursor;     						// blinking cursor
	var _$currentTextDivOnScreen = null;			// the current text div in the iteration that is on the screen being filled
	var _$thisKeypad;

    var _MODES = {};								// gameplay modes for entry mode, fraction mode - which field is active
    _MODES.DISPLAY = "display"; 					// what letter case is showing (upper vs lower),
    _MODES.MAKEFRACTION = "makefraction" 			// which keys are showing (123 vs ABC), etc.
    _MODES.TOPFRACTION = "topfraction";
    _MODES.BOTFRACTION = "botfraction";
    _MODES.FRACTIONMODE = _MODES.TOPFRACTION;   
    _MODES.UPPERCASE = "uppercase";
    _MODES.LOWERCASE = "lowercase";
    _MODES.keysABC = "abcs"
	_MODES.keys123 = "123s"
											
    var _currEntryMode = _MODES.DISPLAY;       		// set default start modes here - start in display mode, switch to makefraction when needed
	var _fractionMode = _MODES.TOPFRACTION;    		// which fraction field is active - always start with top fraction field active - 
	var _keysShowing = _MODES.keys123;		   		// which keyset is showing
	var _letterCaseMode = _MODES.LOWERCASE;	   		// are letters showing upper or lower case
	
	var FRACTION_DELIMITER = "*";			   		// String - the delimiter for the fraction string - CURRENTLY CANNOT CHANGE as it is hardwired into reg expressions
	
	var _closeFunction;                             // function that is passed in via init - it is run when student clicks close button LOOK AT     
	var _playClickFunction;
	var _playNegSFXFunction;
	          
                         
	var _charsLimit = 30;                           // the limit amount of chars that can be displayed - sent in via init, set in init
	var _charsRemaining = 30;   							// How many chars are currently left out of the limit amount

	var _countAtStartOfFractionEntry = 0;           // At start of use of fraction field, keep track of total char count to see if it exceeds limit
	
	var _parentWidth = 1024;						// needed to set keypad in center of screen at start and if needed- computed in init
	var _parentHeight = 570;
	var _startX;
	var _startY;
	var _startInCenterFlag = false;
	
	
	
	/**
	 *  PUBLIC function
	 *  Inits the keypad
	 *  @param  {String} p_keypadDiv - the id of the keypad div
	 *  @param  {function} p_closeFunction - an outside function to close div and deselect active text div on screen
	 *  @param  {Boolean} p_hasFractionFlag - does this keypad have a fraction
	 *  @param  {int} p_charLimit - the limit of characters that can be displayed both in keypad and onscreen
	 *  @param  {int} p_keypadNumber - our designated number for the keypad -( currently 1,2,3) 
	 *  @return this
	*///=====================================================================================================
	function init(p_keypadDiv, p_closeFunction,p_playClickFunction, p_playNegsfxFunction, p_hasFractionFlag, p_charLimit,p_keypadNumber,keysToShow) {
		_thisKeypadDivName = p_keypadDiv;
		
		_closeFunction = p_closeFunction;
		_playClickFunction = p_playClickFunction;
		_playNegSFXFunction = p_playNegsfxFunction;
		
		// does this keypad have a fraction display
		_hasFractionFlag = p_hasFractionFlag;
		
		_thisKeypadNumber = p_keypadNumber;
		
		_$thisKeypad = 	$("#"+p_keypadDiv);
		
		_$displayWindow = _$thisKeypad.find(".display");
		_$blinkingCursor = _$thisKeypad.find(".blinkingcursor");
			
		
		_startX = (_parentWidth - parseInt(_$thisKeypad.css("width"),10) )/2;
		_startY = (_parentHeight - parseInt(_$thisKeypad.css("height"),10) )/2;
			
		_charsRemaining = p_charLimit;
		_charsLimit = p_charLimit;
		
		// filter for mobile and
		// set interactive touch events differently if mobile
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			
			_isMobileFlag = true;
			
			_$thisKeypad.find(".closebutton").on("click touchstart", userClickedCloseButton);	
			_$thisKeypad.find(".custom_symbol_key, .number_symbol_key, .enter_key, .space_key, .shift_key, .alphabet_key, .keys_to_show").on("click touchstart", keyClickHandler);
			
			// only use when fraction is needed
			if(_hasFractionFlag === true){
				_$topFractionDisplay = _$thisKeypad.find(".topfraction");
				_$botFractionDisplay = _$thisKeypad.find(".botfraction");

				_$topFractionDisplay.on("click touchstart",setTopFractionDisplayToActive);
				_$botFractionDisplay.on("click touchstart",setBotFractionDisplayToActive);
			}
				
			// see comment on next function below
			$(document).on("mouseup touchend", removeTheHilite);
				
		}else{
			
			// change to vMouse on iPad?
            _$thisKeypad.find(".closebutton").on("click", userClickedCloseButton);
            _$thisKeypad.find(".custom_symbol_key, .number_symbol_key, .enter_key, .space_key, .shift_key, .alphabet_key, .keys_to_show").on("click", keyClickHandler);
            $(".pointer").on("mousedown", function(){$(this).addClass("downstate");});

			// only use when fraction is needed
			if(_hasFractionFlag === true){
				_$topFractionDisplay = _$thisKeypad.find(".topfraction");
				_$botFractionDisplay = _$thisKeypad.find(".botfraction");

				_$topFractionDisplay.on("mousedown",setTopFractionDisplayToActive);
				_$botFractionDisplay.on("mousedown",setBotFractionDisplayToActive);
			}
			
			// see comment on next function below
			$(document).on("mouseup",removeTheHilite);		
		}
		
		
		
		// this is needed or clicking on the keypad anywhere will trigger
		// the handler on the screen and make the keypad disappear
		// TOUCH PAD DIFFERENT?
		_$thisKeypad.on("mousedown", function(e){
		 e.stopPropagation();	
		})
		
		
		// attach draggable to the bar here....
	    // use different script for mobile
		if ( _isMobileFlag === true ) {
		_$thisKeypad.draggable({
							
			
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
						    },
							/*containment:"parent",*/
							handle: ".dragbar",
							/*cancel:".nodrag",*/
							cursor:'pointer',
							zIndex:3500,
							stop: function(event, ui) {
								prevPos = null;
								//currentZindex++;
								//$(this).css("z-index", currentZindex.toString() );
							   }
		}); 
		}else{
			_$thisKeypad.draggable({
				                drag: function(event,ui){
				                },
								/*containment:"parent",*/
								handle: ".dragbar",
								/*cancel:".nodrag",*/
								cursor:'pointer',
								zIndex:3500,
								stop: function(event, ui) {
									//alert("stopped");
									prevPos = null;
									//currentZindex++;
									//$(this).css("z-index", currentZindex.toString() );
								   }
			}); }
	  _keysShowing = keysToShow;
      changeKeysShowing();
      changeKeysShowing();
		
	  // ALWAYS RETURN "this" IN A CHAINED INIT
	  return this;		
	}
	
	
	// to remove the hilite on the button, mouseup has to be
	// attached to the document, as user may move mouse off the keyPad and
	// release off the keyPad, which may go undetected unless mouseup is attached to the document
	function removeTheHilite(e){
	    $(".downstate").removeClass("downstate");
	}
	
	
	// temp wrapper script
	function playClickSFX(){

		try
		  {
		  _playClickFunction();
		  }
		catch(err)
		  {
		  console.log("play sfx function error in keypad object " + err.message);
		  }
		
	}
	
	
	// temp wrapper script
	function playNegSFX(){

		try
		  {
		  _playNegSFXFunction();
		  }
		catch(err)
		  {
		  console.log("play negative sfx function error in keypad object "+ err.message);
		  }
		

	}
	
	
	
	/**
	* Private functions to manipulate _charsRemaining, the number of characters we have  left to fill in textfields
	*///=====================================================================================================
	function isCharsRemainingZero(){
		
		if(_charsRemaining <= 0){
			return true;
		}else{
			return false;
		}
	}
	
	function addThisAmountToCharsRemaining(p_Amount){
		_charsRemaining += p_Amount;
	}
	
	
	function increaseCharsRemainingByOne(p_amount){
		if (_charsRemaining >= _charsLimit){ return } 
		_charsRemaining++;
	}
	
	
	function decreaseCharsRemainingByOne(p_amount){
	    if (_charsRemaining > 0){
			_charsRemaining--;
	    }	
	}
	
	
	function resetCharsRemainingToLimit(){
		_charsRemaining = _charsLimit;
	}
	

	
	function setCharsRemaining(p_amount){
		_charsRemaining = p_amount;
	}
	
	
	
	
	/**
	* Private Procedure
	* User clicked a letter, number, or space key
	* @param  {event} the inital click event
	* @param  {string} the letter, number, or space keycode
	* @return NO RETURN VALUE
	*///=====================================================================================================
	function userClickedAlphabetNumberOrSpaceKey(p_Event,p_KeycodeAsString){
		
		if(_currEntryMode === _MODES.DISPLAY){
		    if(isCharsRemainingZero() === true){
			    playNegSFX();
				return;
			}
			decreaseCharsRemainingByOne();
			
			playClickSFX();
			
			_masterHtmlArray.push(p_KeycodeAsString);
			
		}else{
			
			if (_fractionMode === _MODES.TOPFRACTION){
				if ((_countAtStartOfFractionEntry - _topFractionHtmlArray.length) < 1){
					 playNegSFX();
					return;
				}
			
				// new - keeps text field entry to a limit
				if (_topFractionHtmlArray.length >= 10){ 
					 playNegSFX();
					return; }
				playClickSFX();
				_topFractionHtmlArray.push(p_KeycodeAsString);	
						
			}else{
				if((_countAtStartOfFractionEntry - _botFractionHtmlArray.length) < 1){
					 playNegSFX();
					return;
				}
				
				if (_botFractionHtmlArray.length >= 10){ 
					 playNegSFX();
					return; }
				playClickSFX();
			    _botFractionHtmlArray.push(p_KeycodeAsString);		
			}		
		}
		
		updateActiveDisplayWindow();		
	}
	

	
	/**
	* Event handler 
	* Added to all keys via classes, adds downstate to div clicked,
	* this is only handler - it branches to appropriate functions 
	* based on classes attached to clicked object
	* ALL CLICKS HANDLED HERE AND ROUTED
	* @param  {event} the mousedown or click event of key pressed
	* @return NO RETURN VALUE
	*///=====================================================================================================
	function keyClickHandler(e) {
		
		// grab id and jquery object and store
		_clickedKeyClassName = getTheNameOfFirstClassAttachedToElement(this); 
		_$clickedKey = $(this);
				
		// depending on type of class attached to key - has to be listed as first attachment, 
		// branch to seperate functions to handle mousedown/click 
		
		if(_$clickedKey.hasClass("number_symbol_key")){
			//console.log("---- here -----");
			// user clicked number symbol key
			var tString = _keyBoardLookUp.getKeycodeForKeyIDName(_clickedKeyClassName);	
			
			//arrValues.indexOf('Sam') > -1
			if((_currEntryMode === _MODES.MAKEFRACTION )&& _$clickedKey.hasClass("disableforfractions")){ return };
			
			userClickedAlphabetNumberOrSpaceKey(e,tString);
		
		}else if(_$clickedKey.hasClass("custom_symbol_key")){
		
			// user clicked a custom symbol
			userClickedOnCustomSymbol();
				
		}else if(_$clickedKey.hasClass("enter_key")){
		
			// user clicked enter key
			userClickedOnEnterKey(e);
				
		}else if(_$clickedKey.hasClass("space_key")){
		
			// user clicked space key
			var tString = "160";
			userClickedAlphabetNumberOrSpaceKey(e,tString);
			
		}else if(_$clickedKey.hasClass("shift_key")){
		
		    // user clicked shift key
			userClickedShiftKey(e);
			
		}else if(_$clickedKey.hasClass("alphabet_key")){
		
			// user clicked upper/lowercase alphabet shift key
			if(_letterCaseMode === _MODES.LOWERCASE){
				var tString = _keyBoardLookUp.getLowerCaseKeycodeForKeyIDName(_clickedKeyClassName);
			}else{
				var tString = _keyBoardLookUp.getUpperCaseKeycodeForKeyIDName(_clickedKeyClassName);
			}

		    userClickedAlphabetNumberOrSpaceKey(e,tString);
		
		}else if(_$clickedKey.hasClass("keys_to_show")){
		
			// user clicked key to change 123 to ABC display
			userClickedKeysToShowButton(e);
		}
		
			 e.preventDefault();
	}
	
	
	
	/**
	 * Private Procedure
	 * Adjusts the position of the blinking cursor
	 * based on width of display field - turns cursor on or off
	 * if needed. Called each time keypad display is updated.
	 * @param  none
	 * @return NO RETURN VALUE
	 *///=====================================================================================================
	function setBlinkingCursorDistance(){
		
		if (isCharsRemainingZero() === true){
			// at char limit, so turn off cursor
			_$blinkingCursor.css("visibility","hidden");
			return;
		}
		
		var tMoveTo = parseInt(_$displayWindow.css("width"),10) + 5;
		tMoveTo += "px";
        _$blinkingCursor.css({"left":tMoveTo});
        if (_$thisKeypad.is("visible")) {
		    _$blinkingCursor.css({"visibility":"visible"});
        }
	}
	
	
	
	/**
	* Private Procedure - Turns cursor off
	*///=====================================================================================================
	function turnBlinkingCursorOff(){
		_$blinkingCursor.css("visibility","hidden");
	}
	
	
	
	/**
	* Private Procedure
	* Shifts between ABC keys and 123 key views, displays different keys and shifts _keysShowing MODE
	* @param  {event} the inital click event
	* @return NO RETURN VALUE
	*///=====================================================================================================
	function userClickedKeysToShowButton(e){
		playClickSFX();
        changeKeysShowing();
    }
    function changeKeysShowing() {
		// switch which keys are showing
		if(_keysShowing === _MODES.keysABC){
			
			_keysShowing = _MODES.keys123;
			
			_$thisKeypad.find(".groupABC").css("z-index",-1);
			_$thisKeypad.find(".group123").css("z-index",1);
			
		}else{
			
			_keysShowing = _MODES.keysABC;
		
			_$thisKeypad.find(".groupABC").css("z-index",1);
			_$thisKeypad.find(".group123").css("z-index",-1);		
		}
	}
	
			
	/**
	 * Private Procedure
	 * When user clicks shift key, display changes from capital letters 
	 * to lowercase letters and vice-versa - replace the letters based on keycode nums
	 * @param  {event} the mousedown or click event 
	 * @return NO RETURN VALUE
	 *///=====================================================================================================
    function userClickedShiftKey(event){
	
	    // if mode is 123, shift is invalid and inactive
	    // disregard mousedown
	    if(_keysShowing === _MODES.keys123){
		    return;
	    };
        if (_$thisKeypad.find(".shift_key").hasClass("shifted")) {
            _$thisKeypad.find(".shift_key").removeClass("shifted");
        } else {
            _$thisKeypad.find(".shift_key").addClass("shifted");
        }
	
	    playClickSFX();
	
		var tArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
		
		if(	_letterCaseMode === _MODES.LOWERCASE){

			_letterCaseMode = _MODES.UPPERCASE;
            for(var i = 0; i < 26; i++){
	            var tNum = i + 65;
				_$thisKeypad.find(".letter_" + tArray[i]).html("&#"+tNum +";");
            }	
		
		}else{
			_letterCaseMode = _MODES.LOWERCASE;

	        for(var i = 0; i < 26; i++){
		         var tNum = i + 97;
				 _$thisKeypad.find(".letter_" + tArray[i]).html("&#"+tNum +";");
	        }
		}
    }



	/**
	 * Private Function
	 * Returns the name of the first class attached to a div.
	 * Used to determine what alphanumeric symbol needed.
	 * @param   {string} p_DivReference The div to get the attached classes from.
	 * @returns {string} The name of the first class attached to the div.
	 *///=====================================================================================================
	function getTheNameOfFirstClassAttachedToElement(p_DivReference){
		var classes = $(p_DivReference).attr('class');
		var strArray = classes.split(' ');
		var firstClass = strArray[0];
		return firstClass;
	}
	
	
	
	/**
	 * Private Procedure.
	 * When user clicks enter key on keypad, fraction must be converted
	 * to html and shown on screen. This procedure turns off the enter button 
	 * and fraction display, then turns fraction entry button back on, 
	 * it converts fraction arrays to strings that get placed in master html array
	 * and displays fraction as mathjax in keypad display window.
	 * @param  {event} the mousedown or click event 
	 * @return NO RETURN VALUE
	 *///=====================================================================================================
	function userClickedOnEnterKey(event) {	
		// handle elements visibility
        if (!_$thisKeypad.find(".enter_key").hasClass("fractionmode")) {
            _$thisKeypad.find(".enter_key").removeClass("fractionmode");
            _closeFunction();
            return
        }
		_$thisKeypad.find(".make_fraction").css("visibility","visible");
		_$thisKeypad.find(".fractionholder").css("visibility","hidden");
        _$thisKeypad.find(".enter_key").removeClass("fractionmode");

		playClickSFX();
		
		 _$thisKeypad.find(".disableforfractions").removeClass("showbuttondisabled");
		
		
		// filter out if there is no fraction entered....
		if((_topFractionHtmlArray.length === 0)&&(_botFractionHtmlArray.length=== 0)){
			//do nothing - no fraction entered - do return here?
		}else{
			// convert fraction entry to array and place in master array in unique format
			var tArray = [_topFractionHtmlArray,[FRACTION_DELIMITER],_botFractionHtmlArray];
			var tString = tArray.toString();		
			_masterHtmlArray.push(tString);	
			setCharsRemaining(_countAtStartOfFractionEntry - Math.max(_botFractionHtmlArray.length,_topFractionHtmlArray.length));
		}
				
		// change mode, update display	
		_currEntryMode = _MODES.DISPLAY;
		updateActiveDisplayWindow();
		
		// clean up fraction display
		resetFractionDisplays();	
	}
	
	
	
	/**
	 * Private Procedure.
	 * When user clicks backspace key, last character in active display field is deleted and display is updated -
	 * field affected is determined by _currEntryMode MODE - fraction display field or main display field
	 * @param  NONE
	 * @return NONE
	*///=====================================================================================================
	function userClickedOnBackspaceKey() {
		
		if(_currEntryMode === _MODES.DISPLAY) {
			     // deleting from MAIN DISPLAY

				// filter out when nothing left to delete...
				if (_masterHtmlArray.length === 0){
					return;
				}
				
				
				var tString = _masterHtmlArray.pop();
				
				// filter fraction out - fraction top / bot may have different char count
				// so need to determine how many characters it will add back to available chars
				// by counting both fields and getting the larger
				if (tString.indexOf(FRACTION_DELIMITER) !== -1){ 
				
					var str = tString;

				    var tArray = JSON.parse(("[[" + str + "]]").replace(/,\*,/g, "],["));
				
					addThisAmountToCharsRemaining(Math.max(tArray[0].length,tArray[1].length));
					
				}else {
					
				 	increaseCharsRemainingByOne();	
				}
				
		}else{	
			if(_fractionMode === _MODES.TOPFRACTION) {
				
				if(_topFractionHtmlArray.length > 0){
					_topFractionHtmlArray.pop();	
				}
		
			}else{
			  
			    if(_botFractionHtmlArray.length > 0){
					_botFractionHtmlArray.pop();
				}	
			}		
		}

		updateActiveDisplayWindow();
	}
	

	
	/**
	 * Private Procedure.
	 * When user clicks make fraction key, bring up fraction box at appropriate location
	 * and turn blinking cursor off
	 * @param  {event} the mousedown or click event 
	 * @return NONE
	*///=====================================================================================================
	function userClickedMakeFractionKey(e) {
		
		// exit if already clicked and showing
        if(_currEntryMode === _MODES.MAKEFRACTION ){return}

        turnBlinkingCursorOff();

        // NEW - disable certain keys 
        _$thisKeypad.find(".disableforfractions").addClass("showbuttondisabled");
        _$thisKeypad.find(".enter_key").addClass("fractionmode");

        // shift mode to fraction mode
		_currEntryMode = _MODES.MAKEFRACTION;
		
		//reset fraction fields
		resetFractionDisplays();
	
		//compute and show the fraction window at the correct place
		var tUsedLength = parseInt(	_$thisKeypad.find(".display").css("width"),10);
		var tTotalLength = parseInt(_$thisKeypad.find(".displaywindow").css("width"),10);
		var tWindowWidth = parseInt(_$thisKeypad.find(".fractionholder").css("width"),10);
		var tLength;
		
		if( (tTotalLength - tUsedLength ) > tWindowWidth){
			tLength = tUsedLength;
		}else{
			tLength = tTotalLength - tWindowWidth - 15; // magic number - replace
		}
		
		 // place fraction window
		_$thisKeypad.find(".fractionholder").css("left", tLength + 10 +  "px" );
		_$thisKeypad.find(".fractionholder").css("visibility","visible");
		
		// show fraction enter button and
		// hide makefraction button
		_$thisKeypad.find(".make_fraction").css("visibility","hidden");
		
		//get the start fraction count here....
		_countAtStartOfFractionEntry = _charsRemaining;		
	}
	
	
	
	
	/**
	 * Private Procedure.
	 * When user clicks clear key, clear the array of the current display depending on the mode
	 * clear fraction arrays or master html array, then redraw everything vis the update function
	 * @param  {event} the mousedown or click event 
	 * @return NONE
	*///=====================================================================================================
	function userClickedClearKey(e) {

		if(_currEntryMode === _MODES.DISPLAY){
			_masterHtmlArray = [];
			resetCharsRemainingToLimit();
		}else{
			if(_fractionMode === _MODES.TOPFRACTION){
				_topFractionHtmlArray=[];					
			}else{
			    _botFractionHtmlArray=[];
			}
		}	
		updateActiveDisplayWindow();	
	}
	
	
	
	
	/**
	 * Private Function.
	 * Builds a string of html to display that is
	 * used to convert fraction entry array - only used by fractions
	 * adds "&#" to start of keycode to make it html
	 * if no entry is made, ie student entered nothing in a field
	 * an empty quote is put in- 
	 * it is filtered, because otherwise the empty space
	 * would have a &# added to it, like a keycode
	 * @param  {array} array with keycodes
	 * @return {array} array with keycodes as html
	 *///=====================================================================================================
	function buildStringFromFractionArray(p_Array) {
		
		var tLen = p_Array.length;
		var tStringOfHtml = "";
		
		for (var i = 0; i < tLen; i++){
			var tString = p_Array[i];
			if(tString === ""){
			  tStringOfHtml += "";	
			}else if (tString == "960"){
              tStringOfHtml += "\\pi";
			}else if (tString == "36"){
			  tStringOfHtml +=  "\\$";
			}else{
			 tStringOfHtml += ("&#" + tString + ";");		
			}
		}
		
		return tStringOfHtml;
	}
	
	
	
	
	/*
	* Builds a string of html from _masterHtmlArray keycodes to display in display window and on screen
	* Used to update main display window
	* if mode is _MODES.DISPLAY, it will build for display, 
	* if mode is _MODES.MAKEFRACTION, it will build for fraction field
	*///=====================================================================================================
	function buildHtmlStringFromArray(){
		
		_stringOfHtml = "";
	    
	    // Making string to display in main text window
        // or in one or other of smaller fraction text window
        if(_currEntryMode === _MODES.DISPLAY){
	
		    var tMasterLen = _masterHtmlArray.length;
		    		
		    for (var i = 0; i < tMasterLen; i++){
		    	
		    	tString = _masterHtmlArray[i];
				// check to see if this string is a fraction
				if (tString.indexOf(FRACTION_DELIMITER) !== -1){
					// this is fraction - break string into 2 arrays to
					// translate into fraction
					var str = tString;
					
					var tArray = JSON.parse(("[[" + str + "]]").replace(/,\*,/g, "],["));
										
					// add symbols in front of all characters for display
					var tTop = buildStringFromFractionArray(tArray[0]);
					var tBot = buildStringFromFractionArray(tArray[1]);
					
				     var tNewString  =  "\\(\\frac{\\style{font-family:mheelemsanscondensed, Arial, sans-serif;}{" +
                                         tTop +"}}{\\style{font-family:mheelemsanscondensed, Arial, sans-serif;}{"+ tBot + "}}\\)";
					_stringOfHtml +=  tNewString;					
					
				} else {
			        if (tString == "960"){
                        _stringOfHtml += "\\(\\pi\\)";
					}else{
						_stringOfHtml += ("&#" + tString + ";");
					}
				}		
			} 

		}else{
            
            // making a string to place in fraction output displays
			// TOP OUTPUT DISPLAY
			if(_fractionMode === _MODES.TOPFRACTION){
				// TOP FRACTION
				var tLen = _topFractionHtmlArray.length;
				_stringOfHtml = "";

				for (var i = 0; i < tLen; i++){
					var tString = _topFractionHtmlArray[i];
			        if (tString == "960"){
                        _stringOfHtml += "\\(\\pi\\)";
					}else{
						_stringOfHtml += ("&#" + tString + ";");
					}
                }
			}else {
				
				 // BOTTOM FRACTION
				 var tLen = _botFractionHtmlArray.length;
				 _stringOfHtml = "";

				 for (var i = 0; i < tLen; i++){
				 	var tString = _botFractionHtmlArray[i];
			        if (tString == "960"){
                        _stringOfHtml += "\\(\\pi\\)";
					}else{
						_stringOfHtml += ("&#" + tString + ";");
					}
                 }
			}	
		}			
		return _stringOfHtml;
	}
	
	
	
	/**
	 * Private Procedure
	 * Depending on the currentmode, it updates
	 * the main display field and the div selected on screen, 
	 * or the 2 fraction display fields, specifically depending on
	 * MODES.DISPLAY, _MODES.MAKEFRACTION,  MODES.TOPFRACTION, MODES.BOTFRACTION.
	 * When in display mode, also populates textfield on screen and
	 * also writes content to "data-htmlarray" attribute.
	 * @param None 
	 * @return NO RETURN VALUE
	 *///=====================================================================================================
	function updateActiveDisplayWindow(){
		
		if(_currEntryMode === _MODES.DISPLAY){
			// placing in main keypad display area and into div
		    var tString = buildHtmlStringFromArray();
			_$displayWindow.html(tString);
			
			console.log("here is the string ------ " + tString);
			
			// update div html and data-array on screen only if one is chosen
			if(_$currentTextDivOnScreen !== null){
				_$currentTextDivOnScreen.html(_$displayWindow.html());
				_$currentTextDivOnScreen.attr('data-htmlarray', JSON.stringify(_masterHtmlArray));
				_$currentTextDivOnScreen.attr('data-output', tString);
				
				// iBuilder Store values in json
				if ( pageName[1] == 'builder.php' ) {
					LO_page_app.store_keypad(_$currentTextDivOnScreen.attr("id"));
				}

			}

			// USE MATHJAX HERE
			// mathajax is in que so that cursor is reset after
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]); 
			MathJax.Hub.Queue(setBlinkingCursorDistance);	
			MathJax.Hub.Queue(function () {
				$('.txt span').each(function() {
					$(this).css("visibility","visible");
				});		
			});
			
		} else {
			// in fraction display
			// no MathJax needed
			if(_fractionMode === _MODES.TOPFRACTION){
				//place in top field
				 var tString = buildHtmlStringFromArray();
				_$topFractionDisplay.html(tString);
			}else{
				//place in bottom field
				 var tString = buildHtmlStringFromArray();
				_$botFractionDisplay.html(tString);
			}
			// USE MATHJAX HERE
			// mathajax is in que so that cursor is reset after
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]); 
			MathJax.Hub.Queue(setBlinkingCursorDistance);	
			MathJax.Hub.Queue(function () {
				$('.txt span').each(function() {
					$(this).css("visibility","visible");
				});		
			});
		}		
	}
	
	
	

	/**
	* reset the fraction displays + fraction mode
	* so the top fraction area is selected and all prior input 
	* is deleted from both displays and both arrays
	* @param  NONE
	* @return NO RETURN VALUE
	*///=====================================================================================================
	function resetFractionDisplays() {
		
		_$topFractionDisplay.html("");
		_$botFractionDisplay.html("");

		_$topFractionDisplay.css("border-color","blue");
		_$botFractionDisplay.css("border-color","lightgray");
		_fractionMode = _MODES.TOPFRACTION;
		
		_topFractionHtmlArray = [];
		_botFractionHtmlArray = [];	
		
		//added....	
	}
	
	
	
	/**
	* Private Procedure
	* sets the top fraction display to active - colors both
	* @param  {event} the mousedown or click event 
	* @return NONE
	*///=====================================================================================================
	function setTopFractionDisplayToActive(e) {
		
		_$topFractionDisplay.css("border-color","blue");
		_$botFractionDisplay.css("border-color","lightgray");
		if(_fractionMode !== _MODES.TOPFRACTION) {
		 playClickSFX();	
		}
		_fractionMode = _MODES.TOPFRACTION;	
		
		if (e) {	
		  e.preventDefault();	
		}
	}
	
	
	
	/**
	* Private Procedure
	* sets the bottom fraction display to active - colors both
	* @param  {event} the mousedown or click event 
	* @return NONE
	*///=====================================================================================================
	function setBotFractionDisplayToActive(e) {
		
		_$topFractionDisplay.css("border-color","lightgray");
		_$botFractionDisplay.css("border-color","blue");
		if(_fractionMode !== _MODES.BOTFRACTION){
				playClickSFX();	
		}
		_fractionMode = _MODES.BOTFRACTION;
		
		if(e){
			e.preventDefault();	
		}
	}
	


 	/**
	 * Private Procedure.
	 * When user clicks a custom symbol key, 
	 * ie one that is made with custom art as a sprite which shifts
	 * background position, execute the appropriate code
	 * @param  {event} the mousedown or click event 
	 * @return NONE
	 *///=====================================================================================================
   function userClickedOnCustomSymbol(e){
	
	// passed so available if ever needed
	var tThisEvent = e;
	
	if(_clickedKeyClassName === "clear") {
		   playClickSFX()
	       userClickedClearKey(tThisEvent);
		
		} else if (_clickedKeyClassName === "backspace"){	
			
		    playClickSFX();
			userClickedOnBackspaceKey(tThisEvent);

		} else if (_clickedKeyClassName === "make_fraction"){
			if (isCharsRemainingZero()){
				playNegSFX();
				return;
			};
			playClickSFX()
			userClickedMakeFractionKey(tThisEvent);
		}
   }




	/**
	 * Private Procedure.
     * Resets all variables when keyPad disappears
     * called whenever keyPad is hidden or if it needs to be reset.
	 * @param  NONE
	 * @return NONE
	 *///=====================================================================================================
    function resetAllVariables(){
		_topFractionHtmlArray = [];
	 	_botFractionHtmlArray = [];
 		_masterHtmlArray = [];
		_stringOfHtml = "";
		_$displayWindow.html("");
		_currEntryMode = _MODES.DISPLAY;
		// these get reset everytime the keyPad is
		// called up again, so these are not even needed
		_charsRemaining = 10;
		_charsLimit = 10;	
		
		//***added this for new test.......
		
    }



	/**
     * Private Procedure.
     * called when user clicks inside close button X on top drag bar
     * POSSIBLY REPLACE THIS NOW? OUTDATED?
     * runs the close function from main html page that was passed in via the init() 
     * and stored in _closeFunction()
	 * @param  {event} the mousedown or click event 
	 * @return NONE
	 *///=====================================================================================================
    function userClickedCloseButton(e){
		e.preventDefault();
		try
		  {
	        _closeFunction();
		  }
		catch(err)
		  {
		   console.log("close function error in keypad object "+ err.message );
		  }
   }




	/**
	* PUBLIC Procedure
	* hides this keypad  
	* @param  NONE
	* @return NONE
   *///=====================================================================================================
    function hideKeyPad(){
	  _$thisKeypad.css("visibility","hidden");
	  // always turn cursors off or they still show up as visible
	  _$blinkingCursor.css("visibility","hidden");
	  // always turn fractions off
	  if(_hasFractionFlag === true){
		  //_$thisKeypad.find(
		  _$thisKeypad.find(".make_fraction").css("visibility","hidden");
		  _$thisKeypad.find(".fractionholder").css("visibility","hidden");
		  _$thisKeypad.find(".enter_key").removeClass("fractionmode");
		  _$thisKeypad.find(".disableforfractions").removeClass("showbuttondisabled");
	  }
	  resetAllVariables();
    }


    


	
	/**
	* PUBLIC Procedure
	* makes this keypad visible called when a div is clicked - 
	* @param  {string} p_ActiveDivToPopulateOnScreen the name of the div that was clicked
	* @param  {number} p_charLimit the limit to the number of chars allowed for this div that can be shown in display
	* @return NONE
    *///=====================================================================================================
	function showKeyPad(p_ActiveDivToPopulateOnScreen, p_charLimit) {
		
		_charsLimit = p_charLimit;
		_$currentTextDivOnScreen = $("#" + p_ActiveDivToPopulateOnScreen);
				
		var tCurrLeft = parseInt(_$thisKeypad.css("left"),10);
		var tCurrTop = parseInt(_$thisKeypad.css("top"),10);
		var tMyWidth = parseInt(_$thisKeypad.css("width"),10);
		var tMyHeight = parseInt(_$thisKeypad.css("height"),10);
		
		if( (tCurrTop < 0)||((tCurrLeft + 30) > _parentWidth)||((tCurrTop + 30) > _parentHeight)||((tCurrLeft + tMyWidth) < 50)){
			 _startInCenterFlag = true;
		}
		
		
		if(_startInCenterFlag === true){
		  _$thisKeypad.css({"left":_startX + "px", "top":_startY + "px"});	
		  _startInCenterFlag = false;
		}
		
		
		_$thisKeypad.css("visibility","visible");
		_$blinkingCursor.css("visibility","visible");
				
		if(_hasFractionFlag === true){
			_$thisKeypad.find(".make_fraction").css("visibility","visible");
	    }
		
		// get data attribute from active div and
		// place that html into this keypad display
        if (_$currentTextDivOnScreen.attr('data-htmlarray') == undefined) 
		_$currentTextDivOnScreen.attr('data-htmlarray',"[]");
		_masterHtmlArray = $.parseJSON(_$currentTextDivOnScreen.attr('data-htmlarray' ));
		_charsRemaining = _charsLimit - getTrueLengthOfEntryAtStart();
		
		updateActiveDisplayWindow();
	}
	
	
	
	
	function setKeyPadToBlank(){
		_$blinkingCursor.css("visibility","hidden");

		resetFractionDisplays();  //***********bug fix
		
		makeFractionDisplaysInvisible();
		
		resetAllVariables();
		
		// ALSO LOCK OUT HERE
	}
	
	
	/// redo this to make these invisible //***********bug fix
	// add at top as well
	function makeFractionDisplaysInvisible(){
		
		if(_hasFractionFlag === true){
			  //_$thisKeypad.find(
			  _$thisKeypad.find(".make_fraction").css("visibility","hidden");
			  _$thisKeypad.find(".fractionholder").css("visibility","hidden");
			  _$thisKeypad.find(".enter_key").removeClass("fractionmode");
			  _$thisKeypad.find(".disableforfractions").removeClass("showbuttondisabled");
		  }
		
	}
	
	
	
	
	
	function setKeypadToBlankndTargetNull(){
		_$blinkingCursor.css("visibility","hidden");
		resetAllVariables();
		_$currentTextDivOnScreen = null;
	}


    function getTrueLengthOfEntryAtStart(){
      
		  var tChars = 0;		
		  var tCopyArray = _masterHtmlArray.slice(0);
		  var tLen = tCopyArray.length;
	      for(var i = 0; i < tLen; i++){

	       	var tString = tCopyArray[i];
	
	          if (tString.indexOf(FRACTION_DELIMITER) !== -1){
		           
		        var str = tString;
		
			    var tArray = JSON.parse(("[[" + str + "]]").replace(/,\*,/g, "],["));

				tChars += (Math.max(tArray[0].length,tArray[1].length));
				  
		       }else{
			
			    tChars++;
		       }	
			}
			
		//console.log("the array is " + tChars)
	
		return tChars;
     }

	
	/*
	* Return PUBLIC functions;
	* only functions listed below are accessible
	*/
	return {
		init:init,
		hideKeyPad:hideKeyPad,
		showKeyPad:showKeyPad,
		setKeyPadToBlank:setKeyPadToBlank,
		setKeypadToBlankndTargetNull:setKeypadToBlankndTargetNull
	};
	
}
