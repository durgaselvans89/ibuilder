//////Grading File//////
function GradeCogneroQuestion(stateObj, pointsPossible)
{
    var inDrops = parseInDrops(stateObj.inDrops);
    var grades = calcGrades(inDrops);
    
    var total = 0;
    var correct = 0;

    for (var i in grades){
        if (grades[i] == 2) {
            continue;
        }
        total++;
        if( grades[i] == 1||grades[i] == "1") {
            correct++;
        }
    }
    var tempArr = stateObj.state.split("###")[1].split(",");
    
    for (var i in tempArr){

    	var t = tempArr[i].split("|");

    	if(t[2] == t[3])
    		 correct++;
    	total++;
    }    
    return pointsPossible * (correct / total);
}
function displayAnswers(){
    var state = ps32.getState();
    var grades = calcGrades(parseInDrops(state.inDrops));
    var s = "Graded Drop Boxes:\n";
    for (var g in grades) {
        if (grades[g] == 2) continue;
         s += "    id " + g + ": " + ((grades[g] == "1" || grades[g] == 1)?"Pass":"Fail") + "\n";
    }
    return s;
}
function parseInDrops(inDropsString) {
    var tempDrops = inDropsString.split("|");
    var inDrops = {};
    for(var i in tempDrops) {
        var temp = tempDrops[i].split(":");
        if (temp.length == 2) {
            var temp2 = temp[1].split(",");
            inDrops[temp[0]] = [];
            for (var x in temp2) {
                var pieces = temp2[x].split("/");
                inDrops[temp[0]].push( {id: pieces[0], val: pieces[1]});
            }
        }
    }
    return inDrops;

}
function parseDropObjects() {
    var drops = [];
    if (typeof(JSONObject) == "undefined") return drops;
    for (var id in  JSONObject.drop_object) {
        drops[id] = {
            "id":id, 
            graded:JSONObject.drop_object[id].graded,
            dragArray:JSONObject.drop_object[id].drag_array.split(","),
            val:JSONObject.drop_object[id].value
        };
    }
    return drops;
}
function calcGrades(inDrops) {
    var drops = parseDropObjects();
    var unique = JSONObject.dragndrop_setup[0].unique == "true";
    var gradeID = JSONObject.dragndrop_setup[0].type.toLowerCase().indexOf("id") > -1;
    var gradeValue = JSONObject.dragndrop_setup[0].type.toLowerCase().indexOf("value") > -1;
    //Exact ID Match
    var g = [];
    var d,i,v,val;
    if (gradeID && ! gradeValue) {
        for (d in drops) {
            if (drops[d].graded != "undefined" && drops[d].graded != "true") {
                g[d]=2;
                continue;
            }
            g[d] = 1;
            var expArray = drops[d].dragArray.sort( function (a,b){return parseInt(a,10)-parseInt(b,10);});
            var actArray = [];
            for (v in inDrops[d]) {
                actArray.push(""+inDrops[d][v].id);
            }
            actArray = actArray.sort(function (a,b) { return parseInt(a,10)-parseInt(b,10); });
            if (actArray.length == 0)
                actArray.push("");
            if (actArray.length === expArray.length) {
                for (i=0; i< actArray.length; i++) {
                    if (expArray[i] != actArray[i]) {
                        g[d] = 0;
                        break;
                    }
                }
            } else { 
                g[d] = 0;
            }
        }
    } else
    //Summation
    if (gradeValue && !gradeID) {
        for (d in drops) {
            if (drops[d].graded != "undefined" && drops[d].graded != "true") {
                g[d]=2;
                continue;
            }
            g[d] = 1;
            val = 0;
            for (v in inDrops[d]) {
                val += parseFloat(inDrops[d][v].val);
            }
            if (drops[d].val != "") {
                g[d] = val == parseFloat(drops[d].val) ? 1 : 0;
            }
        }
    } else 
    //ID+Value
    if (gradeValue && gradeID) {
        for (d in drops) {
            if (drops[d].graded != "undefined" && drops[d].graded != "true") {
                g[d]=2;
                continue;
            }
            g[d] = 1;
            val = 0;
            for (v in inDrops[d]) {
                if (!hasIndex(drops[d].dragArray,inDrops[d][v].id)) {
                    g[d] = 0;
                    break;
                } 
                val += parseFloat(inDrops[d][v].val);
            }
            if (drops[d].val != "") {
                g[d] = g[d] && val == parseFloat(drops[d].val) ? 1 : 0;
            }
        } 
    }
    if (unique) { 
        var answerArrays = [];
        for (d in inDrops) {
            var a = [];
            for (v in inDrops[d]) {
                a.push(parseInt(inDrops[d][v].id,10));
            }
            answerArrays.push(a.sort(function (a,b) { return a-b; }));
        }
        for (i = 0; i< answerArrays.length; i++) {
            for (v=0;v<answerArrays.length; v++) {
                if (i === v) 
                    continue;
                if (answerArrays[i].length === 0 || answerArrays[v].length === 0) 
                    continue;
                if (arrEqual(answerArrays[i],answerArrays[v])) {
                    if (g[i] != 2) g[i] = 0;
                    if (g[v] != 2) g[v] = 0;
                    break;
                }
            }
        }
    }
    
    return g;
}
function hasIndex(arr,find) {
    var i = 0;
    var n = arr.length;
    for (n; i<n; i++)
        if (arr[i]===find)
            return true;
    return false;
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

