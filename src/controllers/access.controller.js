const { CREATED } = require("../core/success.response");
const AccessServices = require("../services/access.services");

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK!",
      metadata: await AccessServices.signUp(req.body),
      options : {
        limit : 10
      }
    }).send(res)
  };
}

module.exports = new AccessController();
