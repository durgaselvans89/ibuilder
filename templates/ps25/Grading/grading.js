function GradeCogneroQuestion(stateObj, pointsPossible) {
	var percentEarned = 0;
	if(evaluate(stateObj)) {
		percentEarned = 1;
	}
	var pointsEarned = pointsPossible * percentEarned;
	return pointsEarned;
}
function evaluate(state) {
	if (state.coordinate_object_type !== "Line" && state.coordinate_object_data) state.user_object_data += "|" + state.coordinate_object_data;
	var displayData = parseDisplayData(state.user_object_data);
	var points = displayData.points;
	var lines = displayData.lines;
	var answerData = parseAnswerData(state.fullAnswer, state.slope);
	var answerCorrect = true;
	if (state.coordinate_object_type === "Line") {
		answerCorrect = evaluateSlopeLines(lines, answerData);
	} else {
		answerCorrect = evaluatePoints(answerData.points, points);
		if (answerCorrect) answerCorrect = evaluateLines(answerData.lines, lines);
	}
	return answerCorrect;
}
function evaluateSlopeLines(lines, answerData) {
	if (lines.length) {
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].length) {
				var slope = (lines[i][0].y-lines[i][1].y)/(lines[i][0].x-lines[i][1].x);
				if (answerData.points[i]) {
					if (answerData.points.length !== lines.length) return false;
					if (slope == Infinity || slope == -Infinity) {
						if (answerData.points[i].x !== lines[i][0].x) return false;
						resultY = answerData.points[i].y;
					} else {
						var resultY = slope*(answerData.points[i].x-lines[i][0].x)+lines[i][0].y;
					}
					if (resultY !== answerData.points[i].y) return false;
				}
				if (answerData.slopes[i]) {
					if (answerData.slopes.length !== lines.length) return false;
					if (slope !== answerData.slopes[i]) return false;
				}
			}
		}
	} else {
		return false;
	}
	return true;
}
function evaluateLines(answer, lines) {
	var linesCorrect = true;
	for (var i = 0; i < lines.length; i++) {
		if (!isEqual(lines[i][0],lines[i][1])) {
			for (var j = 0; j < answer.length; j++) {
				linesCorrect = true;
				var dupLines = cogCopy(lines[i]);
				for (var k = 0; k < answer[j].length; k++) {
					var index = cogIndexOf(dupLines, answer[j][k]);
					if (index !== -1) {
						dupLines.splice(index, 1);
					} else {
						linesCorrect = false;
					}
					if (!linesCorrect) break;
				}
				if (linesCorrect) break;
			}
		}
		if (!linesCorrect) return false;
	}
	for (var i = 0; i < answer.length; i++) {
		for (var j = 0; j < lines.length; j++) {
			linesCorrect = true;
			var dupAnswer = cogCopy(answer[i]);
			for (var k = 0; k < lines[j].length; k++) {
				var index = cogIndexOf(dupAnswer, lines[j][k]);
				if (index !== -1) {
					dupAnswer.splice(index, 1);
				} else {
					linesCorrect = false;
				}
				if (!linesCorrect) break;
			}
			if (linesCorrect) break;
		}
		if (!linesCorrect) return false;
	}
	return true;
}
function evaluatePoints(answer, points) {
	for (var i = 0; i < points.length; i++) {
		var index = cogIndexOf(answer, points[i]);
		if (index === -1) return false;
	}
	for (var i = 0; i < answer.length; i++) {
		var index = cogIndexOf(points, answer[i]);
		if (index === -1) return false;
	}
	return true;
}
function parseDisplayData(data) {
	var displayData = {
		points: [],
		lines: []
	};
	var objects = data.split('|');
	if (data.length) {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].length) {
				var points = objects[i].split(':');
				if (points.length === 1) {
					displayData.points.push(getXYFromString(points[0]));
				} else {
					for (var j = 0; j < points.length; j++) {
						displayData.points.push(getXYFromString(points[j]));
						if (j < points.length-1) displayData.lines.push([getXYFromString(points[j]),getXYFromString(points[j+1])]);
					}
				}
			}
		}
	}
	return displayData;
}
function parseAnswerData(answer, slope) {
	var answerData = {
		points: [],
		lines: [],
		slopes: []
	};
	var displayData = parseDisplayData(answer);
	answerData.points = displayData.points;
	answerData.lines = displayData.lines;
	if (slope.length) {
		var slopes = slope.split(",");
		for (var i = 0; i < slopes.length; i++) {
			if (slopes[i].indexOf("/") !== -1) {
				answerData.slopes.push(slopes[i].split("/")[0]/slopes[i].split("/")[1]);
			} else {
				answerData.slopes.push(Number(slopes[i]));
			}
		}
	}
	return answerData;
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
function cogIndexOf(arr, obj, start) {
    if (typeof(arr) != "object") return -1;
    for (var i = (start || 0), j = arr.length; i < j; i++) {
        if (isEqual(arr[i], obj)) { return i; }
    }
    return -1;
}
function getXYFromString(coords) {
	coords = coords.split(',');
	var point = {
		x: parseInt(coords[0]),
		y: parseInt(coords[1])
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
