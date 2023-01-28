const User = require("../model/User");
/* const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path"); */
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  console.log(req);
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  // checking for duplicate user
  // const duplicate = userDB.users.find((person) => person.username === user);
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict
  try {
    // hashing password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // create and store user data using mongoose
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result);

    /* // create user data using fs
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    ); */
    res.status(201).json({ success: `New user ${user} created.` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
