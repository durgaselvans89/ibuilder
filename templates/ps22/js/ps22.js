var ps22 = 
  {
    ssCanvas:null,
    restrict: false,
    optionLookup: [],	
    lastAns1:null,
    lastAns2:null,
    onReady: function () {	
		ps22.init();
		$("#submitButton").click(function() {
             alert(GradeCogneroQuestion(getState(),1));
		});
		
		$("#clearButton").click(function() {
			ps22.reset();
		});	
        if (window.parent && window.parent.document) {
            $("#HTML5QuestionInnerPanel",window.parent.document).css("margin","0px");
        }
    },
    init: function () {
        var cogAPI = false;
		if(typeof HTML5RiaAPI !== "undefined") {
            var cogAPI = HTML5RiaAPI.getInstance();			
            cogAPI.setQuestionStateGetFromAPPFunction(getState);
            cogAPI.setCaptureImageFromAPPFunction(ps22.getCanvas);
        } 
		$('.answer').attr("data-select","0");
		$('.answer').css('cursor','pointer');
		

		$('.answer').click(function() {
			if ($( this ).attr("data-select") == "0")
                $( this ).attr("data-select","1");
            else
                $( this ).attr("data-select","0");
            if($( this ).attr("data-block") == "answer"){
                if(JSONObject.single && ps22.lastAns1 != null && ps22.lastAns1.attr("data-id") != $( this ).attr("data-id") && ps22.lastAns1.attr("data-select") == "1"){
                    ps22.lastAns1.attr("data-select","0");
                }
                ps22.lastAns1 = $( this ); 
             }else{
                if(JSONObject.single && ps22.lastAns2 != null && ps22.lastAns2.attr("data-id") != $( this ).attr("data-id") && ps22.lastAns2.attr("data-select") == "1"){
                    ps22.lastAns2.attr("data-select","0");
                }
                ps22.lastAns2 = $( this ); 
             }
            ps22.captureScreenShot(); 
		});
		var cnt = 0;
		$('#answer_set[data-id="0"] div.answer').each(function( index ) {
			ps22.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:"0"};
			cnt++;
		});
		$('#answer_set[data-id="1"] div.answer').each(function( index ) {
			ps22.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:"0"};
			cnt++;
		});		
		if (cogAPI) {
            var previousState = cogAPI.getQuestionState();
            if (!!previousState) {				
                this.reset(previousState);
            }
        }
    }, 
	inflateFlatState: function(flat) {		
        var state = new Object();
        var s = flat.state.split(",");
        state.option = [];
        for (var i in s) {
            var t = s[i].split("|");
            var id = t[0];
            state.option[id] = {id: parseFloat(t[1]),select:String(t[2])};
        }
        return state;
    },
    reset: function(state) {		
		if (state != undefined) {			
            var s = state;			
            if (state.option == undefined) {				
                s = this.inflateFlatState(state);
            }
            for (var a in s.option) {				
                ps22.optionLookup[a].el.attr("data-select",s.option[a].select);
            }
        } else {
            for (var a in ps22.optionLookup) {
                ps22.optionLookup[a].el.attr("data-select","0");                
            }
        }
        ps22.lastAns1 = null;
        ps22.lastAns2 = null;
        ps22.captureScreenShot();
    },
    calcSelectInOptions: function(options) {
        var inOptions = {};
        
        return inOptions;
    },
    getState: function () {
		var cnt = 0;
		var inOptions = [];
		$('#answer_set[data-id="0"] div.answer').each(function( index ) {
			ps22.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:$(this).attr('data-select'),ans:$(this).attr('data-correct')=="true"? 1: 0 };			
			inOptions.push(cnt+"/"+$(this).attr('data-select'));
			cnt++;
		});
		$('#answer_set[data-id="1"] div.answer').each(function( index ) {
			ps22.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:$(this).attr('data-select'),ans:$(this).attr('data-correct')=="true"? 1: 0};
			inOptions.push(cnt+"/"+$(this).attr('data-select'));
			cnt++;
		});		
        var options =  jQuery.extend(true, {},ps22.optionLookup);       
        var ret = {option: options,"inOptions":inOptions.join("|")};
        return ret;
    },
    getCanvas: function () {
        if (ps22.ssCanvas != null) 
            return ps22.ssCanvas.toDataURL();
        return $("<canvas/>")[0].toDataURL();
    },
    captureScreenShot: function (event,ui) {
        if (typeof(html2canvas) != "undefined") {
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    ps22.ssCanvas = canvas;
                }
            });
        }
    }
}
function getState() {
    var state = jQuery.extend(true, {}, ps22.getState());
    var ret = {};
    var options = [];
    for (var i in state.option) {
        options.push(i+"|"+state.option[i].id+"|"+state.option[i].select+"|"+state.option[i].ans);
    }
    ret.inOptions = state.inOptions;
    ret.state = options.join(",");    
    return ret;
}