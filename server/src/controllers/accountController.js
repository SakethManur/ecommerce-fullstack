const accountService = require('../services/accountService');

/** PUT /account/update */
async function update(req, res) {
    const { userId, phone, address } = req.body;
    await accountService.update({ userId, phone, address });
    res.json({ message: 'Profile updated successfully!' });
}

module.exports = { update };
