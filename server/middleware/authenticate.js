var { User } = require("./../models/user");

var authenticate = (req, res, next) => {
  // middleware is a function that runs between the initial request
  // and server response. It is given the request and response
  // body as args, as well as the next function, which must be called
  // in order to move on to the response code.
  var token = req.header("x-auth");
  // set the x-auth token from the client request header to the
  // value 'token'. This is done by calling req.header() and
  // passing in the desired key

  User.findByToken(token)
    .then(user => {
      // successful return value should be matching user where
      // the tokens and id line up
      if (!user) {
        return Promise.reject();
        // if the token was valid but for whatever reason the
        // user was not found, reject the promise, calling the
        // catch error handling
      }
      req.user = user;
      req.token = token;
      // set the user and token properties on the request property to
      // the user found and the token provided by the client
      next();
      // call next to proceed with the response
    })
    .catch(e => {
      res.status(401).send();
      // send 401 (forbidden) error code in case of error
    });
};

module.exports = { authenticate };
