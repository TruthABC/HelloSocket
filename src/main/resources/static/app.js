var stompClient = null;
var urlPrefix;
var sockJSUrl;
var greetingsSubscribePath;
var sendPath;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS(sockJSUrl);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe(greetingsSubscribePath, function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
        stompClient.subscribe("/topic/secret", function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send(sendPath, {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    urlPrefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
    sockJSUrl = urlPrefix + "xiyuan-websocket";
    greetingsSubscribePath = "/topic/greetings";
    sendPath = "/app/hello";
    console.log("[url & path]\n" + sockJSUrl + "\n" + greetingsSubscribePath + "\n" + sendPath);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});