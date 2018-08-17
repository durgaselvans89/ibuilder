function GradeCogneroQuestion(stateObj, pointsPossible) {
	var percentEarned = 0;
	if(evaluate(stateObj)) {
		percentEarned = 1;
	}
	var pointsEarned = pointsPossible * percentEarned;
	return pointsEarned;
}
function evaluate(state) {
	var answerCorrect = true;
	var pointsCopy = parseDisplayData_2(state.coordinate_object_data, state.blocksize);
	var shapeData = getShapeData(pointsCopy, state.blocksize);
	var perimeter = true;
	if (state.perimeter !== "" && Number(state.perimeter) !== shapeData.perimeter) perimeter = false;
	var area = true;
	if (state.area !== "" && Number(state.area) !== shapeData.area) area = false;
	var shape = true;
	if ((state.square == "true" && state.rectangle !== "true" && shapeData.shape !== "square") || 
		(state.square !== "true" && state.rectangle == "true" && shapeData.shape !== "rectangle") || 
		(state.square == "true" && state.rectangle == "true" && (shapeData.shape !== "rectangle" || shapeData.shape !== "square")) || 
		(state.triangle == "true" && shapeData.shape !== "triangle")) shape = false;
	var sideLengths = checkSideLengths(shapeData.sideLengths, state.sideLengths);
	var sides = true;
	if (state.sides !== "" && Number(state.sides) !== shapeData.sideLengths.length) sides = false;
	var points = true;
	if (state.points !== "" && Number(state.points) !== shapeData.points) points = false;
	if (!perimeter || !area || !shape || !sideLengths || !sides || !points) answerCorrect = false;
	return answerCorrect;
}
function parseDisplayData_2(data, blocksize) {
	var points = [];
	var allPoints = data.split(':');
	for (var i = 0; i < allPoints.length; i++) {
		points.push(getXYFromCoords_2(allPoints[i], blocksize));
	}
	return points;
}
function getShapeData(points, blocksize) {
	var shapeData = { };
	var closedShape = false;
	if (isEqual(points[0], points[points.length - 1])) {
		points.pop();
		closedShape = true;
	}
	shapeData = getShapeDimensions(points, closedShape, blocksize);
	shapeData.shape = getShapeType(points, shapeData.sideLengths, closedShape);
	return shapeData;
}
function getShapeDimensions(points, closedShape, blocksize) {
	var shapeData = {
		area: 0,
		perimeter: 0,
		sideLengths: [],
		points: points.length
	};
	for (var i = 0; i < points.length; i++) {
		var point1 = points[i];
		var point2 = (i === points.length - 1) ? points[0] : points[i+1];
		var sideLength = Math.sqrt(Math.pow((point1.x-point2.x),2) + Math.pow((point1.y-point2.y),2)) / blocksize;
		var addArea = point1.x*point2.y - point1.y*point2.x;
		shapeData.area += addArea;
		shapeData.perimeter += sideLength;
		shapeData.sideLengths.push(sideLength);
	}
	if (closedShape) {
		shapeData.area = 0.5*Math.abs(shapeData.area) / Math.pow(blocksize, 2);
	} else {
		shapeData.area = 0;
		shapeData.perimeter -= shapeData.sideLengths.pop();
	}
	return shapeData;
}
function getShapeType(points, sideLengths, closedShape) {
	points = sortBy(points, "x");
	var shape = "other";
	if (closedShape) {
		if (points.length == 4) {
			if (points[0].x == points[1].x && points[2].x == points[3].x) {
				if (sideLengths[0] === sideLengths[1]) {
					shape = "square";
				} else {
					shape = "rectangle";
				}
			}
		} else if (points.length == 3) {
			shape = "triangle";
		}
	}
	return shape;
}
function sortBy(arr, property) {
	var sortedArray = cogCopy(arr);
  var swapped = false;
  for( var i = 1; i < arr.length; i++ ) {
    var prev = arr[i - 1];
    var current = arr[i];
    if( prev[property] > current[property] ) {
      swapped = true;
      sortedArray[i] = prev;
      sortedArray[i - 1] = current;
    }
  }
  if( swapped ) {
    return sortBy(sortedArray, property);
  } else {
		return sortedArray;
	}
}
function checkSideLengths(shape, answer) {
	var sideLengths = false;
	if (answer !== "") {
		var answerCopy = answer.split(",");
		for (var i = 0; i < shape.length; i++) {
			sideLengths = false;
			for (var j = 0; j < answerCopy.length; j++) {
				if (shape[i] === Number(answerCopy[j])) {
					answerCopy.splice(j,1);
					sideLengths = true;
					break;
				}
			}
			if (!sideLengths) break;
		}
		if (sideLengths && answerCopy.length) sideLengths = false;
	} else {
		sideLengths = true;
	}
	return sideLengths;
}
function isEqual(a, b) {
	if (typeof(a) != typeof(b)) return false;
	if(a.length == undefined) {
		if (a.x != b.x) return false;
		if (a.y != b.y) return false;
	} else {
		if (a.length != b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (!isEqual(a[i], b[i])) return false;
		}
	}
	return true;
}
function getXYFromCoords_2(coords, blocksize) {
	coords = coords.split(',');
	var point = {
		x: coords[0]*blocksize,
		y: coords[1]*blocksize
	};
	return point;
}
function cogCopy(arr) {
	var clone = [];
	for (var i = 0; i < arr.length; i++) {
		clone[i] = {
			x: arr[i].x,
			y: arr[i].y
		};
	}
	return clone;
}
