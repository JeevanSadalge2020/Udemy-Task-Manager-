// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;

const { MongoClient, ObjectId } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-db";

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) console.log("Unable to connect to DB");
  else {
    console.log("Connected to DB");
    const db = client.db(databaseName);
    const cursor = db.collection("users").find({
      name: "jeevan",
    });
    cursor.toArray((err, users) => {
      console.log(users);
    });
    // ========================
    // db.collection("users")
    //   .updateOne(
    //     { _id: new ObjectId("610caf82ffd9a78e70b1e7af") },
    //     {
    //       $set: {
    //         name: "Nikhil",
    //       },
    //     }
    //   )
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
    // =========================
    db.collection("tasks")
      .updateMany(
        { completed: false },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
    // =================
    db.collection("users")
      .deleteOne({ name: "ritesh" })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    // ============================

    db.collection("users")
      .deleteMany({ name: "santosh" })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
});
