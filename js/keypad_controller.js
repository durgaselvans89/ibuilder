// $(window).load(function() {
	
	var _currentClickedDiv;
	
	function hidekeyboardAndLayer2(){
        if(typeof _keyPads[_currentKeypad] != "undefined") {
		    _keyPads[_currentKeypad].setKeyPadToBlank();
		    _keyPads[_currentKeypad].hideKeyPad();
        }
		
		if(_currentClickedText !== null){
			$("#" + _currentClickedText).removeClass("keyboardOpened");
			_currentClickedText = null;
		}
		
	}
	
	// temp wrapper script
	function playClickSFX(){
	}


	// temp wrapper script
	function playNegSFX(){
	}
	
	
	
	var _currentKeypad = null;
	var _currentClickedText = null;

	
	//$("#content").on("mousedown", clickedOnBackground);
	
	function clickedOnBackground(e){
		if(_currentKeypad !== null){
			_keyPads[_currentKeypad].hideKeyPad();
			_currentKeypad = null;
		}
		
		if(_currentClickedText !== null){
			$("#" + _currentClickedText).removeClass("keyboardOpened");
		    _currentClickedText = null;
		}
	}
	
    var ps03 = ps03 || {hideAll:function(){}};
	_keyPads = {};
	_keyPads["1"] = new keyPad().init("numeric_keypad_G1to6", function(){hidekeyboardAndLayer2();ps03.hideAll();}, playClickSFX,playNegSFX,  true, 3,"1","123s");
	_keyPads["2"] = new keyPad().init("math_keypad_G1to2", function(){hidekeyboardAndLayer2();ps03.hideAll();},playClickSFX,playNegSFX, true, 3,"2","123s");
	_keyPads["3"] = new keyPad().init("full_keypad_g1to2", function(){hidekeyboardAndLayer2();ps03.hideAll();},playClickSFX,playNegSFX, true, 3,"3","123s");
	_keyPads["4"] = new keyPad().init("ela_full_keypad_g1to2", function(){hidekeyboardAndLayer2();ps03.hideAll();},playClickSFX,playNegSFX, true, 3,"4","abcs");
	
	function clickedTextField(id){
		if(_currentClickedText === id){
			//reclicked the div- unhilite, set keyPad to blank
			$("#" + _currentClickedText).removeClass("keyboardOpened");
			_currentClickedText = null;
			_keyPads[_currentKeypad].setKeyPadToBlank();
			_keyPads[_currentKeypad].hideKeyPad();
			return;
		} else if(_currentClickedText !== id) {
			$("#" + _currentClickedText).removeClass("keyboardOpened");
		}
	    $("#" + id).addClass("keyboardOpened");
		_currentClickedText = id;
				
		var tThisKeypad = $("#"+id ).attr('data-keypad');
		var tThisLimit = $("#"+id ).attr('data-charlimit');
		tThisLimit = parseInt(tThisLimit,10);			
		// filter clicking the same div....
		
		if(_currentKeypad === null){
			
	        $("#" + _currentClickedText).addClass("keyboardOpened");
			_keyPads[tThisKeypad].showKeyPad(_currentClickedText,tThisLimit );
			_currentKeypad = tThisKeypad;
			
		}else if(tThisKeypad === _currentKeypad){
			//same keypad different div setKeyPadToBlank
			//alert("here");
			_keyPads[tThisKeypad].setKeyPadToBlank();
			_keyPads[tThisKeypad].showKeyPad(_currentClickedText,tThisLimit );
			_currentKeypad = tThisKeypad;
			
		}else if(tThisKeypad !== _currentKeypad){
			_keyPads[_currentKeypad].setKeyPadToBlank();
			_keyPads[_currentKeypad].hideKeyPad();
			_keyPads[tThisKeypad].showKeyPad(_currentClickedText,tThisLimit );
			_currentKeypad = tThisKeypad;
		}
	}	
	
//});
