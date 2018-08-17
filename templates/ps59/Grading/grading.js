function GradeCogneroQuestion(stateObj, pointsPossible) {
	var percentEarned = 0;
	var typeCrr=0;
	alert('GradeCogneroQuestion ..1');
	if(evaluate(stateObj)) {
		percentEarned = 1;
	}	
	alert('GradeCogneroQuestion ..2');
	for(var i=0;i<stateObj.typeData.length;i++){
		if(compareAnswers(stateObj.typeData[i].source,stateObj.typeData[i].value,true))
			typeCrr++;

	}	
	alert('GradeCogneroQuestion ..2');
	var pointsEarned = ((pointsPossible * percentEarned)+(typeCrr/stateObj.typeData.length)* percentEarned)/2;
	return pointsEarned;
}
function evaluate(state) {
	var displayData = parseDisplayData(state.coordinate_object_data, state.coordinate_object_type, state.connect);
	var points = displayData.points;
	var lines = displayData.lines;
	var answerData = parseAnswerData(state.fullAnswer, state.coordinate_object_type, state.connect, state.slope);
	var answerCorrect = true;
	if (answerData.type == "Line") {
		answerCorrect = evaluateSlopeLines(lines, answerData);
	} else {
		answerCorrect = isEqual(sortBy(answerData.points, "x"), sortBy(points, "x"));
		if (answerCorrect) answerCorrect = evaluateLines(answerData.lines, lines);
	}
	return answerCorrect;
}
function evaluateSlopeLines(lines, answerData) {
	if (lines.length) {
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].points.length) {
				var slope = (lines[i].points[0].y-lines[i].points[1].y)/(lines[i].points[0].x-lines[i].points[1].x);
				if (answerData.lines[i]) {
					var resultY = slope*(answerData.lines[i].points[0].x-lines[i].points[0].x)+lines[i].points[0].y;
					if (resultY !== answerData.lines[i].points[0].y) return false;
				}
				if (answerData.slopes[i]) {
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
	if (lines.length == answer.length) {
		for (var i = 0; i < lines.length; i++) {
			if (isEqual(lines[i].points[0], lines[i].points[lines[i].points.length-1])) lines[i].points.pop();
			for (var j = 0; j < answer.length; j++) {
				if (isEqual(answer[j].points[0], answer[j].points[answer[j].points.length-1])) answer[j].points.pop();
				linesCorrect = true;
				var dupLines = cogCopy(lines[i].points);
				for (var k = 0; k < answer[j].points.length; k++) {
					var index = cogIndexOf(dupLines, answer[j].points[k]);
					if (index !== -1) {
						dupLines.splice(index, 1);
					} else {
						linesCorrect = false;
					}
					if (!linesCorrect) break;
				}
				if (linesCorrect) break;
			}
			if (!linesCorrect) break;
		}
	} else {
		linesCorrect = false;
	}
	return linesCorrect;
}
function parseDisplayData(data, type, connect) {
	var displayData = {
		points: [],
		lines: []
	};
	var objects = data.split('|');
	if (data.length) {
		for (var i = 0; i < objects.length; i++) {
			var points = objects[i].split(':');
			if (points.length == 1 && type !== "Line") {
				displayData.points.push(getXYFromString(points[0]));
			} else {
				if (type == "Line" || connect == "true") {
					var line = { type: null, points: [], id:displayData.lines.length };
					if (type == "Line") {
						line.type = "slope";
					} else {
						line.type = "line";
					}
				}
				for (var j = 0; j < points.length; j++) {
					if (type == "Line" || connect == "true") {
						line.points.push(getXYFromString(points[j]));
					}
				}
				if (type == "Line" || connect == "true") {
					displayData.lines.push(line);
				}
			}
		}
	}
	return displayData;
}
function parseAnswerData(answer, type, connect, slope) {
	var answerData = {
		points: [],
		lines: [],
		slopes: [],
		type: type
	};
	var displayData = parseDisplayData(answer, type, connect);
	answerData.points = displayData.points;
	answerData.lines = displayData.lines;
	var slopes = slope.split("|");
	for (var i = 0; i < slopes.length; i++) {
		answerData.slopes.push(Number(slopes[i]));
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
	return point
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
function compareAnswers(a1, a2, removeSpaces) {
    if (removeSpaces) {
        var an1 = a1.replace(/,"160"/g, "").replace(/"160",/g, "").replace(/"160"/g, "").replace(/ /g,"").replace(/"160,/g,"\"").replace(/,160,/g, ",").replace(/,160"/g,"\"");
        var an2 = a2.replace(/,"160"/g, "").replace(/"160",/g, "").replace(/"160"/g, "").replace(/ /g,"").replace(/"160,/g,"\"").replace(/,160,/g, ",").replace(/,160"/g,"\"");
        return an1 === an2;
    }
    return a1 === a2;
}