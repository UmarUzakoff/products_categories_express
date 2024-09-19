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
      password: "$2y$12$7kwAQPLh3e1lcaERwto94ut62dhtkQwaaDq57FFcyfcPlVl1Ccw6u", //1234
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
