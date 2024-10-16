const User = require("../models/auth");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "Email is already exit" });

    const hashedPassword = bcrypt.hashSync(password, 12);

    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Create User successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select("+password");

    if (!user)
      return res.status(404).json({ message: "Email or password invalid" });

    const matched = bcrypt.compareSync(password, user.password);

    if (!matched)
      return res.status(404).json({ message: "Email or password invalid" });

    res.cookie("accessToken", user, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ data: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
