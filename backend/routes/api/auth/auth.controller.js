const jwt = require("jsonwebtoken");
const User = require("../../../models/user");

/*
    POST /api/auth/register
    {
      name,
      email,
      password,
      role
    }
*/

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  let newUser = null;

  // create a new user if does not exist
  const create = (user) => {
    if (user) {
      throw new Error("email exists");
    } else {
      return User.create(name, email, password, role);
    }
  };

  // count the number of the user
  const count = (user) => {
    newUser = user;
    return User.count({}).exec();
  };

  // assign admin if count is 1
  const assign = (count) => {
    if (count === 1) {
      return newUser.assignAdmin();
    } else {
      // if not, return a promise that returns false
      return Promise.resolve(false);
    }
  };

  // respond to the client
  const respond = (isAdmin) => {
    res.json({
      message: "registered successfully",
      admin: isAdmin ? true : false,
    });
  };

  // run when there is an error (email exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check email duplication
  User.findOneByUsername(email)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

/*
    POST /api/auth/login
    {
        email,
        password
    }
*/

exports.login = (req, res) => {
  const { email, password } = req.body;
  const secret = req.app.get("jwt-secret");

  // check the user info & generate the jwt
  const check = (user) => {
    if (!user) {
      // user does not exist
      throw new Error("user does not exist");
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              name: user.name,
              email: user.email,
              admin: user.admin,
              role: user.role,
            },
            secret,
            {
              expiresIn: "7d",
              issuer: "velopert.com",
              subject: "userInfo",
            },
            (err, token) => {
              if (err) reject(err);
              resolve({ token, user });
            }
          );
        });
        return p;
      } else {
        throw new Error("login failed");
      }
    }
  };

  // respond the token
  const respond = ({ token, user }) => {
    res.json({
      message: "logged in successfully",
      token,
      user,
    });
  };

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  // find the user
  User.findOneByUsername(email).then(check).then(respond).catch(onError);
};

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};
