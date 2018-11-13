const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  // instance method: methods called on each individual instance
  // of a user. These are defined on the Schema.methods property
  // In this case, the toJSON method is a default method set by
  // mongoose, responsible for changing the object sent back to
  // the client to JSON
  var user = this;
  // set current user instance to variable called 'user'
  var userObject = user.toObject();
  // calling user.toObject() converts the mongoose model to an object

  return _.pick(userObject, ["_id", "email"]);
  // instead of returning the full object containing private information
  // such as tokens and password, use the lodash method pick() to take certain
  // properties from and object. This stripped down object is now the object
  // that is returned to the client
};

UserSchema.methods.generateAuthToken = function() {
  // instance method: methods called on each individual instance
  // of a user. These are defined on the Schema.methods property
  var user = this;
  // set current user instance to variable called 'user'
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  // set token to jwt hash of the current instance user id to hexstring,
  // and the access variable, in this case auth, along with the salt secret
  // being 'abc123'. The token is a hashed string

  user.tokens = user.tokens.concat([{ access, token }]);
  // as noted in the schema, each user has a tokens array which contains
  // various tokens provided. each token must have an access property, describing
  // what the token provides access to, and the token itself, which is the
  // hashed string, in this case the return value of calling jwt.sign(). The
  // previously created jwt token is added to the tokens array in the form of an
  // object, containing the access property and token property

  return user.save().then(() => {
    return token;
    // save changes made to user model, chain a then call and return the hashed token
    // itself. This call itself is given the return keyword in order to allow
    // Promise chaining
  });
};

UserSchema.statics.findByToken = function(token) {
  // model method: called on the model itself. These are defined on the
  // Schema.statics property
  var User = this;
  // set current user instance to variable called 'user'
  var decoded;
  // initialise variable called decoded. This will be set to the return
  // value of calling jwt.verify. The reason this is initialised before the
  // call to verify is so the verify call can be handled in a try catch block,
  // since a failed verification will result in an error, allowing us to handle
  // it.

  try {
    decoded = jwt.verify(token, "abc123");
    // Attempt to set the variable decoded to the object of the token
    // passed in to the current static method, as well as the secret
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
    // in the case of an error, calling Promise.reject() will resolve the
    // the findByToken call made in authenticate.js and not allow access to
    // authenticated route
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
  // In the case of succesful verification, search through the User model
  // database to find the user that has the properties of the data that was
  // hashed. In this case, were looking for a user that matches the id of
  // the hashed token that was sent, as well as the token and access properties
  // of the tokens array. To access nested properties, you wrap the key in a string
  // and access it with dot notation.
};

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
