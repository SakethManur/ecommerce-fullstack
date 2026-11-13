const authService = require('../services/authService');

/** POST /authentication/create-account */
async function register(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const result = await authService.register({ firstName, lastName, email, password });
    res.json(result);
}

/** POST /authentication/login */
async function login(req, res) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
}

module.exports = { register, login };
