var ps24 = 
  {
    ssCanvas:null,
    restrict: false,
    dragLookup: [],
	optionLookup: [],
    onReady: function () {
		ps24.init();
		$("#submitButton").click(function() {
            alert(displayAnswers());
		});		
		$("#clearButton").click(function() {			
			ps24.reset();
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
            cogAPI.setCaptureImageFromAPPFunction(ps24.getCanvas);
        }
        this.restrict = JSONObject.dragndrop_setup[0].restrict == "true";

        var i; 
        var $origDrags = $('.drag_object');
        var c = $origDrags.length;
        for (i = 0; i < c;i++) {            
            for (var j = 1; j < $origDrags.eq(i).attr('data-count'); j++) {
                var clone = $origDrags.eq(i).clone().prop({id:"drag_object_"+c});
                clone.attr("c_id",  "" + c);
                $("#drag_object_set")[0].appendChild(clone[0]);
                c++;
            }
        }

        var $drags = $('.drag_object');
        for (i = 0; i < $drags.length; i++) {
            this.dragLookup[i] = {el: $drags.eq(i), orig :$drags.eq(i).position(), curr:$drags.eq(i).position()};
            $drags.eq(i).draggable({
                revert: function(event,ui) {
                    var index = $(this).attr("c_id") || $(this).attr("data-id");
                    $(this).data("uiDraggable").originalPosition = {top:ps24.dragLookup[index].orig.top,left:ps24.dragLookup[index].orig.left};
                    ps24.dragLookup[index].wasInBox = !!ps24.dragLookup[index].inBox;
                    if(!event) {
                        ps24.dragLookup[index].inBox = false;
                        ps24.dragLookup[index].curr.left = ps24.dragLookup[index].orig.left;
                        ps24.dragLookup[index].curr.top = ps24.dragLookup[index].orig.top;
                    }
                    return !event;
                },
                stop: function(event,ui) {
                    var index = $(this).attr("c_id") || $(this).attr("data-id");
                    if (ps24.dragLookup[index].wasInBox || ps24.dragLookup[index].inBox)
                        ps24.captureScreenShot();
                },
                cursor: "pointer"
            });

            $drags.eq(i).css('cursor', 'pointer');
        }

        var $drops = $('.drop_object');
        for (i = 0; i < $drops.length; i++) {
            $drops.eq(i).droppable({
                "accept": function(d) {
                    if (ps24.restrict) {
                        if ($(this).attr('data-array').split(',').indexOf(""+(parseInt(d.attr('data-id')) + 1)) == -1)
                            return false;
                        return true;
                    }else {
                        return d.hasClass("drag_object");
                    }
                },
                "drop": function(event,ui) {
                    var drag_id = ui.draggable.attr("c_id") || ui.draggable.attr("data-id");
                    ps24.dragLookup[drag_id].inBox = $(this).attr('data-id');
                    ps24.dragLookup[drag_id].curr = ui.draggable.position();
                },
                "hoverClass": "highlight"
            });
        }
		var $options = $('.answer');
		var cnt=0;
		$options.attr("data-select","0");
		$options.css('cursor','pointer');
		$options.each(function( index ) {
			ps24.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:"0"};
			cnt++;
		});
		$options.click(function() {			
			if ($( this ).attr("data-select") == "0")
				$( this ).attr("data-select","1");
			else
				$( this ).attr("data-select","0");			
		});	
		//this.reset({inDrops:"0:1/,6/,7/|1:2/,3/,4/,5/", inOptions:"0/1|1/0|2/0|3/0|4/0|5/1|6/1", state:"0|0|87|192|71|285,1|1|275|173|169|286,2|1|305|204|341|285,3|1|314|160|72|323,4|1|301|230|168|323,5|0|106|218|340|322,6|0|77|231|168|355###0|0|1,1|1|0,2|2|0,3|3|0,4|4|0,5|5|1,6|6|1"});
        if (cogAPI) {
            var previousState = cogAPI.getQuestionState();			
            if (!!previousState) {
                this.reset(previousState);
            }
        }
        MathJax.Callback.Queue([ps24.captureScreenShot]);
    },
    inflateFlatState: function(flat) {
        var state = new Object();
        var arr = flat.state.split("###");
		var s = arr[0].split(",");
        state.drag = [];	
		
        for (var i in s) {
            var t = s[i].split("|");
            var id = t[0];					
                state.drag[id] = {
                    curr: {"left":parseFloat(t[2]),"top":parseFloat(t[3])},
                    orig: {"left":parseFloat(t[4]),"top":parseFloat(t[5])}
                };
                if (t[1] != undefined) 
                    state.drag[id].inBox = t[1];
        }
		state.option = [];
		s = arr[1].split(",");
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
            if (state.drag == undefined) {
                s = this.inflateFlatState(state);
            }
            for (var a in s.drag) {
                ps24.dragLookup[a].orig.top = s.drag[a].orig.top;
                ps24.dragLookup[a].orig.left = s.drag[a].orig.left;
                ps24.dragLookup[a].el.css({top:s.drag[a].curr.top,left:s.drag[a].curr.left});
                ps24.dragLookup[a].curr.top = s.drag[a].curr.top;
                ps24.dragLookup[a].curr.left = s.drag[a].curr.left;
                if (s.drag[a].inBox != undefined) {
                    ps24.dragLookup[a].inBox = s.drag[a].inBox;
                }
            }			
            for (var a in s.option) {				
                ps24.optionLookup[a].el.attr("data-select",s.option[a].select);
            }
        } else {
            for (var a in ps24.dragLookup) {
                ps24.dragLookup[a].el.css({top:ps24.dragLookup[a].orig.top,left:ps24.dragLookup[a].orig.left});
                ps24.dragLookup[a].curr.top = ps24.dragLookup[a].orig.top;
                ps24.dragLookup[a].curr.left = ps24.dragLookup[a].orig.left;
                ps24.dragLookup[a].inBox = false;
            }
			for (var a in ps24.optionLookup) {
                ps24.optionLookup[a].el.attr("data-select","0");                
            }
        }
        ps24.captureScreenShot();
    },
    calcDragsInDrops: function(drags) {
        var inDrops = {};
        for (var d in drags) {
            if (drags[d].inBox != "undefined") {
                inDrops[drags[d].inBox] = inDrops[drags[d].inBox] || [];
                inDrops[drags[d].inBox].push({id: ""+(parseFloat(drags[d].el.attr('data-id')) + 1),val:drags[d].el.attr('data-value')});
            }
        }
        return inDrops;
    },
    getState: function () {
        var drags =  jQuery.extend(true, {},ps24.dragLookup);
		var dragsInDrops = this.calcDragsInDrops(drags);
        var inDrops = [];
		var cnt = 0;
		var inOptions = [];
        for (var b in dragsInDrops) {
            if (b == "undefined")
                continue;
            var inner = [];
            for(var c in dragsInDrops[b]) {
                inner.push(dragsInDrops[b][c].id + "/" + dragsInDrops[b][c].val); 
            }
            inDrops.push(b +":" + inner.join(","));
        }
		$('.answer').each(function( index ) {
			ps24.optionLookup[cnt] = {el:$(this),id:$(this).attr('data-id'),select:$(this).attr('data-select'),ans:$(this).attr('data-correct')=="true"? 1: 0};			
			inOptions.push(cnt+"/"+$(this).attr('data-select'));
			cnt++;
		});	
		var options =  jQuery.extend(true, {},ps24.optionLookup);
        var ret = {drag: drags, "inDrops": inDrops.join("|"),option:options,"inOptions":inOptions.join("|")};
        return ret;
    },
    getCanvas: function () {
        if (ps24.ssCanvas != null) 
            return ps24.ssCanvas.toDataURL();
        return $("<canvas/>")[0].toDataURL();
    },
    captureScreenShot: function (event,ui) {
        if (typeof(html2canvas) != "undefined") {
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    ps24.ssCanvas = canvas;
                }
            });
        }
    }
}
function getState() {
    var state = jQuery.extend(true, {}, ps24.getState());
    var ret = {};
    var drags = [];
    var options = [];
    for (var i in state.drag) {
        drags.push(i+"|"+state.drag[i].inBox+"|"+state.drag[i].curr.left+"|"+state.drag[i].curr.top+"|"+state.drag[i].orig.left+"|"+state.drag[i].orig.top);
    }
    for (var i in state.option) {
       options.push(i+"|"+state.option[i].id+"|"+state.option[i].select+"|"+state.option[i].ans);
    }
    ret.inDrops = state.inDrops;
    ret.state = drags.join(",")+'###'+options.join(","); 
    ret.inOptions = state.inOptions;  
    return ret;
}