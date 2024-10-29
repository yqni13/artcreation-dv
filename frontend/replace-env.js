const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, 'src/environments/environment.prod.ts');

const url = process.env.API_URL || 'http://localhost:3000';

fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        return;
    }

    const result = data.replace(/API_BASE_URL: '.*'/, `API_BASE_URL: '${url}'`);

    fs.writeFile(envFilePath, result, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
            return;
        }
        console.log('API_URL successfully replaced.');
    });
});
