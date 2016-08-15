//Lets require/import the HTTP module
var http = require('http');
var request = require('request');

//Lets define the ports we want to listen on
const PORT1=8091; // We set up a port per camera... this is the port for Cam1
const IDX1=98; // and this is the virtual switch for that camera (Cam1) in Domoticz
const PORT2=8092; // and this is the port for Cam2
const IDX2=102; // and this is the virtual switch for that camera (Cam2) in Domoticz


function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

/* CAMERA 1 LISTENER */
function handleRequest1(req, response){
    request.get('http://127.0.0.1:8080/json.htm?type=command&param=switchlight&idx='+IDX1+'&switchcmd=On').on('error', function(err) {
        var thetime = getDatetime();
	console.log(thetime + ": " + err);
    });
}

var server1 = http.createServer(handleRequest1);

server1.listen(PORT1, function(){
    console.log("Server listening on: http://localhost:%s", PORT1);
});
/* END CAMERA 1 LISTENER */

/* CAMERA 2 LISTENER */
function handleRequest2(req, response){
    request.get('http://127.0.0.1:8080/json.htm?type=command&param=switchlight&idx='+IDX2+'&switchcmd=On').on('error', function(err) {
        var thetime = getDatetime();
	console.log(thetime + ": " + err);
    });
}

var server2 = http.createServer(handleRequest2);

server2.listen(PORT2, function(){
    console.log("Server listening on: http://localhost:%s", PORT2);
});
/* END CAMERA 2 LISTENER */
