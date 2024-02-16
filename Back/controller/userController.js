const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const saltRounds = 5;
const KEY = process.env.KEY;

async function signup(req, res) {
    const { email, password, username } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ email, password: hashedPassword, username });
        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Error registering new user');
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, KEY);
            res.send({ token, id: user._id, username: user.username });
        } else
            res.status(401).send('Invalid email or password');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
}

async function update(req, res) {
    const userId = req.params.id;
    const { email, password, firstName, lastName, phone, bio } = req.body;
    try {
        const updatedFields = {
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || '',
            phone: phone || '',
            bio: bio || ''
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedUser)
            return res.status(404).send('User not found');

        res.send('Updated!');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Update error');
    }
}

async function getUserInfos(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).send('User not found');

        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const addScoreToUser = async (req, res) => {
    const { userId } = req.params;
    const { score, date } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        user.score.push({ score, date });
        await user.save();
        res.status(200).json({ message: "Score added successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error adding score", error: error.message });
    }
}

async function getBestScore(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        if (user.score && user.score.length > 0) {
            const bestScore = user.score.reduce((max, score) => score.score > max.score ? score : max, user.score[0]);
            res.json({ bestScore });
        } else {
            res.status(404).send('No scores found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getRanking(req, res) {
    try {
        const users = await User.find().select('username score');
        const rankings = users.map(user => ({
            username: user.username,
            bestScore: user.score && user.score.length > 0
                ? user.score.reduce((max, current) => current.score > max.score ? current : max, user.score[0]).score
                : 0
        }))
            .sort((a, b) => b.bestScore - a.bestScore);

        res.json(rankings);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting rankings');
    }
}

module.exports = { signup, login, update, getUserInfos, addScoreToUser, getBestScore, getRanking };