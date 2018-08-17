function GradeCogneroQuestion(stateObj, pointsPossible) {
    var correct = check_numberlines(stateObj);
    return pointsPossible * (correct ? 1 : 0);
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
function set_numberlines() {
    if (typeof(page_builder_app) == "undefined")
        return;
    var self = page_builder_app;
    if (location.pathname.substring(1).split('/')[1] === 'builder.php') {
        for (var i = 0; i < self.numberlines.length; i++) {
            JSONObject.numberline_object[i].cStates = self.numberlines[i]._states;
            JSONObject.numberline_object[i].cSectionColors = self.numberlines[i]._sectionColors;
            console.log(JSON.stringify(JSONObject.numberline_object[i]));
        }
    }
}
function check_numberlines(s) {
    var self = parseState(s);
    for (var i = 0; i < self.length; i++) {
        for (var j = 0; j < self[i].symbols.length; j++) {
            if (self[i].symbols[j] != JSONObject.numberline_object[i].cStates[j]) {
                return false;
            }
        }
        for (var j = 0; j < self[i].sections.length; j++) {
            if (self[i].sections[j] != JSONObject.numberline_object[i].cSectionColors[j]) {
                return false;
            }
        }
    }
    return true;
}
function showA() {
    var self = page_builder_app;
    window.nlLoaded = false;
    if (location.pathname.substring(1).split('/')[1] !== 'builder.php')
        return;
    for (var i = 0; i < self.numberlines.length; i++) {
        for (var j = 0; j < self.numberlines[i]._states.length; j++) {
            self.numberlines[i]._states[j] = JSONObject.numberline_object[i].cStates[j];
        }
        for (var j = 0; j < self.numberlines[i]._sectionColors.length; j++) {
            self.numberlines[i]._sectionColors[j] = JSONObject.numberline_object[i].cSectionColors[j];
        }
        self.numberlines[i].refresh(JSONObject.numberline_object[i]);
    };
    window.nlLoaded = true;
}
