const sharp = require('sharp');
const CloudStorageAPI = require('../services/external/cloud-storage.api');

class ImageUpload {
    msg0 = '';
    msg1 = '';

    constructor() {
        this.msg0 = 'Error';
        this.msg1 = 'Success';
    }

    #convertImageSize = async (imageBuffer, meta, target) => {
        if(imageBuffer.error) {
            return imageBuffer;
        }

        const maxValue = target === 'image' ? 2000 : 600;
        let newWidth, newHeight;
        if(meta.width > meta.height) {
            newWidth = maxValue;
            newHeight = Math.ceil((newWidth * meta.height) / meta.width);
        } else {
            newHeight = maxValue;
            newWidth = Math.ceil((newHeight * meta.width) / meta.height);
        }

        try {
            return await sharp(imageBuffer)
                .resize({
                    width: newWidth,
                    height: newHeight
                })
                .toBuffer()
        } catch(err) {
            console.log("CONVERT IMAGE SIZE ERROR: ", err);
            throw {
                error: err.message,
                location: 'failed at func() convertImageSize, image-upload.model.js'
            }
        }
    }

    #convertImageType = async (imageBuffer, meta) => {
        if(imageBuffer.error) {
            return imageBuffer;
        }

        try {
            return meta.format === 'webp' ? imageBuffer : await sharp(imageBuffer).webp().toBuffer();
        } catch(err) {
            console.log("CONVERT IMAGE TYPE ERROR: ", err);
            throw {
                error: err.message, 
                location: 'failed at func() convertImageType, image-upload.model.js'
            };
        }
    }

    handleImageUploads = async (params, files) => {
        let image = files[0].buffer;
        const imageData = {
            meta: await sharp(image).metadata(),
            path: params['imagePath']
        };

        let thumbnail = files[0].buffer;
        const thumbnailData = {
            meta: await sharp(thumbnail).metadata(),
            path: params['thumbnailPath']
        };

        try {
            image = await this.#convertImageType(image, imageData.meta);
            image = await this.#convertImageSize(image, imageData.meta, 'image');
    
            thumbnail = await this.#convertImageType(thumbnail, thumbnailData.meta);
            thumbnail = await this.#convertImageSize(thumbnail, thumbnailData.meta, 'thumbnail');
            
            await CloudStorageAPI.uploadImageOnCDN(image, imageData.path);
            await CloudStorageAPI.uploadImageOnCDN(thumbnail, thumbnailData.path)
            return {body: {code: 1}};
        } catch(err) {
            return {
                body: {
                    error: err
                },
                code: 0,
                msg: this.msg0
            }
        }
    }

    handleImageRemoval = async (params) => {
        try {
            await CloudStorageAPI.deleteImageOnCDN(params['imagePath']);
            await CloudStorageAPI.deleteImageOnCDN(params['thumbnailPath']);
            return {body: {code: 1}};
        } catch(err) {
            return {
                body: {
                    error: err
                },
                code: 0,
                msg: this.msg0
            }
        }
    }

    handleImageUpdate = async (params, files) => {
        if(files.length === 0) {
            return { code: 1 }; // no changes on image
        }
        
        const imgDelete = await this.handleImageRemoval(params);
        return imgDelete.body.error ? imgDelete : this.handleImageUploads(params, files);
    }
}

module.exports = new ImageUpload;