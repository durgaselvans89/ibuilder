var ps01 = {
    ssCanvas : null,
    getState : function() {
        var cells = $(".highlight").not(".highlight_drop_box");
        var grid = [];
        $.each(cells, function(index) {
            id = $(cells[index]).data("id");
            var selected = $(cells[index]).hasClass("highlight_on");
            grid.push( id + ":" + selected );
        });
        return {"grid":grid.join(",")};
    },
    setState : function(value) {
        var cell;
        var item;
        var grid = value.grid.split(",");
        $.each(grid, function(index) {
            item = grid[index].split(":");
            if(item[1] == "true") {
                cell = $("span[data-id='" + item[0] + "']");
                cell.addClass("highlight_on");
                switch($.json_layout) {
                    case "B":
                    case "C":
                        var highlight_answer = $(cell).clone();
                        highlight_answer.removeClass("highlight_on");
                        highlight_answer.addClass("highlight_drop_box");
                        $(".drop_box").append(highlight_answer);
                        break;
                    default:
                        break;
                }
            }
        });
    },
    clear : function() {
        var cells = $(".highlight");
        $.each(cells, function(index) {
            if($(this).hasClass("highlight_on"))
                $(this).removeClass("highlight_on");
        });
        if($(".drop_box")) {
            $(".drop_box").empty();
        }
        if($.json_layout == "C") {
            $(".highlight").draggable("enable");
        }
        ps01.captureScreenShot();
    },
    init : function (data) {
        if (window.parent && window.parent.document) {
            $("#HTML5QuestionInnerPanel",window.parent.document).css("margin","0px");
        }
        if(typeof HTML5RiaAPI !== "undefined") {
            var cogAPI = HTML5RiaAPI.getInstance();
            cogAPI.setQuestionStateGetFromAPPFunction(ps01.getState);
            cogAPI.setCaptureImageFromAPPFunction(ps01.getCanvas);
        }
        $(".highlight").hover(
            function() { 
                if (!$(this).hasClass("highlight_on"))
                    $(this).addClass("highlight_over");
            }, function() {
                $(this).removeClass("highlight_over");
            }
        );
        // Apply selected style to contnet
        switch($.json_layout) {
            case "A":
                $(".highlight").click(function() { 
                    $(this).hasClass("highlight_on")?$(this).removeClass("highlight_on"):$(this).addClass("highlight_on");
                    $(this).removeClass("highlight_over");
                    ps01.captureScreenShot();
                }); 
                break;
            case "B":
                $(".highlight").click(function() { 
                    $(this).hasClass("highlight_on")?$(this).removeClass("highlight_on"):$(this).addClass("highlight_on");
                    $(this).removeClass("highlight_over");
                    if($(".drop_box span[data-id=" + $(this).data("id") + "]").remove().length === 0) {
                        $(".drop_box").append( $(this).clone().removeClass("highlight_on").addClass("highlight_drop_box") );
                    }
                    ps01.captureScreenShot();
                });
                break;
            case "C":
                $(".highlight").draggable({
                    appendTo: "body", 
                    helper: "clone",
                    start:function(event, ui){
                        // Need to add a class to this to set styling
                        var clone = $(ui.helper);
                        clone.css("width", $(this).css("width"));
                        clone.css("font-family", $(this).css("font-family"));
                        clone.css("font-size", $(this).css("font-size"));
                        clone.css("color", $(this).css("color"));
                        $(this).removeClass("highlight_on");
                    },
                    stop: function() {
                        ps01.captureScreenShot();
                    }
                });
                $(".drop_box").droppable({
                    accept: ".highlight",
                    drop:function(event, ui){ 
                        ui.draggable.addClass("highlight_on");
                        ui.draggable.draggable("disable");
                        if(!$(".drop_box span[data-id=" + $(ui.draggable).data("id") + "]").length) {
                            $(".drop_box").append(ui.draggable.clone().removeClass("highlight_on").addClass("highlight_drop_box"));
                        }
                    }
                });
                break;
            default:
                break;
        }
        
        $("#submitButton").click(function() {
            alert(GradeCogneroQuestion(ps01.getState(),1) ? "Pass":"Fail");
        });
        
        $("#clearButton").click(function() {
            ps01.clear();
        }); 
        if(typeof HTML5RiaAPI !== "undefined") {
            var state = cogAPI.getQuestionState();
            if(state)
                ps01.setState(state);
        }
        MathJax.Callback.Queue([ps01.captureScreenShot]);
    },
    getCanvas: function () {
        if (ps01.ssCanvas !== null) 
            return ps01.ssCanvas.toDataURL();
        return $("<canvas/>")[0].toDataURL();
    },
    captureScreenShot: function () {
        if (typeof(html2canvas) != "undefined") {
            var s = $(".content").clone(true,true);
            $(".content_box span[class=txt]",s).children().append("<div><br></div>");
            s.css({position:"absolute",top:"2000px"});
            $(".notHighlightable",s).remove();
            s[0].id = "wrapper2remove";
            $("#wrapper").css("overflow-y","visible");
            s.insertAfter("#wrapper");
            $("#wrapper2remove #content_box_set").css({"max-height":"","overflow":"visible","height":"460px","width":"633px"});
            html2canvas(document.getElementById("wrapper2remove"), {
                onrendered: function(canvas) {
                    ps01.ssCanvas = canvas;
                    $("#wrapper2remove").remove();
                    $("#wrapper").css("overflow-y","hidden");
                }
            });
        }
    }
};

