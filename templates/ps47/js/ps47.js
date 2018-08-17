function ps47() {    
    this.DEBUG = false;
    
    this.id;
    this.paper= null;
    this.papers= null;
    this._axis= null;
    this._opt= null;
    this._states=null;
    this._ticks=null;
    this._sectionColors=null;
    this.latestState=null;
    this.latestSection=null;
    this.font_size= 0;
    this.palette = {};
    
    //creates the SVG canvas (runs only once per object)
    this.createCanvas = function (index){
        this.log("Creating Canvas:"+ index)
        this.id = index;
        this.paper = new Raphael($("#canvas"+index)[0],$("#canvas"+index).width(),$("#canvas"+index).height());
        this.papers = this.papers || [];
        this.papers.push(this.paper);
        this._axis = this.paper.set();
        this._opt = {};
        this._states = [];
        this._sectionColors=[];
    };

    //Draws the numberline, then calls ticks/labels
    this.numberLine = function() {
        this.palette["hl"] = this._opt.hlColor;
        this.palette["lc"] = this._opt.lineColor;
        this.palette["tc"] = this._opt.ticks_color;
        this.palette["nc"] = this._opt.ticks_labelColor;
        var length = (this._opt.lineLength) + ((this._opt.lineLength / this.ticks_vals.length)) - 25;
        var startX = 10;
        var y = 15;
        if (this._axis.length == 0 && this.ticks_vals !== undefined) {
            for (i = 0; i < this.ticks_vals.length - 1; i++) {
                var l = this.paper.path("M{0} {2},L{1} {2}".format(
                            startX + i * (length / this.ticks_vals.length),
                            startX + (i + 1) * (length / this.ticks_vals.length),y));
                var clickRect = this.paper.rect(
                        startX + i * (length / this.ticks_vals.length),y - 8,
                        (length / this.ticks_vals.length),16 );
                clickRect.attr({"cursor":"pointer","stroke-opacity":0.0,"fill":"black","fill-opacity":0.0});
                var self1 = this;
                clickRect.node.onclick = function () {
                    var self = self1;
                    var index = i;
                    return function() {
                        self._sectionColors[index] === "hl" ?
                        self._sectionColors[index] = "lc" :
                        self._sectionColors[index] = "hl"
                        self.latestSection = index;
                        self.refresh();
                    };
                }();
                l.attr("stroke",this.palette[this._sectionColors[i]]);
                this._axis.push(l);
            }
            this._axis.attr({"stroke-width":4});
        }
        this.ticks(this._axis);
    };

    //Draw the ticks/arrows/circles
    this.ticks = function(line) {
        this._ticks = [];
        var numOfMajor = this.ticks_vals.length;
        var height = this._opt.ticks_height || 20;
        var width = this._opt.ticks_width || 5;
        for(i = 0; i < numOfMajor; i++) {
            var x = line[i] != undefined ? line[i].getBBox().x : line[i - 1].getBBox().x2;
            var y = line[i] != undefined ? line[i].getBBox().y : line[i - 1].getBBox().y2;
            var p =null;
            var clickWidth = width * 3;
            var clickX = x;
            switch(this._states[i]) {
                case "arrow":
                    if (i == 0) {
                        p = this.arrow(x,y,-8)
                        clickX-= 5;
                    } else if (i == numOfMajor - 1) {
                        p = this.arrow(x,y,8)
                    }
                    clickWidth += 5;
                    break;
                case "circle-filled":
                    p = this.paper.circle(x, y, this._opt.ticks_height / 2 * .9);
                    p.attr({"stroke-width":width,"stroke":this.palette["hl"],"fill":this.palette["hl"]});
                    clickX -= 2.5;
                    clickWidth += 5;
                    break;
                case "circle-open":
                    p = this.openCircle(x, y, 5);
                    clickX -= 2.5;
                    clickWidth += 5;
                    break;
                case "tick":
                    p = this.tick(x,height,width,i);
                    p.attr({"stroke":this.palette["tc"]});
                case "clear":
                default:
                    break;
            }
            this._ticks.push(p);
            if (this._states[i] !== "arrow" && this._states[i] != "clear") {
                var label = this.drawText(this.ticks_vals[i],x,line.getBBox().y2 + 10 + this._opt.ticks_height / 2);
            }
            var clickRect = this.paper.rect(clickX-this._opt.ticks_width * 3 / 2 ,line.getBBox().y - this._opt.ticks_height * 1.5 / 2,clickWidth,this._opt.ticks_height* 1.5);
            clickRect.attr({cursor:"pointer",fill:"black","fill-opacity":0.0,"stroke-opacity":0.0});
            var self1 = this;
            clickRect.node.onclick = function(){
                var index = i;
                var self = self1;
                return function() {
                    if (index == 0 || index == self.ticks_vals.length - 1) {
                        list_marks = "circle-filled,circle-open,tick,arrow".split(",");
                        if (self._states[self.latestState] && self._states[self.latestState].indexOf("circle") > -1 && self._states[index] == "arrow") {
                            var incrDecr = index == 0 ? 1 : -1;
                            var offset = index == 0 ? 0 : -1;
                            for (x = index; x != self.latestState + offset; x += incrDecr) {
                                self._sectionColors[x] = "hl";
                            }
                            self.latestState = index;
                            self.refresh();
                            self._ticks[index].attr({"stroke":self.palette["hl"],"fill":self.palette["hl"]});
                                
                            return;
                        }
                    } else {
                        list_marks = "circle-filled,circle-open,tick".split(",");
                    }
                    self._states[index] = list_marks[(list_marks.indexOf(self._states[index]) + 1 ) % (list_marks.length)]
                    self.latestState = index;
                    self.refresh();
                }
            }();
        }
    };
    
    //Draw Tick
    this.tick = function(x,height,width,i){
        var t = this.paper.rect(x - width / 2, 15 - height/2, width,height);
        t.attr({"fill":this.palette["tc"],"stroke-color":this.palette["tc"]});
        return t;
    };
    //Draw Open Circle
    this.openCircle = function (x,y,r) {
        var c = this.paper.circle(x,y,this._opt.ticks_height / 2 * .9 );
        c.attr({"stroke-width":4,"stroke":this.palette["hl"]});
        var c2 = this.paper.circle(x,y,this._opt.ticks_height / 2 * .7);
        c2.attr({"fill":"white","stroke":"white","stroke-width":2});
        return c;
    };
    //Draw Arrows
    this.arrow = function(x,y,z) {
        //var a = this.paper.path("M{0} {1},L{2} {3},L{2} {4} Z".format(x+z, y, x, y+5, y-5));
        var a = this.paper.path("M{0} {1},L{2} {3},L{4} {1},L{2} {5} Z".format(x, y, x - (z/2),y-5, x+z,y+5));
        var color = this.palette["tc"];
        if (this.isCompleteLine(z<0)) {
            color = this.palette["hl"];
        }
        a.attr({stroke:color,fill:color});
        return a;
    }
    //Non Fractions handled in else block, fractions are split up and drawn in drawFraction
    this.drawText = function(str,x,y){
        var text;
        if (str == undefined)
            return;
        if (str.indexOf("\/") > -1) {
            numb = numer = denom = "0";
            if (str.indexOf(" ") > -1) {
                numb = str.split(" ")[0];
                numer = str.split(" ")[1].split("\/")[0];
                denom = str.split(" ")[1].split("\/")[1];
            } else {
                numer = str.split("\/")[0];
                denom = str.split("\/")[1];
            }
            text = this.drawFraction(numb,numer,denom,x,y);
        } else {
            text = this.paper.text(x,y,str);
            text.attr("text-anchor","middle");
            text.attr("font-size", this.font_size+"px");
            text.attr("stroke", this.palette["nc"]);
            text.attr("fill", this.palette["nc"]);
            this.log(x,y,str);
        }
        return text;
    };
    //Draw out the fractions:
    //n: whole number to be put on the left of fraction
    //numer: numerator
    //denom: denominator 
    //x,y: position under the tick
    this.drawFraction = function(n, numer, denom,x,y) {
        var frac = this.paper.set()
        var nText = this.paper.text(x,y,n);
        nText.attr({"text-anchor":"middle","font-size":this.font_size+ "px","stroke":this.palette["nc"],"fill":this.palette["nc"]});
        var numIsLonger = numer.length > denom.length;
        var numText,denText;
        //this if/else is for centering the smaller (charlength) number
        if(numIsLonger) {
            denText = this.paper.text(nText.getBBox().x2+6, y + nText.getBBox().height * .6, denom);
            denText.attr({"font-size":this.font_size+ "px","stroke":this.palette["nc"],"text-anchor":"start"});
            numText = this.paper.text(nText.getBBox().x2 + 6 + denText.getBBox().width/2, y - nText.getBBox().height * .6, numer);
            numText.attr({"font-size":this.font_size+ "px","stroke":this.palette["nc"],"text-anchor":"middle"});
        } else {
            numText = this.paper.text(nText.getBBox().x2 + 6, y - nText.getBBox().height * .6, numer);
            numText.attr({"font-size":this.font_size+ "px","stroke":this.palette["nc"],"text-anchor":"start"});
            denText = this.paper.text(nText.getBBox().x2+6+numText.getBBox().width/2, y + nText.getBBox().height * .6, denom);
            denText.attr({"font-size":this.font_size+ "px","stroke":this.palette["nc"],"text-anchor":"middle"});
        }
        //Draw the horizontal line for fraction
        var div = this.paper.path("M{0} {1},L{2} {1}".format(
            nText.getBBox().x2+3,
            y,
            Math.max(numText.getBBox().x2, denText.getBBox().x2) + 3
        ));
        div.attr({"font-size":this.font_size+ "px","stroke":this.palette["nc"]});
        frac.push(nText,numText,denText,div);
        frac.translate(-frac.getBBox().width/3,frac.getBBox().height/2 - 10);
        if (n === "0") {
            nText.attr({"stroke-opacity":0.0,"fill-opacity":0.0});
            frac.translate(-6,0);
        }
        return frac;
    };
    //Refresh the line from scratch
    //opt: options for drawing the line(optional)
    //       if not supplied the current options will be re-used
    this.refresh = function(opt){
        this._axis = this.paper.set();
        this._opt = opt || this._opt || {};
        this.ticks_vals = this._opt.ticks_vals.split(",");
        if (this._states.length === 0) {
            for (i = 0; i < this.ticks_vals.length; i++) {
                this._states[i] = "tick";
                this._sectionColors[i] = "lc";
            }
            this._states[0] = this._opt.ticks_left;
            this._states[this.ticks_vals.length - 1] = this._opt.ticks_right;
        }
        this.font_size = (this._opt.font_size * 3) + this._opt.ticks_labelSize;
        this.paper.clear();
        this.numberLine();
        screenShot();
    };
    this.isCompleteLine = function(isLeftArrow) {
        var i;
        if (isLeftArrow) {
            for (i = 0; i < this._axis.length; i++) {
                if (i > 0 && this._states[i] != "tick") break;
                if (this._sectionColors[i] != "hl") {
                    return false;
                }
            }
            return this._states[i] !== "tick";
        } else {
            for (i = this._axis.length - 1; i >= 0; i--) {
                if (this._sectionColors[i] != "hl") {
                    return false;
                }
                if (this._states[i] != "tick") break;
            }
            return this._states[0] !== "tick";
        }
        return true;
    };
    this.log = function() {
        if (this.DEBUG && window.console && window.console.log) {
            console.log(arguments);
        }
    };
}
var nlLoaded = false;
function screenShot(){
    if (!nlLoaded || pageName && pageName[1] === "builder.php") return;
    var nls =  $(".numberline_object");
    $.each(nls, function(i) {
        var svg = $(nls[i]).html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
        //console.log(svg);
        if ($("#"+nls[i].id+"can").length == 0) {
            $(".content").append("<canvas class='canvg' id='"+nls[i].id+"can' style='z-index:-1;" + $(nls[i]).attr("style") + ";'></canvas>");
        }
        canvg(nls[i].id+"can", svg, {renderCallback: savePart, ignoreMouse:true, ignoreAnimation: true});
    });
}
var completedParts = 0;
function savePart(){
    completedParts++;
    if (completedParts == $(".numberline_object").length) {
        takeFullPic();
        completedParts = 0;
    }
}
function takeFullPic() {
    $(".numberline_object").hide();
    html2canvas(document.getElementById("wrapper"),{
        onrendered: function(canvas){
            window.ssCanvas = canvas;
            $(".numberline_object").show();
        }
    });
}
function getState() {
    var nls = page_builder_app.numberlines;
    var stateArr = [];
    for (var i = 0; i < nls.length; i++) {
        stateArr.push(nls[i].id+":"+nls[i]._states.join(",") + "/" + nls[i]._sectionColors.join(","));
    }
    return stateArr.join("|");
}
window.ssCanvas = null;
function getScreenShot() {
    if (window.ssCanvas != null) {
        return window.ssCanvas.toDataURL();
    }
    return $("<canvas/>")[0].toDataURL();
}
function setState(s) {
    var self = page_builder_app;
    var state = parseState(s);
    window.nlLoaded = false;
    for (var i = 0; i < self.numberlines.length; i++) {
        for (var j = 0; j < self.numberlines[i]._states.length; j++) {
            self.numberlines[i]._states[j] = state[i].symbols[j];
        }
        for (var j = 0; j < self.numberlines[i]._sectionColors.length; j++) {
            self.numberlines[i]._sectionColors[j] = state[i].sections[j];
        }
        self.numberlines[i].refresh();
    }
    window.nlLoaded = true;
}
function parseState(s) {
    var lines = s.split("|");
    var state = [];
    for (var i = 0; i < lines.length;i++) {
        var pieces = lines[i].split(":");
        var pieces2 = pieces[1].split("/");
        state[pieces[0]] = {"symbols":pieces2[0].split(","),"sections":pieces2[1].split(",")};
    }
    return state;
}
