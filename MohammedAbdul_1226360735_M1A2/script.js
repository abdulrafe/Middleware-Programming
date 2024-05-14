const fs = require('fs');

// Read from a file
fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('Read data:', data);

    // Write to another file
    fs.writeFile('output.txt', data.toUpperCase(), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Data written to output.txt');
    });
});