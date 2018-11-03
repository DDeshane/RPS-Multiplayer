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
var ref=firebase.database().ref('trains');

$("#submitButton").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTime = moment($("#firstTime").val().trim(), "HH:mm").format("");
  var frequency = $("#frequency").val().trim();

  var newTrain = {
    train: trainName,
    trainGoing: destination,
    trainComing: firstTime,
    everyXMin: frequency
  };

  var key = database.ref().child('trains').push().key;
  var updates = {};
  updates['/trains/' + key] = newTrain;
  firebase.database().ref().update(updates);

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");

  return false;

});

ref.on("child_added", function (childSnapshot) {

  console.log * (childSnapshot.val());

  var trainName = childSnapshot.val().train;
  var destination = childSnapshot.val().trainGoing;
  var firstTime = childSnapshot.val().trainComing;
  var frequency = childSnapshot.val().everyXMin;

  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

  var currentTime = moment();

  var diffTime = moment().diff(moment(firstTimeConverted),"minutes");

  var tRemainder = diffTime % frequency;

  var MinutesTillTrain = frequency -tRemainder;

  var nextTrain = moment().add(MinutesTillTrain, "minutes");
  var nextTrainConverted = moment(nextTrain).format("hh:mm a");


  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>"
    + destination + "</td><td>" + frequency + "</td><td>" +
    nextTrainConverted + "</td><td>" + MinutesTillTrain + "</td></tr>");

});