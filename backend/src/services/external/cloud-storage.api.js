const Secrets = require('../../utils/secrets.util');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

class CloudStorageAPI {
    #getS3Client = () => {
        return new S3Client({
            region: 'auto',
            endpoint: Secrets.CLOUDSTORAGE_ENDPOINT,
            credentials: {
                accessKeyId: Secrets.CLOUDSTORAGE_ACCESS_KEY_ID,
                secretAccessKey: Secrets.CLOUDSTORAGE_SECRET_KEY
            }
        })
    }

    #getUploadParams = (fileBuffer, key) => {
        return {
            Bucket: Secrets.CLOUDSTORAGE_BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: 'image/webp'
        };
    }

    #getDeleteParams = (key) => {
        return {
            Bucket: Secrets.CLOUDSTORAGE_BUCKET,
            Key: key
        }
    }

    uploadImageOnCDN = async (fileBuffer, path) => {
        const storageClient = this.#getS3Client();
        const uploadParams = this.#getUploadParams(fileBuffer, path);

        try {
            const command = new PutObjectCommand(uploadParams);
            await storageClient.send(command);
        } catch(err) {
            console.log("UPLOAD IMAGE ERROR: ", err);
            throw {
                error: err.message,
                location: 'failed at func() uploadImageOnCDN, cloud-storage.api.js'
            };
        }
    }

    deleteImageOnCDN = async (path) => {
        const storageClient = this.#getS3Client();
        const deleteParams = this.#getDeleteParams(path);

        try {
            const command = new DeleteObjectCommand(deleteParams);
            await storageClient.send(command);
        } catch(err) {
            console.log("DELETE IMAGE ERROR: ", err);
            throw {
                error: err.message,
                location: 'failed at func() deleteImageOnCDN, cloud-storage.api.js'
            }
        }
    }
}

module.exports = new CloudStorageAPI;