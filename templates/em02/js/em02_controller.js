

/* 
  ===================================================================
  EM MULTIPLE CHOICE OBJECT TEMPLATE  em02 CONTROLLER
  handles setting up of the logic app
  depending on what the framework sends 
  via dispatcher
  ===================================================================
*/


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

			// set lockout layer to white and inline
			$("#lockout").css({"background": "white", "display":"inline"});
			
			// set the dispatcher
			window.dispatcher = this.getDispatcher()
		    //this.openSimWindow();
			// if in debug mode, instantiate sim window
			if(debug === true ){
				// open sim window to simulate framework message calls
				this.openSimWindow();
				// for now attach here.
				$("#lockout").append("<input type='button' value='simulate page load done' id='pageloadbutton' top='600px' onclick='AppController.simulatePageLoadDone()'></br>");
			}	
			
			//alert(dispatcher);
			// modify this later in case checkanswer is not needed...
			this.myDispatcher = new appDispatcher().init(dispatcher);
			
			//alert(dispatcher);
			// bind anonymous functions to message 
			// this is the message that is returned from framework  after scuccessfull load is reported
			// it determines if game is a new game or return, teacherview or.....
			dispatcher.bind("iteration.gamestate.em02", function(p_state){
				
				// new game
				if ((p_state.type === "iteration")&&(p_state.status === "new")){
				
				    // get attempts
					var tAttempts = $("#content").attr("data-attempts");
				    tAttempts = parseInt(tAttempts,10);
				
				    var tFeedbackType = $("#content").attr("data-feedback_type");
					var tOpenResponse = $("#content").attr("data-open_response");
					
					LO_app = new multipleChoice().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.startNewGame("iteration", tAttempts,tFeedbackType, tOpenResponse );
				
				}else if ((p_state.type === "iteration")&&(p_state.status === "return")){
					var tSavedState = p_state.savedstate;
				      
					LO_app = new multipleChoice().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.restoreOldGame(tSavedState);

				} else if (p_state.type === "teacherview"){
					//alert("teacher view");
					var tSavedState = p_state.savedstate;
					LO_app = new multipleChoice().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.displayTeacherView(tSavedState);

				}else if ((p_state.type === "assessment")&&(p_state.status === "new")){

					//alert("new assess");
					var tAttempts = $("#content").attr("data-attempts");
				    tAttempts = parseInt(tAttempts,10);
				
				    var tFeedbackType = $("#content").attr("data-feedback_type");
					var tOpenResponse = "false";
					
					LO_app = new multipleChoice().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.startNewGame("assessment", tAttempts,tFeedbackType, tOpenResponse );
					


				}else if ((p_state.type === "assessment")&&(p_state.status === "return")){

					//alert("return assess");
					var tSavedState = p_state.savedstate;
				      
					LO_app = new multipleChoice().init(	AppController.myDispatcher, window.dispatcher);
					LO_app.restoreOldGame(tSavedState);

				}
	        })
	
			// if not debug, send loaded message....
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
			// assumes there will only be one hint and direction per em iteration
			// and it will be first child named "_0"
			if($("#hint_0").attr("data-active")== "true"){
				var tShowHint = "true";
			}
			
			if($("#directions_0").attr("data-active")== "true"){
				var tShowDir = "true";
			}
		 
		    // dispatch loaded
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
		
		// sends page load message for sim
		simulatePageLoadDone: function(){		
			$( "#pageloadbutton" ).remove();
			this.sendIterationLoaded();
		},
		
		// sends page load message
		sendPageLoadDone: function(){
			this.sendIterationLoaded();
		}

}



// pop-up window needs reference to dispatcher...
// cannot get it until it has fully loaded
window.smallWindowHasLoaded =  function(){
	simWindow.setDispatcher(dispatcher);
}

