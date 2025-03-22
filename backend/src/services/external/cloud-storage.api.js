const Secrets = require('../../utils/secrets.util');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { UnexpectedApiResponseException } = require('../../utils/exceptions/api.exception');

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

    #getReadParams = (key) => {
        return {
            Bucket: Secrets.CLOUDSTORAGE_BUCKET,
            Key: key
        }
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

    readImageFromCDN = async (path) => {
        
        try {
            const storageClient = this.#getS3Client();
            const readParams = this.#getReadParams(path);
            const command = new GetObjectCommand(readParams);
            const result = await storageClient.send(command);
            return result;
        } catch(err) {
            console.log("readImageFromCDN ERROR: ", err);
            throw new UnexpectedApiResponseException('error-readImageFromCDN');
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
            throw new UnexpectedApiResponseException('error-uploadImageOnCDN');
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
            throw new UnexpectedApiResponseException('error-deleteImageOnCDN');
        }
    }
}

module.exports = new CloudStorageAPI;