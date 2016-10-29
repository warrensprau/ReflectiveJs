String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

// http://jsfiddle.net/gonzif/MfJPF/1/
function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var line = '';
    var result = '';
    var columns = [];
    var quoteStrings = true;
    var labels = true;
    var head = array[0];
    if (quoteStrings) {//($("#quote").is(':checked')) {
        var i = 0;
        for (var key in array[0]) {
            var keyString = key + "";
            keyString = '"' + keyString.replace(/"/g, '""') + '",';
            columns[i] = key;
            line += keyString;
            i++;
        }
    } else {
        var i = 0;
        for (var key in array[0]) {
            keyString = key + ',';
            columns[i] = key;
            line += keyString;
            i++;
        }
    }

    if (labels) { //$("#labels").is(':checked')) {
        line = line.slice(0, -1);
        result += line + '\r\n';
    }


    for (var i = 0; i < array.length; i++) {
        var line = '';

        if (quoteStrings) { //$("#quote").is(':checked')) {

            for (var j = 0; j < columns.length; j++) {
                var value = array[i][columns[j]] ? array[i][columns[j]] : '';
                var valueString = value + "";
                line += '"' + valueString.replace(/"/g, '""') + '",';
            }
        } else {
            for (var j = 0; j < columns.length; j++) {
                var value = array[i][columns[j]] ? array[i][columns[j]] : '';
                var valueString = value + ',';
                line += valueString;
            }
        }

        line = line.slice(0, -1);
        result += line + '\r\n';
    }
    return result;
}