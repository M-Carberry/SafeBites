/*
SafeBites Backend API
- User signup
- Login validation
- User preference storage
- Review storage

Required:
- MongoDB Atlas connection
- configA.env with MONGO_URI
*/
require('dotenv').config({ path: 'configA.env' });

const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./connect.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;


connectToDatabase()
    .then((database) => {
        db = database;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`SafeBites backend running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

// basic test route
app.get('/', (req, res) => {
    res.send('SafeBites backend is running');
});


app.post('/api/signup', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected yet.' });
        }

        const {
            name,
            email,
            password,
            preferences = {}
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Name, email, and password are required.'
            });
        }

        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const userResult = await db.collection('users').insertOne({
            name,
            email,
            password, // okay for class prototype, but should be hashed in a real app
            createdAt: new Date()
        });

        const userId = userResult.insertedId;

        await db.collection('preferences').insertOne({
            userId,
            allergies: preferences.allergies || [],
            dietType: preferences.dietType || [],
            strictness: preferences.strictness || [],
            dietPlan: preferences.dietPlan || [],
            medical: preferences.medical || [],
            importance: preferences.importance || [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'User created successfully.',
            userId
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected yet.' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required.'
            });
        }

        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'No profile found for this email.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        const preferences = await db.collection('preferences').findOne({
            userId: user._id
        });

        res.status(200).json({
            message: 'Login successful.',
            userId: user._id,
            name: user.name,
            preferences: preferences || {}
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});


app.put('/api/preferences/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected yet.' });
        }

        const { userId } = req.params;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        const {
            allergies = [],
            dietType = [],
            strictness = [],
            dietPlan = [],
            medical = [],
            importance = []
        } = req.body;

        await db.collection('preferences').updateOne(
            { userId: new ObjectId(userId) },
            {
                $set: {
                    allergies,
                    dietType,
                    strictness,
                    dietPlan,
                    medical,
                    importance,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        res.status(200).json({
            message: 'Preferences updated successfully.'
        });
    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(500).json({ error: 'Server error updating preferences.' });
    }
});


app.post('/api/reviews', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected yet.' });
        }

        const { userId, restaurantId, rating, reviewText } = req.body;

        if (!userId || !restaurantId || !rating || !reviewText) {
            return res.status(400).json({
                error: 'userId, restaurantId, rating, and reviewText are required.'
            });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        const reviewResult = await db.collection('reviews').insertOne({
            userId: new ObjectId(userId),
            restaurantId,
            rating,
            reviewText,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Review created successfully.',
            reviewId: reviewResult.insertedId
        });
    } catch (error) {
        console.error('Review creation error:', error);
        res.status(500).json({ error: 'Server error creating review.' });
    }
});
