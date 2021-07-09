const User = require("../../../models/user");

exports.checkRole = (req, res, next) => {
  // refuse if not an admin
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: "you are not an admin",
    });
  } else {
    next();
  }
};

/*
    GET /api/user/list
*/

exports.list = (req, res) => {
  User.find({}, "-password")
    .exec()
    .then((users) => {
      res.json({ users });
    });
};

/*
    GET /api/user/:id
*/

exports.get = (req, res) => {
  let id = req.params.id;

  const respond = (user) => {
    if (!user) {
      throw new Error("User does not exist");
    } else {
      res.json(user);
    }
  };

  const OnError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findById(id).then(respond).catch(OnError);
};

/*
    POST /api/user/
*/

exports.create = (req, res) => {
  const { name, email, password, role } = req.body;

  // create a new user if does not exist
  const create = (user) => {
    if (user) {
      throw new Error("email exists");
    } else {
      return User.create(name, email, password, role);
    }
  };

  // respond to the client
  const respond = (user) => {
    res.json({
      message: "registered successfully",
      user: user,
    });
  };

  // run when there is an error (email exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check email duplication
  User.findOneByUsername(email).then(create).then(respond).catch(onError);
};
/*
    PATCH /api/user/:id
*/
exports.update = (req, res) => {
  let id = req.params.id;

  // update a user if does not exist
  const update = (user) => {
    if (user) {
      const updateUser = Object.assign(user, req.body);
      return updateUser.save();
    } else {
      throw new Error("user doesn't exists");
    }
  };

  // respond to the client
  const respond = (user) => {
    res.json({
      message: "updated successfully",
      user,
    });
  };

  // run when there is an error (email exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check email duplication
  User.findById(id).then(update).then(respond).catch(onError);
};

// delete user

exports.delete = (req, res) => {
  let id = req.params.id;

  const deleteUser = (user) => {
    if (user) {
      return user.remove();
    } else {
      throw new Error("user doesn't exists");
    }
  };

  // respond to the client
  const respond = (user) => {
    res.json({
      message: "deleted successfully",
      user,
    });
  };

  // run when there is an error (email exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findById(id).then(deleteUser).then(respond).catch(onError);
};
