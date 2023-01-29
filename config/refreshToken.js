const jwt = require("jsonwebtoken");

const refreshJwtToken = (data) => {
    return jwt.sign(data, process.env.JWT, { expiresIn: "3d" });
}
module.exports = { refreshJwtToken };