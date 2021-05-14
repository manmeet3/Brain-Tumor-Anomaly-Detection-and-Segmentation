const redis = require("redis");

const client = redis.createClient();

const subscriber = redis.createClient();
const publisher = redis.createClient();

let messageCount = 0;

subscriber.on("subscribe", function(channel, count) {
  // publish {"patient_id": "1234", "input_file": "hard/drive/path/to/zip"}
  publisher.publish("a channel", "a message");
  publisher.publish("a channel", "another message");
});

subscriber.on("message", function(channel, message) {
  messageCount += 1;

  console.log("Subscriber received message in channel '" + channel + "': " + message);
  var jsonMsg = JSON.parse(message)
  console.log(jsonMsg["patient_id"])
  console.log(jsonMsg["processed_file"])

  if (messageCount === 10) {
    subscriber.unsubscribe();
    subscriber.quit();
    publisher.quit();
  }
});

subscriber.subscribe("seg-results");
