const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, 'src/environments/environment.prod.ts');

const url = process.env.API_URL || 'http://localhost:3000';
const public_key = fs.readFileSync('./public_key.pem', {encoding: 'utf-8'});

fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        return;
    }

    data = data.replace(/API_BASE_URL: '.*'/, `API_BASE_URL: '${url}'`);
    data = data.replace(/PUBLIC_KEY: '.*'/, `PUBLIC_KEY: '${public_key}'`);

    fs.writeFile(envFilePath, data, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
            return;
        }
        console.log('API_URL successfully replaced.');
    });
});
