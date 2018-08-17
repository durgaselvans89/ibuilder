
// instantiated by main app
// this communicates with framework
// provides a common set of communication functions 
// to communicate with framework 


var appDispatcher = function() {
	
	var _myDispatcher;
	
	
	// send copy of dispatcher on init
	function init(p_Dispatcher) {
		_myDispatcher = p_Dispatcher;	
		//alert(_myDispatcher);
		return this;
	}
		
	
	// sets check button to gray inactive state
	function setCheckButtonToInactive() {
		_myDispatcher.dispatch("iteration.checkbutton", {"state":"inactive"});
	}
	
		
	// sets check button to active state 
	function setCheckButtonToActive() {
		//alert("here");
		_myDispatcher.dispatch("iteration.checkbutton", {"state":"active"});	
	}
	
		
	// sets check button to correct state
	function setCheckButtonToCorrect() {
		_myDispatcher.dispatch("iteration.checkbutton", {"state":"correct"});	
	}
	
		
	// sets check button to incorrect state
	function setCheckButtonToIncorrect() {
		_myDispatcher.dispatch("iteration.checkbutton", {"state":"incorrect"});	
	}
	
	
	// shows check button - not in original
	function showCheckButton() {
	   _myDispatcher.dispatch("iteration.checkbutton", {"state":"visible"});	
	}
	
	
	// hides check button
	function hideCheckButton() {
		_myDispatcher.dispatch("iteration.checkbutton", {"state":"hidden"});	
	}
	
	// test to see if it works
	function test(){
		alert("test");
	}
	
	return { 
		init:init,
		hideCheckButton:hideCheckButton,
		showCheckButton:showCheckButton,
		setCheckButtonToIncorrect:setCheckButtonToIncorrect,
		setCheckButtonToCorrect:setCheckButtonToCorrect,
		setCheckButtonToActive:setCheckButtonToActive,
		setCheckButtonToInactive:setCheckButtonToInactive,
		test:test
		
	}
	
}