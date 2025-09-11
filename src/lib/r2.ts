
import { S3Client } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 access credentials are not defined in environment variables.');
}

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://89a01d3a07aec76b3caaaac5d9c71e51.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

export { r2Client };
