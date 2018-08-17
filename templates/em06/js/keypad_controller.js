// $(window).load(function() {
	
	var _currentClickedDiv;
	
	function hidekeyboardAndLayer2(){
		//FAKED FOR NOW
		_keyPads[_currentKeypad].setKeyPadToBlank();
		_keyPads[_currentKeypad].hideKeyPad();
		
		if(_currentClickedText !== null){
			$("#" + _currentClickedText).css("border", "1px solid black");
			_currentClickedText = null;
		}
		
	}
	
	// temp wrapper script
	function playClickSFX(){
		var tFeedbackToPlay = document.getElementById("sfx_click");
		tFeedbackToPlay.play();
	}


	// temp wrapper script
	function playNegSFX(){
		var tFeedbackToPlay = document.getElementById("sfx_neg");
		tFeedbackToPlay.play();
	}
	
	
	
	var _currentKeypad = null;
	var _currentClickedText = null;

	
	$("#content").on("mousedown", clickedOnBackground);
	
	function clickedOnBackground(e){
		if(_currentKeypad !== null){
			_keyPads[_currentKeypad].hideKeyPad();
			_currentKeypad = null;
		}
		
		if(_currentClickedText !== null){
				$("#" + _currentClickedText).css("border", "1px solid black");
				_currentClickedText = null;
		}
	}
	
	
	_keyPads = {};
	_keyPads["1"] = new keyPad().init("numeric_keypad_G1to6", hidekeyboardAndLayer2, playClickSFX,playNegSFX,  true, 3,"1");
	_keyPads["2"] = new keyPad().init("math_keypad_G1to2", hidekeyboardAndLayer2,playClickSFX,playNegSFX, true, 3,"2");
	_keyPads["3"] = new keyPad().init("full_keypad_g1to2", hidekeyboardAndLayer2,playClickSFX,playNegSFX, true, 3,"3");
	
	function clickedTextField(e){
		
		e.stopPropagation();
		e.preventDefault();
		
		if(_currentClickedText === e.currentTarget.id){
			//reclicked the div- unhilite, set keyPad to blank
			$("#" + _currentClickedText).css("border", "1px solid black");
			_currentClickedText = null;
			_keyPads[_currentKeypad].setKeyPadToBlank();
			_keyPads[_currentKeypad].hideKeyPad();
			return;
			
		}else if(_currentClickedText === null){
			$("#" + e.currentTarget.id).css("border", "3px solid  DeepSkyBlue ");
			
		}else if(_currentClickedText !== e.currentTarget.id){
			$("#" + _currentClickedText).css("border", "1px solid black");
			$("#" + e.currentTarget.id).css("border", "3px solid DeepSkyBlue ");
		}
				
		_currentClickedText = e.currentTarget.id;
		var tThisKeypad = $("#"+e.currentTarget.id ).attr('data-keypad');
		var tThisLimit = $("#"+e.currentTarget.id ).attr('data-charlimit');
		tThisLimit = parseInt(tThisLimit,10);			
		// filter clicking the same div....
		
		if(_currentKeypad === null){
			
			$("#" + _currentClickedText).css("border", "3px solid DeepSkyBlue ");
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