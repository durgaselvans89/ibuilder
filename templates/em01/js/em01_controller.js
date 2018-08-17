
// em01 STATIC TEMPLATE controller-
// handles setting up of the logic app
// depending on what the framework sends
// via dispatcher

var LO_app;
var simWindow;
debug = true;


var AppController = {
	
		myDispatcher:{},
		
		// inits the controller when page loads
		// inside page builder
		startController: function(){
			
			var tWidth = $("#wrapper").css("width");
		    var tHeight = $("#wrapper").css("height");

			// set content to invisible	
			//$(".content").css("visibility","hidden");
			$("#lockout").css({"position":"absolute","background": "white", "width": "1000px","height":"1000px","top":"0px","left":"0px","z-index":1000});
			//dispatcher = new dispatcher();
			window.dispatcher = this.getDispatcher()
		    
			// if in debug mode, instantiate sim window
			if(debug === true ){
				// open sim window to simulate framework message calls
				this.openSimWindow();
				// for now attach here.
				$("#lockout").append("<input type='button' value='simulate page load done' id='pageloadbutton' top='600px' onclick='AppController.simulatePageLoadDone()'></br>");
			}	
			
			window.myDispatcher = new appDispatcher().init(dispatcher);
			
			
			// bind anonymous functions to message 
			// this is the message that is returned from framework  after scuccessfull load is reported
			// it determines if game is a new game or return, teacherview or.....
			dispatcher.bind("iteration.gamestate.em01", function(p_state){
				
				//alert(p_state.type);
				
				// new game
				if ((p_state.type === "iteration")&&(p_state.status === "new")){
					//console.log("new game");
					LO_app = new staticTemplate().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.startNewGame("iteration");
				
				// return game
				}else if ((p_state.type === "iteration")&&(p_state.status === "return")){
					var tSavedState = p_state.savedstate;
					//console.log("return game");
					LO_app = new staticTemplate().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.restoreOldGame(tSavedState,"iteration");
					
				} else if (p_state.type === "teacherview"){
				     console.log("teacherview");
				    var tSavedState = p_state.savedstate;
					LO_app = new staticTemplate().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.restoreOldGame(tSavedState,"teacherview");
					
				}else if ((p_state.type === "assessment")&&(p_state.status === "new")){
					console.log("assessment new");
					LO_app = new staticTemplate().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.startNewGame("assessment");
					
				}else if ((p_state.type === "assessment")&&(p_state.status === "return")){
					console.log("assessment return");
					var tSavedState = p_state.savedstate;
					LO_app = new staticTemplate().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.restoreOldGame(tSavedState,"assessment");
				}
				
				
				
				
	        })
	
	        // if debug === false, load page here.........
	        if(debug !== true){
		    this.sendIterationLoaded();
			}
		},
		
		
		// get dispatcher
		/*getDispatcher: function(){
			if(window.dispatcher instanceof dispatcher){
				return window.dispatcher;
			}else if (typeof dispatcher === "function"){
				return new dispatcher();
			}else{
				return{
				bind:function(){},
				dispatch:function(){}
				}
			}	
		},*/
		
		getDispatcher: function(){
					var parent, parentDispatcher;

					try {
						parent = window.parent;

						if (parent && parent.document) {
							parent = parent.document.getElementById(window.name);
							parentDispatcher = parent.dispatcher;
						}
					} catch (exception) {
					}

					if(parentDispatcher) {
						return parentDispatcher;
					}else if (typeof dispatcher === "function"){
						return new dispatcher();
					}else{
						return{
						bind:function(){},
						dispatch:function(){}
						}
					}
				},

		// opens pop-up window for debug/framework simulation
		openSimWindow: function(){
			simWindow = window.open("html/simwindow.html", template,"width=350,height=150");
		},
		
		// send framework iteration has loaded
		sendIterationLoaded: function(){
		    var tWidth = $("#wrapper").css("width");
		    var tHeight = $("#wrapper").css("height");
		
		   	// check to see if directions and hint are used....
			if($("#hint_0").attr("data-active")== "true"){
				var tShowHint = "true";
			}
			
			if($("#directions_0").attr("data-active")== "true"){
				var tShowDir = "true";
			}
			
			
			dispatcher.dispatch("iteration.loaded", {"width":tWidth,"height":tHeight, "showdirections":tShowDir, "showhints":tShowHint });
		},
		
		// tests that can be run from console window to check interactivity
		runClickTest: function(){
			alert("got the click!");
		},
		
		// for debug and simulation
		attachTestButton: function(){
			$("#content").append("<input type='button' value='CheckbuttonInactive' id='showCheckButtonInactive' top='600px' onclick='AppController.runClickTest()'></br>");
		},
		
		// sends page load message 
		simulatePageLoadDone: function(){		
			$( "#pageloadbutton" ).remove();
			this.sendIterationLoaded();
		}
		
		

}



// pop-up window needs reference to dispatcher...
// cannot get it until it has fully loaded
window.smallWindowHasLoaded =  function(){
	simWindow.setDispatcher(dispatcher);
}

