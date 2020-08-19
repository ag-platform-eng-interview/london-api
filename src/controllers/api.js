const express = require('express');
const app = module.exports = express();

const UserService = require('../services/UserService');
const userSvc = new UserService();

app.get('/londoners', async (req, res) => {
    try {
        const users = await userSvc.getBySelectedLondon()
        res.send(users);
    } catch (error) {
        console.log(error);
    }
}); 

app.get('/london-radius', async (req, res) => {
    try {
        const londerersByCityOrRadius = await userSvc.getByRadiusFromLondon(60);
        res.send(londerersByCityOrRadius);
    } catch (error) {
        console.log(error);
    }
});

app.get('/londoners-or-radius', async (req, res) => {
    try {
        const londerersByCityOrRadius = await userSvc.getBySelectedOrRadiusFromLondon(60);
        res.send(londerersByCityOrRadius);
    } catch (error) {
        console.log(error);
    }
});
