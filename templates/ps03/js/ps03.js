var console_on = false;
var ps03 = {
    stage: null,
    layer: null,
    currentlyOpen: null,
    inputs: [],
    keypadDivs: [],
    dropArrows: {},
    rectangles: [],
    clickableAreas: [],
    canvasImages: [],
    displayTexts: [],

    //Run the one-time builds needed to start the application.
    onReady : function() {
        console_on && console.log("onReady");
        var container = $("<div id='KineticCanvas'/>");
        container.css($("#wrapper").css(["top", "right", "position", "width", "height"])).css("z-index", "10").insertAfter("#wrapper");
        this.stage = new Kinetic.Stage({container: 'KineticCanvas', width:container.width(), height:container.height()});
        this.layer = new Kinetic.Layer();

        //Run conversion on each content/title div
        var divs = $(".content_box, .title");
        $.each(divs, function (index) {
            ps03.convert(divs[index]);
        });

        $(this.stage.getContent()).on("mousemove", function(evt){
            if ($(evt.currentTarget).hasClass("kineticjs-content")) {
                var clickedX = evt.pageX - $(evt.currentTarget).offset().left
                var clickedY = evt.pageY - $(evt.currentTarget).offset().top;
                for (var i = 0; i < ps03.clickableAreas.length; i++) {
                    if (clickedX > ps03.clickableAreas[i].left && clickedX < ps03.clickableAreas[i].right && clickedY > ps03.clickableAreas[i].top && clickedY < ps03.clickableAreas[i].bottom) {
                        document.body.style.cursor = 'pointer';
                        return;
                    }
                } 
            }
            document.body.style.cursor = 'default';
        });
        //Set up stage-wide click to hide keyboard/end input method.
        $(this.stage.getContent()).on("click", function(evt){
            console_on && console.log("clicked in rect");
            if ($(evt.currentTarget).hasClass("kineticjs-content")) {
                var clickedX = evt.pageX - $(evt.currentTarget).offset().left
                var clickedY = evt.pageY - $(evt.currentTarget).offset().top;
                for (var i = 0; i < ps03.clickableAreas.length; i++) {
                    if (clickedX > ps03.clickableAreas[i].left && clickedX < ps03.clickableAreas[i].right && clickedY > ps03.clickableAreas[i].top && clickedY < ps03.clickableAreas[i].bottom) {
                        hidekeyboardAndLayer2();
                        ps03.showInput(i);
                    }
                } 
            }
        });


        /* BEGIN Edit
            Added 1/27/2014 - 
            JIRA-tkt: CDIB-266, CEDPLT-4619
            Added by Jon Robinson CDI Seattle <jon.robinson@mheducation.com>. 
            Code solution by Stephen Gorisch <stephen_gorisch@madeirastation.com> of Medeira Station with a tweak from Jon

            Notes (Stephen):  The fundamental difference between the "click" above, 
                and "touchend"(changed to 'touchstart' after iOS 7 would not cooperate) 
                handlers here can be found when defining the "clickedX" and "clickedY" vars. 
                A "touch" event in and of itself does not have "pageX/Y", "screenX/Y", 
                or "clientX/Y" attributes, so you have to dig into one of the other attributes to find it. 
                The cleanest seemed to be "event.originalEvent.pageX/Y", 
                so instead of using "evt.pageX" and "evt.pageY" to determine the touch coordinates, 
                this digs 1 level deeper using the "originalEvent" attrib of the touch event. 
            Notes (Jon): The 'touchend' event was probably failing on iOS 7 due to a 'touchcancel' event 
                firing automatically after other touch events. 'touchstart' is the first event in the queue, 
                and thus avoids that dilemma.
        */
        
        //Set up stage-wide 'touchstart' event handler, to hide keyboard/end input method.
        $(this.stage.getContent()).on("touchstart", function(evt){            
            if ($(evt.currentTarget).hasClass("kineticjs-content")) {
                var clickedX = evt.originalEvent.pageX - $(evt.currentTarget).offset().left
                var clickedY = evt.originalEvent.pageY - $(evt.currentTarget).offset().top;
                for (var i = 0; i < ps03.clickableAreas.length; i++) {
                    if (clickedX > ps03.clickableAreas[i].left && clickedX < ps03.clickableAreas[i].right && clickedY > ps03.clickableAreas[i].top && clickedY < ps03.clickableAreas[i].bottom) {
                        hidekeyboardAndLayer2();
                        ps03.showInput(i);
                    }
                } 
            }
        });


        /* END Edit */


        //set up cognero api methods/restore from state if available.
		if(typeof HTML5RiaAPI !== "undefined") {
            var cogAPI = HTML5RiaAPI.getInstance();
            cogAPI.setQuestionStateGetFromAPPFunction(ps03.getState);
            cogAPI.setCaptureImageFromAPPFunction(ps03.getCanvas);
            var previousState = cogAPI.getQuestionState();
            if (!!previousState) {
                ps03.setState(previousState);
            }
        }
    },

    //Convert any image into the canvas from image src, div with position() and passed in width/height.
    convertImage : function(imgSource, div, width, height) {
        console_on && console.log("convertImage", div);
        var imageObj = new Image();
        imageObj.onload = function() {
            var newImg = new Kinetic.Image(
                {x:$(div).position().left, y:$(div).position().top, width:width, height:height, image: imageObj}
            );
            ps03.layer.add(newImg);
            $(div).remove();
            newImg.moveToBottom();
            ps03.layer.draw();
        }
        imageObj.src = imgSource;
    },
    
    //convert the page to canvas/build out the inputs and functionality.
    convert : function(div) {
        console_on && console.log("convert", div);
        var span = $(div).find("span");
        var text = span.html();
        if (typeof text == "undefined") {
            var img = $(div).find("img");
            if (img.length == 1) {
                ps03.convertImage(img[0].src, div, img.width(), img.height());
                return;
            }
        }
        //not an input, make it a picture through html2canvas
        if (!text.match(/##.+?##/ig)) {
            $(div).css("color", "black");
            html2canvas(div, {onrendered: function(canvas){ps03.convertImage(canvas.toDataURL(), div, canvas.width, canvas.height);}});
            return;
        }

        //find all ##data## tags and build out appropriate inputs (function portion) we then replace the ##data## with 
        //  /|v|_____|v|/ with variable amounts of underscores to allow for width control later on during (visual portion)
        text = text.replace(/##(.*?)##/g, function(context, match) {
            console_on && console.log(text[match]);
            var s = match.split(":::");
            var choices = s[0].split("||");
            var keypad = s[1];
            var charLimit = parseInt(s[2]);
            var type = s[3];
            var widthModifier = 7;
            if (choices.length > 1) {
                ps03.buildDropDown(choices, type, span);
                widthModifier += 3;
            } else {
                ps03.buildInput(charLimit, keypad, type, span);
            }
            if (s[2].match(/px/)) {
                return " |v|__" +s[2]+ "__|v| ";
            }
            return " |v|__" + (charLimit+widthModifier) + "__|v| ";
        });

        //Break up the words into array
        var texts = text.split(" ");

        //Calulate space width for text input
        var spaceWidth = new Kinetic.Text({
            "text": " ",
            fontSize: span.css("font-size").replace(/[^0-9\.]/g, ""),
            fontFamily: span.css("font-family")
        }).getTextWidth();

        //Calulate starting x and y for inputting text.
        var offsetX = $(div).position().left, offsetY = $(div).position().top + 2;
        var hasStyleWidth = $("#"+div.id+"[style*=width]").width();
        var spanWidth = $(div).width() + offsetX;
        if (hasStyleWidth == undefined) {
            spanWidth = ps03.stage.width();
        }

        //Loop through words and input them to canvas one at a time, if /|v|__[0-9]p?x?__|v|/ is found. create a new input field (visual portion) at 
        // the now calculated positioning with before "calculated" underscore width.
        $.each(texts, function(index) {
            if (texts[index].length == 0) return;
            var simpleText = new Kinetic.Text({
                "text": texts[index],
                fontSize: span.css("font-size").replace(/[^0-9\.]/g, ""),
                fontFamily: span.css("font-family"),
                fill: 'black',
            });
            var tWidth = simpleText.getTextWidth();
            var tHeight = simpleText.getTextHeight();
            simpleText.x(offsetX);
            simpleText.y(offsetY);
            if (tWidth + offsetX > spanWidth) {
                offsetX = $(div).position().left;
                offsetY += tHeight + 10;
                simpleText.x(offsetX);
                simpleText.y(offsetY);
            }

            //create the visual portion of the input fields.
            if (texts[index].match(/^\|v\|__([0-9]+p?x?)__\|v\|$/)) {
                var m = texts[index].match(/^\|v\|__([0-9]+p?x?)__\|v\|$/);
                var id = ps03.rectangles.length;
                var charLen = m[1].match(/px/) ? 1 : parseInt(m[1]);
                simpleText.setText(new Array(charLen).join("_"));
                var inputTextWidth = simpleText.getTextWidth();
                var inputWidth = Math.max(parseInt(m[1],10), inputTextWidth);
                var rect = new Kinetic.Rect({
                    x: offsetX ,
                    y: offsetY - 7,
                    width: inputWidth,
                    height: tHeight + 14,
                    stroke: "black",
                    strokeWidth: 2,
                    cornerRadius: 4
                });
                var borderless= true;
                ps03.clickableAreas.push({
                   top:rect.y(),
                   left:rect.x(),
                   bottom:rect.y()+rect.height(),
                   right:rect.x() + rect.width()}
                );
                var img = new Kinetic.Image({x:rect.x()+1, y:rect.y()+1, width:rect.width(), height:rect.height()});
                if (ps03.inputs[id][0].type == "text" ) { 
                    var ids= ps03.keypadDivs[id].attr("data-orig").split(":")[1].split(",");
                    for (var i = 0; i < ids.length; i++) {
                        if (JSONObject.type_object[parseInt(ids[i]) - 1].has_border != "false") {
                            borderless = false;
                            break;
                        }
                    }
                } else {
                    img.setHeight(img.height() - 4);
                    img.setWidth(img.width() -2);
                    var ids = ps03.inputs[id].attr("data-orig").split(":")[1].split(",");
                    for (var i = 0; i < ids.length; i++) {
                        if (JSONObject.select_object[parseInt(ids[i]) - 1].has_border != "false") {
                            borderless = false;
                            break;
                        }
                    }
                }
                if (borderless) {
                    rect.setX(-1000);
                    rect.setY(-1000);
                } else {
                    if (JSONObject.shadows === "true") {
                        rect.setFill("white");
                        rect.setShadowColor('black');
                        rect.setShadowBlur(2);
                        rect.setShadowOffset({x:4, y:4}),
                        rect.setShadowOpacity(0.5);
                    }
                }
                ps03.keypadDivs[id].css("line-height", (tHeight+12)+"px");
                var divID = $(div).data("id");
                simpleText.setText(" ");
                simpleText.setWidth(inputWidth - 4);
                tWidth = inputWidth + 2;
                simpleText.setAlign("center");
                ps03.canvasImages.push(img);
                ps03.rectangles.push(rect);
                
                ps03.displayTexts.push(simpleText);
                ps03.layer.add(img);
                ps03.layer.add(rect);
                if (ps03.inputs[id][0].type == "select-one") {
                    ps03.inputs[id].css("width", rect.width());
                    ps03.addDropBoxArrows(id);
                }
            }
            ps03.layer.add(simpleText);
            offsetX += tWidth + spaceWidth;
        });
        $(span).remove();
        this.stage.add(ps03.layer);
    },

    //Builds out an html select/option style drop down box
    buildDropDown: function(choices, orig, span) {
        console_on && console.log("buildDropDown");
        var s = $("<select/>");
        var id = ps03.inputs.length;
        var ids = orig.split(":")[1].split(",");

        if (JSONObject.use_keypad == "false")
            s.append($("<option>", {value:" "}).text(""));
        $.each(choices, function(key, value) {
            s.append($("<option>", {value:ids[key]}).html(value+"   "));
        });
        s.css(span.css(["font-family", "font-size"]));
        s.attr("data-orig", orig);
        s[0].id = "myInput"+id;
        s.hide();
        $("#content_box_set").append(s);
        s.on("change", function(){ps03.hideInput(id);});
        ps03.inputs.push(s);
        ps03.keypadDivs.push(s);
    },

    //Adds up down arrows to the fancy drop down box.
    addDropBoxArrows: function(id) {
        var arrows = new Kinetic.Shape({
            sceneFunc: function(context) {
              context.beginPath();
              context.moveTo(10, 20);
              context.lineTo(20, 20);
              context.lineTo(15, 28);
              context.closePath();
              context.fillStrokeShape(this);
              context.beginPath();
              context.moveTo(10, 15);
              context.lineTo(20, 15);
              context.lineTo(15, 7);
              context.closePath();
              context.fillStrokeShape(this);
            },
            fill: '#00bdec',
            stroke: 'black',
            strokeWidth: 1,
        });
        ps03.layer.add(arrows);
        arrows.x(ps03.clickableAreas[id].left + ps03.rectangles[id].width() - 24);
        arrows.y(ps03.clickableAreas[id].top - 2);
        ps03.dropArrows[id] = arrows;
    },
    buildInput: function(len, keypad, orig) {
        console_on && console.log("buildInput");
        var id = ps03.inputs.length;
        var inp = $("<input maxlength='"+(len)+"'size='"+(Math.ceil(len * 1.5))+"' id='myInput"+id+"'/>");
        $("#content_box_set").append(inp);
        inp.hide();
        var divName = "keyboardInputDiv" + id;
        var div = $("<div class='keyboardDiv' id='"+divName+"' data-charlimit='"+len+"' data-keypad='"+keypad+"'/>");
        $("#content_box_set").append(div);
        div.hide();
        div.attr("data-orig", orig);
        ps03.inputs.push(inp);
        ps03.keypadDivs.push(div);
    },
    hideInput: function(id) {
        if (id == null )
            return;
        console_on && console.log("hideInput", id, ps03.inputs[id][0].type);
        var value = "";
        //regular input mode
        if (JSONObject.use_keypad == "false" ) {
            if (ps03.inputs[id][0].type == "text") {
                value = ps03.inputs[id][0].value;
            } else {
                value = ps03.inputs[id].find(":checked").text();
            }
            ps03.inputs[id].hide();
        } else { //keypad input mode
            //keypads
            if (ps03.inputs[id][0].type == "text") {
                var html = ps03.keypadDivs[id].html();
                if (html.match(/mathjax/i)|| html.match(/\\\(.*\\\)/g)) {
                    value = " ";
                    var divI = $("#keyboardInputDiv"+id); 
                    divI.css({color:"black", width:ps03.rectangles[id].width(), height:ps03.rectangles[id].height()+5});
                    if (html.match(/nobr/i)) {
                        html2canvas(divI[0], {onrendered:function(canvas){ps03.mergeCanvas(id, canvas);}});
                    } else {
                        console_on && console.log("looping to load fraction");
                        setTimeout(function(){ps03.hideInput(id);},100);
                        value= " ";
                    }
                } else {
                    value = convertEntities(html);
                    ps03.keypadDivs[id].hide();
                }
            } else {//drop down
                value = ps03.inputs[id][0].value;
                if (value.match(/mathjax/i)) {
                    var divI = ps03.keypadDivs[id].find(".on");
                    var css = divI.css(["width", "height", "border"]);
                    ps03.keypadDivs[id].show();
                    divI.removeClass("on");
                    divI.css({width:ps03.rectangles[id].width(), height:ps03.rectangles[id].height()-2, border:"none"});
                    html2canvas(divI[0], {onrendered:function(canvas){ps03.mergeDropDownCanvas(id, canvas, css, divI);}});
                    value = " ";
                }else {
                    value = $("<div/>").html(value).text();
                    ps03.keypadDivs[id].hide();
                }
            }
        }
        if (value == "") {
            value = " ";
        }
        console_on && console.log("|"+value+"|");
        ps03.displayTexts[id].setText(value);
        ps03.rectangles[id].show();
        if (ps03.inputs[id][0].type != "text") {
            ps03.dropArrows[id].show();
        }
        ps03.displayTexts[id].show();
        ps03.layer.draw();
        ps03.currentlyOpen = null;
    },

    //Show an input, hide any currently open
    showInput: function(id) {
        console_on && console.log("showInput", id, ps03.currentlyOpen);
        if (ps03.currentlyOpen != null) {
            hidekeyboardAndLayer2();
        }
        ps03.currentlyOpen = id;
        var inp = ps03.inputs[id];
        inp.css({
            "z-index":15,
            position:"absolute",
            top:ps03.displayTexts[id].y() - 7,
            left:ps03.displayTexts[id].x() - 4,
            "font-size":ps03.displayTexts[id].fontSize()+"px",
            "font-family":ps03.displayTexts[id].fontFamily()
        });
        ps03.keypadDivs[id].css(inp.css(["font-family"]));
        ps03.rectangles[id].hide();
        ps03.displayTexts[id].hide();
        ps03.canvasImages[id].hide();
        if (ps03.inputs[id][0].type != "text") {
            ps03.dropArrows[id].hide();
        }
        ps03.layer.draw();
        if (JSONObject.use_keypad == "false" ) {
            inp.show();
            inp.focus();
        } else {
            ps03.showDivInput(id);
        }
    },

    //Clear out answers and reset to blank on displays/keypads/inputs
    clearInputs: function() {
        console_on && console.log("clearInputs");
        $.each(ps03.inputs, function(index) {
            if (ps03.inputs[index].type != "text") {
                $(ps03.inputs[index]).val([]);
            } else {
                ps03.inputs[index].value = "";
            }
            if (ps03.keypadDivs[index][0].className == "keyboardDiv") {
                ps03.keypadDivs[index][0].innerHTML = "";
                ps03.keypadDivs[index].attr("data-htmlarray", "[]");
                ps03.keypadDivs[index].attr("data-output", "");
            }
            if (ps03.keypadDivs[index][0].type == "hidden") {
                $("[name=Bin"+ps03.keypadDivs[index][0].name).hide();
            }
            ps03.canvasImages[index].hide();
            ps03.hideInput(index);
        });
        hidekeyboardAndLayer2();
        $(".dropbtn").removeClass("on");
    },

    //Present the input-able div to the user, bring up the keypad if a text field else show the built drop down else build the drop down.
    showDivInput: function(id) {
        console_on && console.log("showDivInput", id, ps03.inputs[id][0].type);
        if (ps03.inputs[id][0].type == "text") {
            clickedTextField(ps03.keypadDivs[id][0].id);
            ps03.keypadDivs[id].css({
                "color":"black",
                "z-index":15,
                position:"absolute",
                top:ps03.clickableAreas[id].top - 2,
                left:ps03.clickableAreas[id].left - 3,
                "font-size":ps03.displayTexts[id].fontSize()+"px",
                "font-family":ps03.inputs[id].css("font-family"),
                width: ps03.rectangles[id].width(),
                height: ps03.rectangles[id].height()
            });
            ps03.keypadDivs[id].show();
        } else if (ps03.inputs[id][0].type == "hidden") {
            $("#Bin"+ps03.inputs[id][0].name).show();
        } else if (ps03.inputs[id][0].type == "select-one") {
            ps03.buildFancyDropDown(id);
        }
    },

    //Re-appply styles to drop down post html2canva render to allow for selected item to be a different color.
    mergeDropDownCanvas: function(id, canvas, css, divI) {
        divI.css(css);
        divI.addClass("on");
        
        ps03.mergeCanvas(id, canvas);
    },

    //Used to merge an input field with its correct location upon finishing typing or clicking dropDown,
    // specifically needed because of mathJax rendering.
    mergeCanvas: function(id, canvas) {
        console_on && console.log("mergeCanvas", id, canvas.toDataURL());
        ps03.keypadDivs[id].hide();
        var imageObj = $("<img/>");
        imageObj[0].onload = function () {
            ps03.canvasImages[id].setImage(imageObj[0]);
            ps03.canvasImages[id].show();
            ps03.canvasImages[id].moveToTop();
            if (ps03.inputs[id][0].type != "text") {
                ps03.dropArrows[id].moveToTop();
            }
            ps03.layer.draw();
        };
        imageObj[0].src = canvas.toDataURL();
    },

    //Create the dropdown divs, executed once per dropDown on their first click.
    buildFancyDropDown: function(id) {
        console_on && console.log("buildFancyDropDown");
        var sel = ps03.inputs[id];
        var selectName = sel.attr('id');

        // add a hidden element with the same name as the select
        var hidden = $('<input id="hide'+selectName+'"type="hidden" name="'+selectName+'">');
        var buttonBin = $("<div id='Bin"+selectName+"' class='dropDownBin'/>");
        buttonBin.css(sel.css(["top", "left", "position"])).css({"min-width":(ps03.rectangles[id].width()+8)+"px"});
        buttonBin.css({"font-family":ps03.displayTexts[id].fontFamily(), "font-size":ps03.displayTexts[id].fontSize()});
        hidden.attr("data-orig", sel.attr("data-orig"));
        hidden.insertAfter(sel);
        buttonBin.insertAfter(sel);
        
        $("option", sel).unwrap().each(function() {
            var btn = $('<div class="dropbtn" data-val="'+$(this).val()+'"></div>');
            btn.css({width:(buttonBin.width() - 16) + "px",
                    height:(ps03.rectangles[id].height() - 2)+"px",
                    "line-height":(ps03.rectangles[id].height()) + "px"});
            btn.html(JSONObject.select_object[$(this).val() - 1].text);
            buttonBin.append(btn);
            $(this).remove();
        });
        MathJax.Hub.Typeset(buttonBin[0]);
        buttonBin.css({height:(($(".dropbtn").height() + 10) * buttonBin.children().length)});
        
        $(document).on('click', '#Bin'+selectName+' .dropbtn', function() {
            $('#Bin'+selectName+' .dropbtn').removeClass('on');
            $(this).addClass('on');
            $('#hide'+selectName).val($(this).html());
            $('#Bin'+selectName).hide();
            ps03.hideInput(id);
        });
        if(buttonBin.position().top+buttonBin.height() > ps03.stage.height() ) {
            buttonBin.css("top", (buttonBin.position().top - buttonBin.height() + $(".dropbtn").height() ) + "px");
        }
        ps03.keypadDivs[id] = buttonBin;
        ps03.inputs[id] = hidden;
    },

    //Get the state of each of the answer boxes, stringify it a bit to allow for passing through cognero.
    getState: function () {
        console_on && console.log("getState");
        var s = [];
        $.each(ps03.inputs, function(i) {
            if (JSONObject.use_keypad == "true") {
                if (ps03.inputs[i][0].type == "hidden" || ps03.inputs[i][0].type == "select-one") {
                    if (ps03.inputs[i][0].type == "select-one") {
                        s.push(ps03.inputs[i].attr("data-orig")+"::");
                    } else {
                        var val = ps03.keypadDivs[i].find(".on").attr("data-val");
                        s.push(ps03.inputs[i].attr("data-orig")+"::"+(val||""));
                    }
                } else {
                    s.push(ps03.keypadDivs[i].attr("data-orig")+"::"+(ps03.keypadDivs[i].attr("data-htmlarray")||"[]"));
                }
            } else {
                if (ps03.inputs[i][0].type == "text") {
                    s.push(ps03.keypadDivs[i].attr("data-orig")+"::["+(ps03.inputs[i][0].value)+"]");
                } else {
                    s.push(ps03.keypadDivs[i].attr("data-orig")+"::"+ps03.inputs[i][0].value || "");
                }
            }
        });
        return {state:s.join("||")};
    },

    //Resets the state from state object obtained from ps03.getState(), used for returning students in cognero
    setState: function(state) {
        var states = state.state.split("||");
        for (var i = 0; i < states.length;i++) {
            var pieces = states[i].split("::");
            var answer = pieces[1];
            var type = pieces[0].split(":")[0];
            if (type == "s") {
                if (answer != "") {
                    if (JSONObject.use_keypad) {
                        ps03.showInput(i);
                        $("BinmyInput"+i).hide();
                        var divs = ps03.keypadDivs[i].find("div");
                        ps03.keypadDivs[i].find("div[data-val="+answer+"]").click();
                    } else {
                        ps03.inputs[i][0].value = answer;
                        ps03.showInput(i);
                    }
                }
            }
            if (type == "t") {
                ps03.keypadDivs[i].attr("data-htmlarray", answer);
                ps03.inputs[i][0].value = answer;
                if (JSONObject.use_keypad == "true") {
                    ps03.showInput(i);
                }
            }
        }
        hidekeyboardAndLayer2();
    },
    getCanvas: function() {
        return ps03.layer.getCanvas().toDataURL();
    }
};
function convertEntities(html) {
    console_on && console.log("convertEntities");
    if (html == undefined || html == "")
        return "";
    var el = document.createElement("div");
    el.innerHTML = html;
    return el.firstChild.data;
}
