const { connect } = require("mongoose");
const config = require("../../config/config");
const Users = require("../models/User");

const run = async (app) => {
  await connect(config.ConnectionString);

  // CREATING ADMIN
  const admin = await Users.findOne({
    name: "admin",
    email: "admin@gmail.com",
  });

  if (!admin) {
    await Users.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "$2a$12$VJeMLnv1pHNKtA2AFqM86e.Z8mYv7sOr7Ys5AQtx0pwDqO1sgtapC", //1234
      role: "admin",
    });
  }
  //

  app.all("/*", async (req, res) => {
    return res.status(404).json({ error: "Route not found!" });
  });

  const PORT = config.PORT;

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

module.exports = run;
