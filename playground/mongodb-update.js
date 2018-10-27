// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    // findOneAndUpdate
    // db.collection("Todos")
    //   .findOneAndUpdate(
    //     {
    //       _id: new ObjectID("5bd25196857caf484db4e8cf")
    //     },
    //     {
    //       $set: {
    //         completed: true
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   });

    // db.collection("Users")
    //   .findOneAndUpdate(
    //     {
    //       _id: new ObjectID("5bd2472a19001c4774175047")
    //     },
    //     {
    //       $set: {
    //         name: "Ragan"
    //       },
    //       $inc: {
    //         age: 1
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   )
    //   .then(result => {
    //     console.log(JSON.stringify(result, undefined, 2));
    //   });

    // db.collection("Users")
    //   .findOneAndUpdate(
    //     {
    //       _id: new ObjectID("5bd25c89c0c2bd48d47c72e0")
    //     },
    //     {
    //       $set: {
    //         location: "Japan"
    //       },
    //       $inc: {
    //         age: 1
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   )
    //   .then(res => {
    //     console.log(res);
    //   });
    // db.close();
  }
);
