const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const connection = require('./db');

const app = express();
const PORT = 5500;

// Serve static files correctly
app.use(express.static(path.join(__dirname)));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Registration route
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    console.log(`Registration Attempt: Username - ${username}, Email - ${email}`);

    if (!username || !password || !email) {
        return res.status(400).send('All fields are required.');
    }

    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    connection.query(checkQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error. Please try again later.');
        }

        if (results.length > 0) {
            console.log('Username or email already exists');
            return res.status(409).send('Username or email already exists');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).send('Internal server error. Please try again later.');
            }

            const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
            connection.query(insertQuery, [username, hashedPassword, email], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send('Error registering user. Please try again later.');
                }

                console.log('User  registered successfully:', username);
                res.send('Registration successful!');
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`Login Attempt: Username - ${username}`);

    if (!username || !password) {
        return res.status(400).send('All fields are required.');
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error. Please try again later.');
        }

        if (results.length === 0) {
            console.log('User  not found');
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];

        // Remove sensitive logging
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).send('Internal server error. Please try again later.');
            }

            if (isMatch) {
                console.log('Login successful for:', username);
                res.send('Login successful!');
            } else {
                console.log('Incorrect password for:', username);
                res.status(401).send('Invalid username or password');
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});