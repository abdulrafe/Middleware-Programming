// Import the required modules 
const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');

debugger

// Create an instance of express 
const app= express();

// we use the 'body-parser' middleware to parse the incoming request bodies 
app.use(bodyParser.urlencoded({ extended: false }));

// Calculate total amount owed
function calculateTotalAmountOwed(loanAmount, interest, loanTermYears) {
    debugger
    const totalInterest = (loanAmount * interest) / 100;
    const totalAmount = loanAmount + totalInterest;
    return totalAmount;
}
debugger
// Set the view engine to ejs 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
console.log('views', path.join(__dirname, 'views'));

// Create a data store for our student data 
debugger
let students = [];

// The GET route for the form 
debugger
app.get('/', (req, res) => { 
    // Render the form and pass in the current student data
    res.render('index', { students: students, calculateTotalAmountOwed: calculateTotalAmountOwed }); 
});

// Define a non-default route handler for "/testroute"
app.get('/about', (req, res) => {
    res.send('This is the About Page');
});

// Define a non-default route handler for "/testroute"
app.get('/testroute', (req, res) => {
    res.render('index', { students: students, calculateTotalAmountOwed: calculateTotalAmountOwed });
});


// The POST route for form submissions
debugger
app.post('/', (req, res) => {
    // Add the submitted student data to our data store 
    students.push(req.body);
    // Redirect back to the form 
    res.redirect('/');
});

// Start the server on a non-default port (3001)
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});


debugger
// Start the server on port 3000
app.listen(3000, () => { 
    console.log('Server is running on port 3000');
});