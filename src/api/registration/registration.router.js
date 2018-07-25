const { Router } = require("express");
const registrationController = require("./registration.controller");

const registrationRouter = () => {
  const router = Router();

  router.post("/createNewRegistration", async (req, res) => {
    const response = await registrationController.createNewRegistration();
    res.send(response);
  });

  return router;
};

module.exports = { registrationRouter };