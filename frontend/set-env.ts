// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const targetPath = "./src/environments/environment.prod.ts";
const public_key = process.env['PUBLIC_KEY'];

const modifiedPublicKey = String(public_key).replaceAll(/_/g, '\n').trim();

const envConfigFile = `import { Environment } from "./environment.model";


export const environment: Environment = {
    production: true,
    STORAGE_URL: '${process.env['CLOUDSTORAGE_TRAFFIC_URL']}',
    API_BASE_URL: '${process.env['API_URL']}',
    PUBLIC_KEY: \`${modifiedPublicKey}\`
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
