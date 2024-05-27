const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'userdata',
    password: 'root',
    port: 5432,
});

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to handle form submission
app.post('/submit_form', (req, res) => {
    // Extract form data from request body
    const { name, phone, email, service, message } = req.body;

    // Insert form data into the database
    const query = 'SELECT * FROM public.userdata (name, phone, email, service, message) VALUES ($1, $2, $3, $4, $5)';
    const values = [name, phone, email, service, message];

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Error storing form data');
        } else {
            console.log('Form data stored successfully');
            res.status(200).send('Form submitted successfully');
        }
    });
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
