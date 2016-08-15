var http = require('http');
var request = require('request');
var ftpd = require('ftpd');
var fs = require('fs');
var path = require('path');

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


var fserver;
var fserver2;

var hostaddr = '127.0.0.1';				// Domoticz IP
var port = '8080';						// Domoticz Port
var idx1 = '89';						// Domoticz Device IDX #1
var idx2 = '90';						// Domoticz Device IDX #2

var ftpport = '8089';					// Port on which to create FTP server #1 - set IDX #1 device to connect to ftp://ipaddress:8089
var ftpport2 = '8090';					// Port on which to create FTP server #2 - set IDX #2 device to connect to ftp://ipaddress:8090
var ftpip = '127.0.0.1';				// IP Address which the FTP Server will be bound to
var ftpuploads = '/home/pi/uploads/';	// Folder to which ftp uploads can be saved - needs to exist and be writable


/* cam 1 ftp server */
	var foptions = {
	  host: process.env.IP || ftpip,
	  port: ftpport,
	  tls: null
	};

	fserver = new ftpd.FtpServer(foptions.host, {
	  getInitialCwd: function() {
	    return ftpuploads;
	  },
	  getRoot: function() {
	    return process.cwd();
	  },
	  pasvPortRangeStart: 1025,
	  pasvPortRangeEnd: 1050,
	  tlsOptions: foptions.tls,
	  allowUnauthorizedTls: true,
	  useWriteFile: true,
	  useReadFile: true,
	  uploadMaxSlurpSize: 7000
	});

	fserver.on('error', function(error) {
	  console.log('FTP Server #1 error:', error);
	});

	fserver.on('client:connected', function(connection) {
	  var thetime
	  thetime = getDateTime();
	  console.log(thetime + ': FTP Client #1 Connected');
	  // As soon as a client connects, it triggers the below. The client doesn't
	  // need to do anything or upload anything, just establish a connection
	  request.get('http://'+host+':'+port+'/json.htm?type=command&param=switchlight&idx='+idx1+'&switchcmd=On').on('error', function(err){
	        console.log(thetime + ": #1 Couldn't connect to Domoticz - " + err);
	  });
	});
	fserver.debugging = 4;
	fserver.listen(foptions.port);
	console.log('ftpd #1 is listening on port ' + foptions.port);



/* cam 2 ftp server */
	var foptions2 = {
	  host: process.env.IP || ftpip,
	  port: ftpport2,
	  tls: null
	};

	fserver2 = new ftpd.FtpServer(foptions2.host, {
	  getInitialCwd: function() {
	    return ftpuploads;
	  },
	  getRoot: function() {
	    return process.cwd();
	  },
	  pasvPortRangeStart: 1025,
	  pasvPortRangeEnd: 1050,
	  tlsOptions: foptions.tls,
	  allowUnauthorizedTls: true,
	  useWriteFile: true,
	  useReadFile: true,
	  uploadMaxSlurpSize: 7000
	});

	fserver2.on('error', function(error) {
	  console.log('FTP Server #2 error:', error);
	});

	fserver2.on('client:connected', function(connection) {
	  var thetime
	  thetime = getDateTime();
	  console.log(thetime + ': FTP Client #2 Connected');
	  // As soon as a client connects, it triggers the below. The client doesn't
	  // need to do anything or upload anything, just establish a connection
	  request.get('http://'+host+':'+port+'/json.htm?type=command&param=switchlight&idx='+idx2+'&switchcmd=On').on('error', function(err){
	        console.log(thetime + ": #2 Couldn't connect to Domoticz - " + err);
	  });
	});
	fserver2.debugging = 4;
	fserver2.listen(foptions2.port);
	console.log('ftpd #2 is listening on port ' + foptions2.port);
