

var ps10 = {

	// Configuration Params
	numSides: null,
	numPoints: null,
	sideLength: null,
	area: null,
	perimeter: null,

	// constants
	blocksize: 50, //size of each individual block
	pointSize: 5,
	pointColor: 'black',
	lineColor: 'red',
	MODE_DRAG: false,
	dimension: 400,
	scale: 15,

	// A point is {x:o,y:0}
	points: [],
	resetPoints: [],
	shapeComplete: false,

	paper: null,

	stage: null,
	drawLayer: null,

	getState: function() {
		console.log("ps10.getState");
		var out = $.extend(true, {}, ps10.answerData);

		// get display data
		out.coordinate_object_data_reset = ps10.getDisplayDataString(ps10.resetPoints);
		out.coordinate_object_data = ps10.getDisplayDataString(ps10.points);
		out.blocksize = ps10.blocksize;

		// console.log(out);
		// console.log(ps10.getScreenShot());

		return out;
	},

	setState: function(value) {
		console.log("ps10.setState");
		ps10.answerData = value;
		if (ps10.answerData.coordinate_object_data.length) {
			ps10.points = ps10.parseDisplayData(ps10.answerData.coordinate_object_data);

			// get reset data
			if(!ps10.answerData.coordinate_object_data_reset) {
				ps10.resetPoints = $.extend(true, [], ps10.points);
			} else {
				ps10.resetPoints = ps10.parseDisplayData(ps10.answerData.coordinate_object_data_reset);
			}
		}
	},

	init: function(data, addSubmit) {
		console.log("ps10.init");
		var self = this;
		
		// get block size
		ps10.blocksize = Math.round(ps10.dimension/ps10.scale);

		// get dimensions
		ps10.dimension = ps10.blocksize * ps10.scale;

		// set state from data
		if (data) {
			ps10.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps10.getState);
      cogAPI.setCaptureImageFromAPPFunction(ps10.getScreenShot);

			var state = cogAPI.getQuestionState();
			if (state) ps10.setState(state);
		}

		ps10.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		ps10.stage.on("contentMouseup contentTouchend", function(event) {
			self.handleCLick(event);
		});

		ps10.drawLayer = new Kinetic.Layer();
		ps10.stage.add(ps10.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				var tmp = GradeCogneroQuestion(ps10.getState(), 1);
				alert(tmp?"Pass":"Fail");
			});
		}

		$("#resetButton").click(function() {
			ps10.reset();
		});
		
		ps10.draw();

		ps10.renderGrid();

	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	getDisplayDataString: function(points) {
		var displayString = ""; 

		// add points
		for (var i = 0; i < points.length; i++) {
			displayString += ps10.getCoordsFromXY(points[i]);

			if (i !== points.length - 1) displayString += ":";
		};

		return displayString;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseDisplayData: function(data) {
		var points = [];
		var allPoints = data.split(':');

		for (var i = 0; i < allPoints.length; i++) {
			points.push(ps10.getXYFromCoords(allPoints[i]));
		};

		return points;
	},

	reset: function() {
		// console.log("reset");
		ps10.points = $.extend(true, [], ps10.resetPoints);
		ps10.shapeComplete = false;
		ps10.draw();
	},

	handleCLick: function(event) {
		console.log("ps10.handleClick : " + ps10.mode);
		console.log(event);

		if (!ps10.shapeComplete && !ps10.MODE_DRAG) {
			var relX = Math.round(event.layerX);
			var relY = Math.round(event.layerY);
			var transX = Math.round(relX / ps10.blocksize); // - Math.sqrt(ps10.grid));
			var transY = Math.round(relY / ps10.blocksize); // - Math.sqrt(ps10.grid));

			//Conditional Statement to Check Nearest Click against existing Array 
			var currX = Math.round(transX) * ps10.blocksize;
			var currY = Math.round(transY) * ps10.blocksize;

			var chkXY = _.findWhere(ps10.points, {
				x: currX,
				y: currY
			});
			var point = {
				x: currX,
				y: currY
			};
			ps10.points.push(point);

			if (chkXY !== undefined) {
				// check if we've reached start point
				var index = _.indexOf(ps10.points, chkXY);

				if (index == 0) {
					// end shape
					ps10.shapeComplete = true;
				}
			}

			ps10.draw();
		}

	},

	draw: function() {
		var self = this;

		ps10.drawLayer.destroyChildren();
		ps10.drawLayer.clear();

		// add line
		var points = [];

		// create points array
		for (var i = 0; i < ps10.points.length; i++) {
			points.push(ps10.points[i].x);
			points.push(ps10.points[i].y);
		}

		// create line and group
		var currentLine = new Kinetic.Line({
			points: points,
			stroke: ps10.lineColor,
			strokeWidth: 3,
			opacity: 1,
			tension: 0,
			lineCap: "butt"
		});

		var currentGroup = new Kinetic.Group({
			x: 0,
			y: 0
		});

		currentGroup.add(currentLine);

		// add points
		var iteration = (_.isEqual(ps10.points[0], ps10.points[ps10.points.length-1]) && ps10.points.length !== 1) ? ps10.points.length-1 : ps10.points.length;
		for (var i = 0; i < iteration; i++) {

			var point = new Kinetic.Circle({
				x: ps10.points[i].x,
				y: ps10.points[i].y,
				radius: ps10.pointSize,
				fill: ps10.pointColor,
				stroke: ps10.pointColor,
				strokeWidth: 1,
				id: i,
				draggable: true
			});

			// Need to be able to move points
			point.on("dragstart", function(event) {
				self.linePointDragStart(event);
			});

			point.on("dragend", function(event) {
				self.linePointDragEnd(event);
			});

			currentGroup.add(point);

		};

		ps10.drawLayer.add(currentGroup);

		ps10.drawLayer.draw();

	},

	removePoint: function(point) {
		ps10.points.splice(_.indexOf(ps10.points, point), 1);
	},

	removeLine: function(line) {
		ps10.points.splice(_.indexOf(ps10.points, line), 1);
	},

	// Drag Functions
	linePointDragStart: function(event) {
		console.log("ps10.linePointDragStart");
		ps10.MODE_DRAG = true;
	},

	linePointDragEnd: function(event) {
		console.log("ps10.linePointDragEnd");

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var relX = Math.round(event.layerX);
			var relY = Math.round(event.layerY);
			var transX = Math.round(relX / ps10.blocksize);
			var transY = Math.round(relY / ps10.blocksize);
			var currX = transX * ps10.blocksize;
			var currY = transY * ps10.blocksize;

			// update point
			var origPoint = $.extend(true, {}, ps10.points[event.targetNode.id()]);
			ps10.points[event.targetNode.id()].x = currX;
			ps10.points[event.targetNode.id()].y = currY;

			// update other point if this is an end point
			if (event.targetNode.id() === 0 && _.isEqual(origPoint, ps10.points[ps10.points.length-1])) {
				ps10.points[ps10.points.length-1].x = currX;
				ps10.points[ps10.points.length-1].y = currY;
			} else if (event.targetNode.id() === ps10.points.length-1 && _.isEqual(origPoint, ps10.points[0])) {
				ps10.points[0].x = currX;
				ps10.points[0].y = currY;
			}
		}

		ps10.draw();
		ps10.MODE_DRAG = false;
	},

	getXYFromCoords: function(coords) {
		coords = coords.split(',');
		var point = {
			x: coords[0]*ps10.blocksize,
			y: coords[1]*ps10.blocksize
		}

		return point;
	},

	getCoordsFromXY: function(XY) {
		var coords = Math.round(XY.x / ps10.blocksize) + "," + Math.round(XY.y / ps10.blocksize);

		return coords;
	},

	getScreenShot: function() {
		// get kinetic canvas and add background
		$("#coordinate_object_set").parent().append("<canvas width='407' height='407' style='position:abosolute;left:0;top:0;'/>");
		var tempCanvas = $("#coordinate_object_set").parent().find("> canvas")[0].getContext("2d");
    tempCanvas.drawImage( ps10.ssCanvas, 0, 0);
    tempCanvas.drawImage( $("#coordinateGridCanvas canvas")[0], 0, 0);

    // Save to a data URL 
    var imgUrl = $("#coordinate_object_set").parent().find("> canvas")[0].toDataURL();
    $("#coordinate_object_set").parent().find("> canvas").remove();
    // console.log(imgUrl);

    return imgUrl;
	},

	renderGrid: function() {
		if (typeof(html2canvas) != "undefined") {
			// get image of background
			html2canvas($("#coordinateGrid > .q1")[0], {
				onrendered: function(canvas) {
					ps10.ssCanvas = canvas;
				}
			});
		}
	}

}
