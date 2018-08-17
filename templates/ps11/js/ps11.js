

var ps11 = {

	// Configuration Params
	blocksize_x: 40, //size of each individual block
	blocksize_y: 40, //size of each individual block
	dimension_x: 400,
	dimension_y: 400,
	label_x: "x",
	label_y: "y",
	scale_x: 5,
	scale_y: 5,
	type: "",
	vertFlip: 1,
	horzFlip: 1,

	pointSize: 5,
	pointColor: 'black',
	lineColor: 'red',
	equationIteration: 0.1,

	// A point is {x:o,y:0}
	points: [],
	resetPoints: [],
	resetConstants: [0,0,0],
	centerPoint: {},
	rotationAngle: 0,
	equationType: "",
	globalAngle: 0,
	isVertEquation: true,

	// Need to know whether we are in line or point mode
	mode: "Mode.DRAG",
	priorMode: null,
	MODE_DRAG: "Mode.DRAG",
	MODE_ROTATE: "Mode.ROTATE",

	stage: null,
	drawLayer: null,
	
	equations: {
		"x": {
			"Linear": function(x,a,b,c,vf,hf){return a*x + b;},
			"AbsoluteValue": function(x,a,b,c,vf,hf){return vf*Math.abs(x-a) + b;},
			"Quadratic": function(x,a,b,c,vf,hf,d,h,k){return vf*a*Math.pow((x-h), 2) + k;},
			"SquareRoot": function(x,a,b,c,vf,hf){return vf*Math.sqrt(hf*(x-a)) + b;},
			"Cubic": function(x,a,b,c,vf,hf){return vf*Math.pow(hf*(x-a), 3) + b;},
			"CubeRoot": function(x,a,b,c,vf,hf){
				var newx = hf*(x-a);
				var sign = newx === 0 ? 0 : newx > 0 ? 1 : -1;
				return vf*(sign * Math.pow(Math.abs(newx), 1/3)) + b;
			},
			"Exponential": function(x,a,b,c,vf,hf){return vf*Math.pow(b, hf*(x-a)) + c;},
			"Logarithmic": function(x,a,b,c,vf,hf){return vf*Math.pow(Math.E,hf*(x-a)) + b;}
		},
		"y": {
			"Linear": function(y,a,b,c,vf,hf){return (y-b)/a;},
			"AbsoluteValue": function(y,a,b,c,vf,hf){return hf*Math.abs(y-b) + a;},
			"Quadratic": function(y,a,b,c,vf,hf,d,h,k){return hf*a*Math.pow((y-k), 2) + h;},
			"SquareRoot": function(y,a,b,c,vf,hf){return hf*Math.sqrt(vf*(y-b)) + a;},
			"Cubic": function(y,a,b,c,vf,hf){return hf*Math.pow(vf*(y-b), 3) + a;},
			"CubeRoot": function(y,a,b,c,vf,hf){
				var newY = vf*(y-b);
				var sign = newY === 0 ? 0 : newY > 0 ? 1 : -1;
				return hf*(sign * Math.pow(Math.abs(newY), 1/3)) + a;
			},
			"Exponential": function(y,a,b,c,vf,hf){return hf*Math.pow(b, vf*(y-c)) + a;},
			"Logarithmic": function(y,a,b,c,vf,hf){return hf*Math.pow(Math.E,vf*(y-b)) + a;}
		}
	},

	inverseEquations: {
		"y": {
			"Linear": function(y,a,b,c,vf,hf){return (y-b)/a;},
			"AbsoluteValue": function(y,a,b,c,vf,hf,d){
				if (!d) d = 1;
				return d*((y-b)/vf) + a;
			},
			"Quadratic": function(y,a,b,c,vf,hf,d,h,k){
				if (!d) d = 1;
				return d*Math.sqrt((y-k)/(vf*a)) + h;
			},
			"SquareRoot": function(y,a,b,c,vf,hf){return Math.pow((y-b)/vf, 2)/hf + a;},
			"Cubic": function(y,a,b,c,vf,hf){
				var newY = (y-b)/vf;
				var sign = newY === 0 ? 0 : newY > 0 ? 1 : -1;
				return (sign * Math.pow(Math.abs(newY), 1/3))/hf + a;
			},
			"CubeRoot": function(y,a,b,c,vf,hf){return Math.pow((y-b)/vf, 3)/hf + a;},
			"Exponential": function(y,a,b,c,vf,hf){return (Math.log((y-c)/vf)/Math.log(b))/hf + a;},
			"Logarithmic": function(y,a,b,c,vf,hf){return (Math.log((y-b)/vf)/Math.log(Math.E))/hf + a;}
		},
		"x": {
			"Linear": function(x,a,b,c,vf,hf){return a*x + b;},
			"AbsoluteValue": function(x,a,b,c,vf,hf,d){
				if (!d) d = 1;
				return d*((x-a)/hf)+ b;
			},
			"Quadratic": function(x,a,b,c,vf,hf,d,h,k){
				if (!d) d = 1;
				return d*Math.sqrt((x-h)/(hf*a)) + k;
			},
			"SquareRoot": function(x,a,b,c,vf,hf){return Math.pow((x-a)/hf, 2)/vf + b;},
			"Cubic": function(x,a,b,c,vf,hf){
				var newX = (x-a)/hf;
				var sign = newX === 0 ? 0 : newX > 0 ? 1 : -1;
				return (sign * Math.pow(Math.abs(newX), 1/3))/vf + b;
			},
			"CubeRoot": function(x,a,b,c,vf,hf){return Math.pow((x-a)/hf, 3)/vf + b;},
			"Exponential": function(x,a,b,c,vf,hf){return (Math.log((x-a)/hf)/Math.log(b))/vf + c;},
			"Logarithmic": function(x,a,b,c,vf,hf){return (Math.log((x-a)/hf)/Math.log(Math.E))/vf + b;}
		}
	},

	getState: function() {
		// console.log("ps11.getState");

		// get the current state
		var out = {};
		out.coordinate_object_type = ps11.type;

		// get scale and labels
		out.scale_x = String(ps11.scale_x);
		out.scale_y = String(ps11.scale_y);
		out.label_x = ps11.label_x;
		out.label_y = ps11.label_y;

		// get display data
		out.coordinate_object_data = ps11.getDisplayDataString(ps11.points);
		if (ps11.type === "Equation") {
			out.equation_type = ps11.equationType;
			out.a = String(ps11.a);
			out.b = String(ps11.b);
			out.c = String(ps11.c);
			if(ps11.h) out.h = String(ps11.h);
			if(ps11.k) out.k = String(ps11.k);
		}

		out.reference_labels = "";
		if (ps11.points[0].label) {
			for (var i = 0; i < ps11.points.length; i++) {
				if (ps11.points[i].label) {
					out.reference_labels += ps11.points[i].label;
					if (i !== ps11.points.length - 1) out.reference_labels += ",";
				}
			}
		}

		// store reset data
		out.reset_points = ps11.getDisplayDataString(ps11.resetPoints);
		out.reset_rotation_point = ps11.resetRotationPoint.x + "," + ps11.resetRotationPoint.y;
		if (ps11.rotationPoint.default) out.reset_rotation_point = "default";
		out.reset_constants = ps11.resetConstants.a + "," + ps11.resetConstants.b + "," + ps11.resetConstants.c;

		// store rotation point
		out.rotation_point = ps11.rotationPoint.x + "," + ps11.rotationPoint.y;
		out.rotation_point_immobile = (ps11.rotationPoint.immobile) ? "true" : "false" ;

		// ghosted
		if (ps11.ghostData) {
			out.ghosted = "true";
			if (ps11.ghostData.points) out.ghostPoints = ps11.getDisplayDataString(ps11.ghostData.points);
			if (ps11.ghostData.equationPoints) out.ghostEquation = ps11.getDisplayDataString(ps11.ghostData.equationPoints);
		} else {
			out.ghosted = "false";
		}

		// get answer data
		out.coordinate_object_answer = ps11.origAnswer;

		// console.log(out);
		// console.log(ps11.getScreenShot());

		return out;
	},

	setState: function(stateObject) {
		// console.log("ps11.setState");
		ps11.type = stateObject.coordinate_object_type;

		// set scale and labels
		ps11.scale_x = eval(stateObject.scale_x);
		ps11.scale_y = eval(stateObject.scale_y);
		ps11.label_x = stateObject.label_x;
		ps11.label_y = stateObject.label_y;

		// get points
		ps11.points = ps11.parseDisplayData(stateObject.coordinate_object_data);

		// add reference labels
		if (stateObject.reference_labels !== "") {
			var references = stateObject.reference_labels.split(",");
			for (var i = 0; i < references.length; i++) {
				ps11.points[i].label = references[i];
			}
		}

		// save points
		if (!stateObject.reset_points) {
			ps11.resetPoints = $.extend(true, [], ps11.points);
		} else {
			ps11.resetPoints = ps11.parseDisplayData(stateObject.reset_points);
		}

		// do equation stuff
		if (ps11.type === "Equation") {
			ps11.equationType = stateObject.equation_type;
			ps11.a = (ps11.equationType === "Linear" && stateObject.a === "") ? 1 : Number(stateObject.a);
			ps11.b = Number(stateObject.b);
			ps11.c = Number(stateObject.c);

			// get vertex if quadratic
			if (ps11.equationType === "Quadratic") {
				if (stateObject.h && stateObject.k) {
					ps11.h = Number(stateObject.h);
					ps11.k = Number(stateObject.k);
				} else {
					ps11.h = -ps11.b/(2*ps11.a);
					ps11.k = ps11.a*Math.pow(ps11.h,2) + ps11.b*ps11.h + ps11.c;
				}
			}

			// get reset constants
			if (!stateObject.reset_constants) {
				ps11.resetConstants = [ps11.a, ps11.b, ps11.c];
			} else {
				var constants = stateObject.reset_constants.split(',');
				ps11.resetConstants = [Number(constants[0]), Number(constants[1]), Number(constants[2])];
			}

			ps11.updateEquationPoints();
		}

		// get rotation points
		if (stateObject.rotation_point.toLowerCase() !== "default") {
			ps11.rotationPoint = ps11.getXYFromString(stateObject.rotation_point);
			if (stateObject.rotation_point_immobile) ps11.rotationPoint.immobile = eval(stateObject.rotation_point_immobile);
		} else {
			if (ps11.type === "Equation") {
				ps11.rotationPoint = {x:0,y:0,immobile:true};
			} else {
				ps11.rotationPoint = ps11.getShapeCenter();
			}
		}

		// set rotation reset point
		if (stateObject.reset_rotation_point) {
			var point = stateObject.reset_rotation_point.split(",");
			ps11.resetRotationPoint = {
				x: point[0],
				y: point[1],
				immobile: eval(stateObject.rotation_point_immobile)
			}
		} else {
			ps11.resetRotationPoint =  $.extend(true, {}, ps11.rotationPoint);
		}

		// check if I need to make a ghosted image
		if (eval(stateObject.ghosted)) {
			if (stateObject.ghostPoints) {
				// reuse saved data
				ps11.ghostData = {};
				ps11.ghostData.points = ps11.parseDisplayData(stateObject.ghostPoints);
				if (ps11.type == "Equation") {
					ps11.ghostData.equationPoints = ps11.parseDisplayData(stateObject.ghostEquation);
				}
			} else {
				// use data
				ps11.ghostData = {};
				ps11.ghostData.points = $.extend(true, [], ps11.points);
				if (ps11.type == "Equation") {
					ps11.ghostData.equationPoints = $.extend(true, [], ps11.equationPoints);
				}
			}
		}

		if (!eval(stateObject.show_rotate_btn)) $("#rotateButton").hide();
		if (!eval(stateObject.show_flip_horz_btn) || (ps11.type === "Equation" && ps11.equationType === "Linear")) $("#flipHorzButton").hide();
		if (!eval(stateObject.show_flip_vert_btn) || (ps11.type === "Equation" && ps11.equationType === "Linear")) $("#flipVertButton").hide();

		// store answer
		ps11.origAnswer = stateObject.coordinate_object_answer;
	},

	init: function(data, addSubmit) {
		console.log("ps11.init");
		var self = this;

		// set state from data
		if (data) {
			ps11.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps11.getState);
      cogAPI.setCaptureImageFromAPPFunction(ps11.getScreenShot);

			var state = cogAPI.getQuestionState();
			if (state) ps11.setState(state);
		}

		// figure our block size and round for better placement
		ps11.blocksize_x = Math.round((ps11.dimension_x/2)/ps11.scale_x);
		ps11.blocksize_y = Math.round((ps11.dimension_y/2)/ps11.scale_y);

		// get dimensions
		ps11.dimension_x = ps11.blocksize_x * ps11.scale_x * 2;
		ps11.dimension_y = ps11.blocksize_y * ps11.scale_y * 2;

		// add stage in
		ps11.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		ps11.drawLayer = new Kinetic.Layer();
		ps11.stage.add(ps11.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				var tmp = GradeCogneroQuestion(ps11.getState(), 1);
				alert(tmp?"Pass":"Fail");
			});
		}

		$("#rotateButton").click(function() {
			if ($(this).hasClass('on')) {
				ps11.setMode(ps11.MODE_DRAG);
			} else {
				ps11.setMode(ps11.MODE_ROTATE);
			}
		});

		$("#flipHorzButton").click(function() {
			ps11.flipHorizontal();
		});

		$("#flipVertButton").click(function() {
			ps11.flipVertical();
		});

		$("#resetButton").click(function() {
			ps11.reset();
		});

		if (data) {
			ps11.draw();
		}

		ps11.renderGrid();

	},

	getShapeCenter: function() {
		// find center
		var total = {};
		total.x = 0;
		total.y = 0;
		for (var i = 0; i < ps11.points.length-1; i++) {
			total.x += ps11.points[i].x;
			total.y += ps11.points[i].y;
		}

		var centerPoint = {
			x: total.x/(ps11.points.length-1),
			y: total.y/(ps11.points.length-1),
			default: true
		};

		return centerPoint;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	getDisplayDataString: function(points) {
		var displayString = ""; 

		// add points
		for (var i = 0; i < points.length; i++) {
			displayString += points[i].x + "," + points[i].y + ":";
		}

		// remove trailing :
		displayString = displayString.substring(0,displayString.length-1);

		return displayString;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseDisplayData: function(data, type, equation) {
		var points = [];
		var strPoints = data.split(':');

		// add points
		for (var i = 0; i < strPoints.length; i++) {
			points.push(ps11.getXYFromString(strPoints[i]));
		}

		return points;
	},

  updateEquationPoints: function() {
  	ps11.equationPoints = [];
  	var min = -ps11.scale_x;
  	var max = ps11.scale_x;
  	var flips = ps11.getFlipValues(ps11.globalAngle);

  	for (var i = min; i <= max; i += ps11.equationIteration) {
  		// fixing javascript weirdness with small decimals
  		i = Math.round(i*100)/100;

  		// log is different
  		if (ps11.a !== Infinity && ps11.a !== -Infinity) {
	  		if ((ps11.equationType !== "Logarithmic" && ps11.isVertEquation) || (ps11.equationType === "Logarithmic" && !ps11.isVertEquation) || (ps11.equationType === "Linear" && ps11.a === 0)) {
		  		var point = {
		  			x: i,
		  			y: ps11.equations.x[ps11.equationType](i,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
		  		};
		  	} else {
		  		var point = {
		  			x: ps11.equations.y[ps11.equationType](i,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
		  			y: i
		  		};
		  	}
		  } else {
		  	var point = {
		  		x: ps11.points[0].x,
		  		y: i
		  	}
		  }
  		ps11.equationPoints.push(point);
  	}
  },

	getFlipValues: function(angle) {
		var vf = 1;
		var hf = 1;
		switch (ps11.equationType) {
			case "Linear" :
				break;
			case "Quadratic" :
			case "AbsoluteValue" :
		  	if (angle === 180) vf = -1;
		  	if (angle === 270) hf = -1;
				break;
			case "SquareRoot" :
			case "Cubic" :
			case "CubeRoot" :
			case "Logarithmic" :
			case "Exponential" :
		  	if (angle === 90) vf = -1;
		  	if (angle === 180) { hf = -1; vf = -1; }
		  	if (angle === 270) { hf = -1; }
				break;
		}
		return {vf:vf*ps11.vertFlip,hf:hf*ps11.horzFlip};
	},

	reset: function() {
		console.log("reset");
		// revert to original spot
		ps11.points = $.extend(true, [], ps11.resetPoints);
		ps11.a = ps11.resetConstants[0];
		ps11.b = ps11.resetConstants[1];
		ps11.c = ps11.resetConstants[2];
		if (ps11.equationType === "Quadratic"){
			ps11.h = -ps11.b/(2*ps11.a);
			ps11.k = ps11.a*Math.pow(ps11.h,2) + ps11.b*ps11.h + ps11.c;
		}
		ps11.vertFlip = 1;
		ps11.horzFlip = 1;
		ps11.isVertEquation = true;
		ps11.globalAngle = 0;
		ps11.rotationPoint =  $.extend(true, {}, ps11.resetRotationPoint);

		// get points again
		if (ps11.type == "Equation") ps11.updateEquationPoints();

		// set mode
		ps11.setMode(ps11.MODE_DRAG);

		ps11.draw();
	},

	setMode: function(mode) {
		switch (mode) {
			case ps11.MODE_DRAG:
				ps11.mode = ps11.MODE_DRAG;
				$("#rotateButton").removeClass('on');
				break;
			case ps11.MODE_ROTATE:
				ps11.mode = ps11.MODE_ROTATE;
				$("#rotateButton").addClass('on');
				break;
		}
	},

	getCurrentPoint: function(event) {
		var relX = Math.round(event.layerX);
		var relY = Math.round(event.layerY);

		var point = {
			x: Math.round(relX / ps11.blocksize_x) - ps11.scale_x,
			y: ps11.scale_y - Math.round(relY / ps11.blocksize_y)
		};

		return point;
	},

	draw: function() {
		var self = this;

		ps11.drawLayer.destroyChildren();
		ps11.drawLayer.clear();

		// add line
		var points = [];

		// create points array
		var pointsArray = ps11.points;
		if (ps11.type == "Equation") pointsArray = ps11.equationPoints;
		for (var i = 0; i < pointsArray.length; i++) {
			var pixelValue = ps11.getPositionFromXY(pointsArray[i]);
			points.push(pixelValue.x);
			points.push(pixelValue.y);
		}

		// create line and group
		var currentLine = new Kinetic.Line({
			points: points,
			stroke: ps11.lineColor,
			strokeWidth: 3,
			opacity: 1,
			tension: 0,
			lineCap: "butt"
		});

		var centerPoint = ps11.getPositionFromXY(ps11.rotationPoint);
		ps11.graphGroup = new Kinetic.Group({
			x: centerPoint.x,
			y: centerPoint.y,
			offset: {x:centerPoint.x,y:centerPoint.y}
		});

		// Need to be able to move lines
		ps11.graphGroup.on("dragstart", function(event) {
			self.lineDragStart(event);
		});

		ps11.graphGroup.on("dragend", function(event) {
			self.lineDragEnd(event);
		});

		ps11.graphGroup.add(currentLine);

		// add points
		if (ps11.type == "Equation") pointsArray = ps11.points;
		ps11.displayPoints = [];
		$.each(pointsArray, function(index, value) {

			var pixelValue = ps11.getPositionFromXY(value);

			ps11.displayPoints[index] = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps11.pointSize,
				fill: ps11.pointColor,
				stroke: ps11.pointColor,
				strokeWidth: 1,
				id: index
			});

			if (pointsArray[index].label) {
				var label = new Kinetic.Text({
					text: pointsArray[index].label,
					x: pixelValue.x - ps11.pointSize - 10,
					y: pixelValue.y - ps11.pointSize - 12,
					fill: ps11.pointColor
				});
			}

			// Need to be able to move lines
			ps11.displayPoints[index].on("mousedown", function(event) {
				if (ps11.mode == ps11.MODE_DRAG) {
					ps11.graphGroup.draggable(true);
				} else {
					ps11.rotateStart(this.id());
				}
			});

			ps11.displayPoints[index].on("mouseup", function(event) {
				ps11.graphGroup.draggable(false);
			});

			ps11.graphGroup.add(ps11.displayPoints[index]);
			if (label) ps11.graphGroup.add(label);

		});
		
		if (ps11.type == "Equation") {
			// add arrows
			var endPoints = ps11.getEndPoints();
			var arrowOne = ps11.createArrow(0, ps11.lineColor);
			var arrowTwo = ps11.createArrow(1, ps11.lineColor);
			var rotation = ps11.getLineAngle(endPoints);

			// change endpoints to pixels
			for (var i = 0; i < endPoints.length; i++) {
				endPoints[i] = ps11.getPositionFromXY(endPoints[i]);
			};

			arrowOne.rotation(rotation[0]);
			arrowTwo.rotation(rotation[1]);

			arrowOne.setPosition({
				x: endPoints[0].x,
				y: endPoints[0].y
			});
			arrowTwo.setPosition({
				x: endPoints[1].x,
				y: endPoints[1].y
			});
			if (!isNaN(rotation[0])) ps11.graphGroup.add(arrowOne);
			if (!isNaN(rotation[1])) ps11.graphGroup.add(arrowTwo);

			// add origin point for rotation
			if (ps11.equationType !== "Linear") {
				var pixelValue = {};
				if (ps11.equationType === "Exponential") {
					pixelValue = ps11.getPositionFromXY({x:ps11.a,y:ps11.c});
				} else if (ps11.equationType === "Quadratic") {
					pixelValue = ps11.getPositionFromXY({x:ps11.h,y:ps11.k}, true);
				} else {
					pixelValue = ps11.getPositionFromXY({x:ps11.a,y:ps11.b});
				}
				ps11.originPoint = new Kinetic.Circle({
					x: pixelValue.x,
					y: pixelValue.y,
					radius: ps11.pointSize,
					fill: 'green',
					stroke: 'green',
					strokeWidth: 1
				});
				ps11.graphGroup.add(ps11.originPoint);
				ps11.originPoint.hide();
			}
		}

		// add rotation point
		// var point = new Kinetic.Circle({
		// 	x: centerPoint.x,
		// 	y: centerPoint.y,
		// 	radius: ps11.pointSize,
		// 	fill: 'green',
		// 	stroke: 'green',
		// 	strokeWidth: 1
		// });
		// ps11.graphGroup.add(point);
		// point.hide();

		// add ghost graph
		if (ps11.ghostData) {
			ps11.drawGhosted();
		}

		ps11.drawLayer.add(ps11.graphGroup);

		ps11.drawLayer.draw();

	},

	drawGhosted: function() {
		var self = this;

		// add line
		var points = [];

		// create points array
		var pointsArray = ps11.ghostData.points;
		if (ps11.type == "Equation") pointsArray = ps11.ghostData.equationPoints;
		for (var i = 0; i < pointsArray.length; i++) {
			var pixelValue = ps11.getPositionFromXY(pointsArray[i]);
			points.push(pixelValue.x);
			points.push(pixelValue.y);
		}

		// create line and group
		var currentLine = new Kinetic.Line({
			points: points,
			stroke: ps11.pointColor,
			strokeWidth: 3,
			opacity: 1,
			tension: 0,
			lineCap: "butt",
			opacity: 0.3
		});

		var centerPoint = ps11.getPositionFromXY(ps11.rotationPoint);
		var group = new Kinetic.Group({
			x: centerPoint.x,
			y: centerPoint.y,
			offset: {x:centerPoint.x,y:centerPoint.y}
		});

		group.add(currentLine);

		// add points
		if (ps11.type == "Equation") pointsArray = ps11.ghostData.points;
		$.each(pointsArray, function(index, value) {

			var pixelValue = ps11.getPositionFromXY(value);

			point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps11.pointSize,
				fill: ps11.pointColor,
				stroke: ps11.pointColor,
				strokeWidth: 1,
				id: index,
				opacity: 0.3
			});

			group.add(point);

		});

		ps11.drawLayer.add(group);
	},

	createArrow: function(direction, color) {

		var arrowDirection = (direction) ? 1 : 0;

		var points = [];

		if (arrowDirection) {
			points = [-ps11.pointSize*1.5, -ps11.pointSize*1.5, 0, 0, -ps11.pointSize*1.5, ps11.pointSize*1.5];
		} else {
			points = [ps11.pointSize*1.5, -ps11.pointSize*1.5, 0, 0, ps11.pointSize*1.5, ps11.pointSize*1.5];
		}

		var arrow = new Kinetic.Line({
			points: points,
			stroke: color,
			strokeWidth: 3,
			fill: color,
			closed: true,
			opacity: 1,
			lineCap: "butt"
		});

		return arrow;
	},

	removeLine: function(line) {
		ps11.points.splice(_.indexOf(ps11.points, line), 1);
	},

	// Drag Functions
	lineDragStart: function(event, groupID) {
		// console.log("ps11.lineDragStart - " + groupID);
		// ps11.priorMode = ps11.mode;
		// ps11.mode = ps11.MODE_DRAG;
	},

	lineDragEnd: function(event, groupID) {
		// console.log("ps11.lineDragEnd - " + groupID);

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var point = ps11.getCurrentPoint(event);

			// get dragged point and difference
			var origPoints = $.extend(true, [], ps11.points);
			var draggedPoint = ps11.points[event.targetNode.id()];
			var dx = point.x - draggedPoint.x;
			var dy = point.y - draggedPoint.y;

			// update points based on difference
			for (var i = 0; i < ps11.points.length; i++) {
				ps11.points[i].x += dx;
				ps11.points[i].y += dy;
			}

			// update equation points if necessary
			if (ps11.type == "Equation") {
				// ps11.equationType = $("#controls input").val();
				ps11.updateConstants(dx,dy);
				ps11.updateEquationPoints();
			}

			// update rotation point if necessary
			if (!ps11.rotationPoint.immobile) {
				ps11.rotationPoint.x += dx;
				ps11.rotationPoint.y += dy;
			}
		}

		ps11.draw();
		// ps11.mode = ps11.priorMode;
	},

	updateConstants: function(dx, dy) {
		switch (ps11.equationType) {
			case "Linear" :
				ps11.b += dy - (dx*ps11.a);
				break;
			case "Quadratic" :
				ps11.h += dx;
				ps11.k += dy;
				break;
			case "AbsoluteValue" :
			case "SquareRoot" :
			case "Cubic" :
			case "CubeRoot" :
			case "Logarithmic" :
				ps11.a += dx;
				ps11.b += dy;
				break;
			case "Exponential" :
				ps11.a += dx;
				ps11.c += dy;
				break;
		}
	},

	flipHorizontal: function() {
		// update reference points
		for (var i = 0; i < ps11.points.length; i++) {
			ps11.points[i].x -= 2*(ps11.points[i].x-ps11.rotationPoint.x);
		}

		if (ps11.type == "Equation") {
			ps11.horzFlip *= -1;

			// update equation
			switch (ps11.equationType) {
				case "Linear" :
					var rotY = ps11.equations.x[ps11.equationType](ps11.rotationPoint.x,ps11.a,ps11.b,ps11.c);
					ps11.a *= -1;
					ps11.b -= 2*(ps11.b-rotY);
					break;
				case "Quadratic" :
					ps11.h -= 2*(ps11.h-ps11.rotationPoint.x);
					break;
				case "AbsoluteValue" :
				case "SquareRoot" :
				case "Cubic" :
				case "CubeRoot" :
				case "Logarithmic" :
					ps11.a -= 2*(ps11.a-ps11.rotationPoint.x);
					break;
				case "Exponential" :
					ps11.a -= 2*(ps11.a-ps11.rotationPoint.x);
					break;
			}

			// udpate equation points
			ps11.updateEquationPoints();
		}

		ps11.draw();
	},

	flipVertical: function() {
		if (ps11.type == "Equation") {
			ps11.vertFlip *= -1;

			// update equation
			switch (ps11.equationType) {
				case "Linear" :
					ps11.a *= -1;
					ps11.b -= 2*(ps11.b-ps11.rotationPoint.y);
					break;
				case "Quadratic" :
					ps11.k -= 2*(ps11.k-ps11.rotationPoint.y);
					break;
				case "AbsoluteValue" :
				case "SquareRoot" :
				case "Cubic" :
				case "CubeRoot" :
				case "Logarithmic" :
					ps11.b -= 2*(ps11.b-ps11.rotationPoint.y);
					break;
				case "Exponential" :
					ps11.c -= 2*(ps11.c-ps11.rotationPoint.y);
					break;
			}

			// udpate equation points
			ps11.updateEquationPoints();
		} 

		// update reference points
		for (var i = 0; i < ps11.points.length; i++) {
			ps11.points[i].y -= 2*(ps11.points[i].y-ps11.rotationPoint.y);
		}

		ps11.draw();
	},
			
  findCenterPoint: function (){
  	// get pixel data
		var pixelValue = ps11.getPositionFromXY(ps11.rotationPoint);

		ps11.centerPoint = {
			"left":parseFloat($("#coordinate_object_set").css('left')) + pixelValue.x + 1,
			"top":parseFloat($("#coordinate_object_set").css('top')) + pixelValue.y + 1
		};
  },

	rotateStart: function(id) {
		// set center point
		ps11.findCenterPoint();

    // get start angle
    var position = ps11.getPositionFromXY(ps11.points[id]);
    position.x += parseFloat($("#coordinate_object_set").css('left'));
    position.y += parseFloat($("#coordinate_object_set").css('top'));
    ps11.startAngle = ps11.getAngle(position);

    // listen for mouse up
    $(ps11.stage.content).on("mouseup", function(event) {
    	ps11.rotateStop();
  	});
    $(ps11.stage.content).on("mousemove", function(event) {
    	ps11.rotateDragging(event);
  	});
  },

  // gets angle from 0 on the x axis of the center point
  getAngle: function(position){
		// get angle
		var angle = 0;
		if (position.x > ps11.centerPoint.left) { // right
			if (position.y > ps11.centerPoint.top) { // bottom
				angle = Math.atan((position.x - ps11.centerPoint.left)/(position.y - ps11.centerPoint.top))*(180/Math.PI) + 270;
			} else { // top
				angle = Math.atan((ps11.centerPoint.top - position.y)/(position.x - ps11.centerPoint.left))*(180/Math.PI);
			}
		} else { // left
    	if (position.y < ps11.centerPoint.top) { // top
    		angle = Math.atan((ps11.centerPoint.left - position.x)/(ps11.centerPoint.top - position.y))*(180/Math.PI) + 90;
    	} else { // bottom
  			angle = Math.atan((position.y - ps11.centerPoint.top)/(ps11.centerPoint.left - position.x))*(180/Math.PI) + 180;
    	}
    }
    return angle;
  },

	rotateDragging: function(event) {
		// get rotation
		ps11.rotationAngle = -(ps11.getAngle({x:event.pageX,y:event.pageY}) - ps11.startAngle);

    // round number to nearest 90 for snapping
		if (ps11.equationType !== "Linear") {
			ps11.rotationAngle = Math.ceil(ps11.rotationAngle/90) * 90;
		}

		// rotate rotation
    ps11.graphGroup.rotation(ps11.rotationAngle);
		ps11.drawLayer.draw();
  },

	rotateStop: function() {
		// update equation
		if (ps11.type === "Equation") {
			// update global angle to know which way it's facing
			var prevGlobal = ps11.globalAngle;
			ps11.globalAngle += ps11.rotationAngle;
			if (ps11.globalAngle > 270) ps11.globalAngle -= 360;
			if (ps11.globalAngle < 0) ps11.globalAngle = 360 + ps11.globalAngle;

			// update flip types
			if (Math.abs(ps11.globalAngle - prevGlobal) !== 180) {
				// all switch dem types
				var tmpVert = ps11.vertFlip;
				ps11.vertFlip = ps11.horzFlip;
				ps11.horzFlip = tmpVert;
			}

			// update equation direction
			if ((ps11.globalAngle/90)%2) {
				// hoizontal
				ps11.isVertEquation = false;
			} else {
				// vertical
				ps11.isVertEquation = true;
			}
		}

		// update points
		for (var i = 0; i < ps11.displayPoints.length; i++) {
			var newXY = ps11.getXYfromPosition(ps11.displayPoints[i].getAbsolutePosition());
			ps11.points[i].x = newXY.x;
			ps11.points[i].y = newXY.y;
		}

		if (ps11.rotationPoint.default) {
			ps11.rotationPoint = ps11.getShapeCenter();
		}

		// update constants
		ps11.rotateConstants();

		// update equation points if needed
		if (ps11.type === "Equation") ps11.updateEquationPoints();

		// redraw
		ps11.draw();

    $(ps11.stage.content).off("mouseup");
    $(ps11.stage.content).off("mousemove");
  },

	rotateConstants: function() {
		switch (ps11.equationType) {
			case "Linear" :
				ps11.a = (ps11.points[0].y-ps11.points[1].y)/(ps11.points[0].x-ps11.points[1].x);
				ps11.b = ps11.points[0].y-ps11.a*ps11.points[0].x;
				break;
			case "Quadratic" :
				var newXY = ps11.getExactXYfromPosition(ps11.originPoint.getAbsolutePosition());
				ps11.h = newXY.x;
				ps11.k = newXY.y;
				break;
			case "AbsoluteValue" :
			case "SquareRoot" :
			case "Cubic" :
			case "CubeRoot" :
			case "Logarithmic" :
				var newXY = ps11.getXYfromPosition(ps11.originPoint.getAbsolutePosition());
				ps11.a = newXY.x;
				ps11.b = newXY.y;
				break;
			case "Exponential" :
				var newXY = ps11.getXYfromPosition(ps11.originPoint.getAbsolutePosition());
				ps11.a = newXY.x;
				ps11.c = newXY.y;
				break;
		}
	},

	getEndPoints: function() {
		// get slope
		var endPoints = [];
  	var flips = ps11.getFlipValues(ps11.globalAngle);

		// log is different
		if (ps11.a !== Infinity && ps11.a !== -Infinity) {
  		if ((ps11.equationType !== "Logarithmic" && ps11.isVertEquation) || (ps11.equationType === "Logarithmic" && !ps11.isVertEquation) || (ps11.equationType === "Linear" && ps11.a === 0)) {
	  		endPoints = [
					{
		  			x: -ps11.scale_x,
		  			y: ps11.equations.x[ps11.equationType](-ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					},
					{
		  			x: ps11.scale_x,
		  			y: ps11.equations.x[ps11.equationType](ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					}
				]

				// check if ends are off screen
				if (endPoints[0].y < -ps11.scale_y) {
					endPoints[0] = {
						x: ps11.inverseEquations.y[ps11.equationType](-ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,-1,ps11.h,ps11.k),
						y: -ps11.scale_y
					}
				} else if (endPoints[0].y > ps11.scale_y) {
					endPoints[0] = {
						x: ps11.inverseEquations.y[ps11.equationType](ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,-1,ps11.h,ps11.k),
						y: ps11.scale_y
					}
				}
				if (endPoints[1].y < -ps11.scale_y) {
					endPoints[1] = {
						x: ps11.inverseEquations.y[ps11.equationType](-ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
						y: -ps11.scale_y
					}
				} else if (endPoints[1].y > ps11.scale_y) {
					endPoints[1] = {
						x: ps11.inverseEquations.y[ps11.equationType](ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
						y: ps11.scale_y
					}
				}
	  	} else {
	  		endPoints = [
					{
		  			x: ps11.equations.y[ps11.equationType](-ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
		  			y: -ps11.scale_y
					},
					{
		  			x: ps11.equations.y[ps11.equationType](ps11.scale_y,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
		  			y: ps11.scale_y
					}
				]

				// check if ends are off screen
				if (endPoints[0].x < -ps11.scale_x) {
					endPoints[0] = {
		  			x: -ps11.scale_x,
		  			y: ps11.inverseEquations.x[ps11.equationType](-ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,-1,ps11.h,ps11.k)
					}
				} else if (endPoints[0].x > ps11.scale_x) {
					endPoints[0] = {
		  			x: ps11.scale_x,
		  			y: ps11.inverseEquations.x[ps11.equationType](ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,-1,ps11.h,ps11.k)
					}
				}
				if (endPoints[1].x < -ps11.scale_x) {
					endPoints[1] = {
		  			x: -ps11.scale_x,
		  			y: ps11.inverseEquations.x[ps11.equationType](-ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					}
				} else if (endPoints[1].x > ps11.scale_x) {
					endPoints[1] = {
		  			x: ps11.scale_x,
		  			y: ps11.inverseEquations.x[ps11.equationType](ps11.scale_x,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					}
				}
	  	}
	  } else {
  		endPoints = [
				{
	  			x: ps11.points[0].x,
	  			y: -ps11.scale_y
				},
				{
	  			x: ps11.points[0].x,
	  			y: ps11.scale_y
				}
			]
	  }

		return endPoints;
	},

	getLineAngle: function(endPoints) {
		// get variables
		var rotation = [];
  	var flips = ps11.getFlipValues(ps11.globalAngle);
		var newPoints = [];


		if (ps11.a !== Infinity && ps11.a !== -Infinity) {
			if ((ps11.equationType !== "Logarithmic" && ps11.isVertEquation) || (ps11.equationType === "Logarithmic" && !ps11.isVertEquation) || (ps11.equationType === "Linear" && ps11.a === 0)) {
		  	var lowX = Math.min(endPoints[0].x+0.1, endPoints[1].x+0.1);
		  	var highX = Math.max(endPoints[0].x-0.1, endPoints[1].x-0.1);
				newPoints = [
					{
		  			x: lowX,
		  			y: ps11.equations.x[ps11.equationType](lowX,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					},
					{
		  			x: highX,
		  			y: ps11.equations.x[ps11.equationType](highX,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k)
					}
				]
			
				// get new rotations
				for (var i = 0; i < endPoints.length; i++) {
					var slope = (endPoints[i].y - newPoints[i].y)/(endPoints[i].x - newPoints[i].x);
					rotation.push(-Math.atan(slope) * (180/Math.PI));
				};
			} else {
		  	var lowY = Math.min(endPoints[0].y+0.1, endPoints[1].y+0.1);
		  	var highY = Math.max(endPoints[0].y-0.1, endPoints[1].y-0.1);
				newPoints = [
					{
		  			x: ps11.equations.y[ps11.equationType](lowY,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
		  			y: lowY
					},
					{
		  			x: ps11.equations.y[ps11.equationType](highY,ps11.a,ps11.b,ps11.c,flips.vf,flips.hf,false,ps11.h,ps11.k),
		  			y: highY
					}
				]
			
				// get new rotations
				for (var i = 0; i < endPoints.length; i++) {
					var slope = (endPoints[i].y - newPoints[i].y)/(endPoints[i].x - newPoints[i].x);
					rotation.push(-Math.atan(slope) * (180/Math.PI));
					if ((flips.vf*flips.hf === -1 && (ps11.equationType !== "AbsoluteValue" && ps11.equationType !== "Linear" && ps11.equationType !== "Quadratic")) ||
						((ps11.equationType === "AbsoluteValue" || ps11.equationType === "Linear" || ps11.equationType === "Quadratic") && slope < 0))
							rotation[i] += 180;
				};
			}
		} else {
			// vertical line
			rotation = [-90,-90];
		}

		return rotation;
	},

	getXYFromString: function(coords) {
		coords = coords.split(',');
		var point = {
			x: eval(coords[0]),
			y: eval(coords[1])
		}

		return point
	},

	getPositionFromXY: function(point, useAdd) {
		var newPoint = {x:0,y:0};
		var addX = (point.x >= 0 && !useAdd) ? 1 : 0 ; // for lines
		var addY = (point.y <= 0 && !useAdd) ? 1 : 0 ;
		newPoint.x = (point.x + ps11.scale_x) * ps11.blocksize_x + addX;
		newPoint.y = (ps11.scale_y - point.y) * ps11.blocksize_y + addY;

		return newPoint;
	},

	getXYfromPosition: function(position) {
		var point = {
			x: Math.round(position.x / ps11.blocksize_x) - ps11.scale_x,
			y: ps11.scale_y - Math.round(position.y / ps11.blocksize_y)
		};

		return point;
	},

	getExactXYfromPosition: function(position) {
		var point = {
			x: position.x / ps11.blocksize_x - ps11.scale_x,
			y: ps11.scale_y - position.y / ps11.blocksize_y
		};

		return point;
	},

	getScreenShot: function() {
		// get kinetic canvas and add background
		$("#coordinate_object_set").parent().append("<canvas width='404' height='404' style='position:abosolute;left:0;top:0;'/>");
		var tempCanvas = $("#coordinate_object_set").parent().find("> canvas")[0].getContext("2d");
    tempCanvas.drawImage( ps11.ssCanvas, 0, 0);
    tempCanvas.drawImage( $("#coordinateGridCanvas canvas")[0], 0, 0);

    // Save to a data URL 
    var imgUrl = $("#coordinate_object_set").parent().find("> canvas")[0].toDataURL();
    $("#coordinate_object_set").parent().find("> canvas").remove();

    return imgUrl;
	},

	renderGrid: function() {
		if (typeof(html2canvas) != "undefined") {
			// get image of background
			html2canvas($("#coordinateGrid")[0], {
				onrendered: function(canvas) {
					ps11.ssCanvas = canvas;
				}
			});
		}
	}
}
