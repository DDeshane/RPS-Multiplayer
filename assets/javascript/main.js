$(document ).ready(function(){

var config = {
  apiKey: "AIzaSyC5fXNHzYfIB4a7GPhaR0KxVWKU4GL_VNU",
  authDomain: "train-scheduler-8d5b4.firebaseapp.com",
  databaseURL: "https://train-scheduler-8d5b4.firebaseio.com",
  projectId: "train-scheduler-8d5b4",
  storageBucket: "train-scheduler-8d5b4.appspot.com",
  messagingSenderId: "1041452694580"
};

firebase.initializeApp(config);

var database = firebase.database();
var ref=firebase.database().ref();

$("#submitButton").on("click", function(event){
    event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();

  var firstTime =
  moment($("#firstTime").val().trim(),
  "hh:mm").subtract(1, "years").format("x");

  var currentTime = moment();
 

  var newTrain = {

    train: trainName,
    trainGoing: destination,
    trainComing: firstTime,
    everyXMin: frequency
  };

  var newItem=database.ref().set(newTrain);
  database.ref().push(newItem);

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");

  return false;

});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  var trainName = childSnapshot.val().train;
  var destination =childSnapshot.val().trainGoing;
  var firstTime = childSnapshot.val().trainComing;
  var frequency = childSnapshot.val().everyXMin;

  var trainTime = moment.unix(firstTime).format("hh:mm");

  var difference =  moment().diff(moment(trainTime),"minutes");

  var trainRemain = difference % frequency;

  var minUntil = frequency - trainRemain;

  var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

});
});


