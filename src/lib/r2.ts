
import { S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env para process.env
config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || R2_ACCESS_KEY_ID === 'COLE_AQUI_O_SEU_ACCESS_KEY_ID') {
    console.error('Variáveis de ambiente do R2 não estão completamente definidas ou os placeholders não foram substituídos no ficheiro .env.');
    throw new Error('As variáveis de ambiente do R2 (Account ID, Access Key, Secret Key, Bucket Name) têm de estar definidas no ficheiro .env.');
}

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

export { r2Client };
