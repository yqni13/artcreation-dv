// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
require('dotenv').config();
let targetPath, public_key;
switch(process.env['BUILD_MODE']) {
    case('staging'): {
        targetPath = "./src/environments/environment.stag.ts";
        public_key = process.env['PUBLIC_KEY'];
        break;
    }
    case('production'):
    default: {
        targetPath = "./src/environments/environment.prod.ts";
        public_key = process.env['PUBLIC_KEY'];
    }
}

const modifiedPublicKey = String(public_key).replaceAll(/_/g, '\n').trim();

const envConfigFile = `import { Environment } from "./environment.model";

export const environment: Environment = {
    BUILD_MODE: '${process.env['BUILD_MODE']}',
    STORAGE_URL: '${process.env['CLOUDSTORAGE_TRAFFIC_URL']}',
    API_BASE_URL: '${process.env['API_URL']}',
    IV_POSITION: ${process.env['IVPOSITION']},
    AES_PASSPHRASE: '${process.env['AESPASSPHRASE']}',
    PUBLIC_KEY: \`${modifiedPublicKey}\`
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
