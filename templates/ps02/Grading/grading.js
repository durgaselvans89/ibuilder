function GradeCogneroQuestion(stateObj, pointsPossible)
{
    var percentEarned = 0;
    
    if(evaluate(stateObj)) {
        percentEarned = 1;
    }
    
    var pointsEarned = pointsPossible * percentEarned;

    return pointsEarned;
}
function evaluate(state) {
    var correct = true;
    var objects = JSONObject.shading_object;
    var answerLookup = [];
    var index,c,a;
    for (index in objects) {
        answerLookup[index] = buildCorrectAnswers(index);
    }

    var grid = state.grid.split("|");
    var counts = [];
    for (index in grid) {
        var item = grid[index].split(":");
        var gridId = item[0].split(",")[0];
        var cellId = item[0].split(",")[1];
        var colors = item[1].split(",");
        if (counts[gridId] == undefined)
            counts[gridId] = {};
        for(c in colors) {
            if (colors[c] == "") continue;
            
            if ( counts[gridId][colors[c]] == undefined) {
                counts[gridId][colors[c]] = 1;
            } else {
                counts[gridId][colors[c]]++;
            }
            if (typeof(answerLookup[gridId][colors[c]]) == "undefined") {
                return false;
            }
            if (answerLookup[gridId][colors[c]].arr != "") {
                var arr = answerLookup[gridId][colors[c]].arr.split(",");
                if (indexOf(arr,""+(parseInt(cellId,10)+1)) == -1) {
                    return false;
                }
            }
        }
    }
    for (a in answerLookup) {
        for (c in answerLookup[a]) {
            if (answerLookup[a][c].value == "") {
                answerLookup[a][c].value = answerLookup[a][c].arr.split(",").length;
            }
            if (parseInt(answerLookup[a][c].value,10) != counts[a][c]) {
                return false;
            }
        }
    }
    
    return correct;
}
function buildCorrectAnswers(index) {
    var colorArr = [];                  
    if (JSONObject.shading_object.length <= index)
        return colorArr;
    if ( JSONObject.shading_object[index].red_check == 'true') { 
        colorArr["R"] = {value:JSONObject.shading_object[index].red_value,arr:JSONObject.shading_object[index].red_array}; 
    }
    if ( JSONObject.shading_object[index].blue_check == 'true') { 
        colorArr["B"] = {value:JSONObject.shading_object[index].blue_value,arr:JSONObject.shading_object[index].blue_array}; 
    }
    if ( JSONObject.shading_object[index].green_check == 'true') { 
        colorArr["G"] = {value:JSONObject.shading_object[index].green_value,arr:JSONObject.shading_object[index].green_array}; 
    }
    if ( JSONObject.shading_object[index].yellow_check == 'true') { 
        colorArr["Y"] = {value:JSONObject.shading_object[index].yellow_value,arr:JSONObject.shading_object[index].yellow_array}; 
    }
    return colorArr;
}
function indexOf(arr, obj, start) {
    if (typeof(arr) != "object") return -1;
    for (var i = (start || 0), j = arr.length; i < j; i++) {
        if (arr[i] === obj) { return i; }
    }
    return -1;
}
