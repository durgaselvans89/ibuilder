var ps04 = 
  {
    ssCanvas:null,
    restrict: false,
    dragLookup: [],

    onReady: function () {
        ps04.init();
		$("#submitButton").click(function() {
            alert(displayAnswers());
		});
		
		$("#clearButton").click(function() {
			ps04.reset();
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
            cogAPI.setCaptureImageFromAPPFunction(ps04.getCanvas);
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
                    $(this).data("uiDraggable").originalPosition = {top:ps04.dragLookup[index].orig.top,left:ps04.dragLookup[index].orig.left};
                    ps04.dragLookup[index].wasInBox = !!ps04.dragLookup[index].inBox;
                    if(!event) {
                        ps04.dragLookup[index].inBox = false;
                        ps04.dragLookup[index].curr.left = ps04.dragLookup[index].orig.left;
                        ps04.dragLookup[index].curr.top = ps04.dragLookup[index].orig.top;
                    }
                    return !event;
                },
                stop: function(event,ui) {
                    var index = $(this).attr("c_id") || $(this).attr("data-id");
                    if (ps04.dragLookup[index].wasInBox || ps04.dragLookup[index].inBox)
                        ps04.captureScreenShot();
                },
                cursor: "pointer"
            });

            $drags.eq(i).css('cursor', 'pointer');
        }

        var $drops = $('.drop_object');
        for (i = 0; i < $drops.length; i++) {
            $drops.eq(i).droppable({    
                "accept": function(d) {
                    if (ps04.restrict) {
                        if ($(this).attr('data-array').split(',').indexOf(""+(parseInt(d.attr('data-id')) + 1)) == -1)
                            return false;
                        return true;
                    } else {
                        return d.hasClass("drag_object");
                    }
                },
                "drop": function(event,ui) {
                    var drag_id = ui.draggable.attr("c_id") || ui.draggable.attr("data-id");
                    ps04.dragLookup[drag_id].inBox = $(this).attr('data-id');
                    ps04.dragLookup[drag_id].curr = ui.draggable.position();
                },
                "hoverClass": "highlight"
            });
        }
        if (cogAPI) {
            var previousState = cogAPI.getQuestionState();
            if (!!previousState) {
                this.reset(previousState);
            }
        }
        MathJax.Callback.Queue([ps04.captureScreenShot]);
    },
    inflateFlatState: function(flat) {
        var state = new Object();
        var s = flat.state.split(",");
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
        return state;
    },
    reset: function(state) {
        if (state != undefined) {
            var s = state;
            if (state.drag == undefined) {
                s = this.inflateFlatState(state);
            }
            for (var a in s.drag) {
                ps04.dragLookup[a].orig.top = s.drag[a].orig.top;
                ps04.dragLookup[a].orig.left = s.drag[a].orig.left;
                ps04.dragLookup[a].el.css({top:s.drag[a].curr.top,left:s.drag[a].curr.left});
                ps04.dragLookup[a].curr.top = s.drag[a].curr.top;
                ps04.dragLookup[a].curr.left = s.drag[a].curr.left;
                if (s.drag[a].inBox != undefined) {
                    ps04.dragLookup[a].inBox = s.drag[a].inBox;
                }
            }
        } else {
            for (var a in ps04.dragLookup) {
                ps04.dragLookup[a].el.css({top:ps04.dragLookup[a].orig.top,left:ps04.dragLookup[a].orig.left});
                ps04.dragLookup[a].curr.top = ps04.dragLookup[a].orig.top;
                ps04.dragLookup[a].curr.left = ps04.dragLookup[a].orig.left;
                ps04.dragLookup[a].inBox = false;
            }
        }
        ps04.captureScreenShot();
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
        var drags =  jQuery.extend(true, {},ps04.dragLookup);
        var dragsInDrops = this.calcDragsInDrops(drags);
        var inDrops = [];
        for (var b in dragsInDrops) {
            if (b == "undefined")
                continue;
            var inner = [];
            for(var c in dragsInDrops[b]) {
                inner.push(dragsInDrops[b][c].id + "/" + dragsInDrops[b][c].val); 
            }
            inDrops.push(b +":" + inner.join(","));
        }
        var ret = {drag: drags, "inDrops": inDrops.join("|")};
        return ret;
    },
    getCanvas: function () {
        if (ps04.ssCanvas != null) 
            return ps04.ssCanvas.toDataURL();
        return $("<canvas/>")[0].toDataURL();
    },
    captureScreenShot: function (event,ui) {
        if (typeof(html2canvas) != "undefined") {
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    ps04.ssCanvas = canvas;
                }
            });
        }
    }
}
function getState() {
    var state = jQuery.extend(true, {}, ps04.getState());
    var ret = {};
    var drags = [];
    for (var i in state.drag) {
        drags.push(i+"|"+state.drag[i].inBox+"|"+state.drag[i].curr.left+"|"+state.drag[i].curr.top+"|"+state.drag[i].orig.left+"|"+state.drag[i].orig.top);
    }
    ret.inDrops = state.inDrops;
    ret.state = drags.join(",");
    return ret;
}


function arrEqual (arr,arr2) {
    if (arr == undefined && arr2 != undefined)
        return false;
    if (arr2 == undefined && arr != undefined) 
        return false;
    if (arr2.length !== arr.length) 
        return false;
    for (var a in arr) {
        if (arr[a] !== arr2[a]) 
            return false;
    }
    return true;
}
