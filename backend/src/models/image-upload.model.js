const sharp = require('sharp');
const CloudStorageAPI = require('../services/external/cloud-storage.api');
const { UnexpectedApiResponseException } = require('../utils/exceptions/api.exception');
const Utils = require('../utils/common.utils');

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
            return await sharp(imageBuffer, {failOn: 'none', unlimited: true})
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
            return meta.format === 'webp' ? imageBuffer : await sharp(imageBuffer, {failOn: 'none', unlimited: true}).webp().toBuffer();
        } catch(err) {
            console.log("CONVERT IMAGE TYPE ERROR: ", err);
            throw {
                error: err.message, 
                location: 'failed at func() convertImageType, image-upload.model.js'
            };
        }
    }

    handleImageUploads = async (params, files) => {
        let image = !files[0].buffer ? files : files[0].buffer;
        const imageData = {
            meta: await sharp(image).metadata(),
            path: params['imagePath']
        };

        let thumbnail = !files[0].buffer ? files : files[0].buffer;
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
        } catch(err) {
            console.log("ERROR handleImageUploads: ", err);
            throw new UnexpectedApiResponseException();
        }
    }

    handleImageRemoval = async (params) => {
        try {
            await CloudStorageAPI.deleteImageOnCDN(params['imagePath']);
            await CloudStorageAPI.deleteImageOnCDN(params['thumbnailPath']);
        } catch(err) {
            console.log("ERROR handleImageRemoval: ", err);
            throw new UnexpectedApiResponseException();
        }
    }

    handleImageUpdate = async (params, files, existDbEntry) => {
        // change on file and/or genre needs to delete old/upload new images (new file or changed name => path + refNr)
        try {
            if(files.length === 0 && existDbEntry.art_genre !== params.artGenre) {
                const response = await CloudStorageAPI.readImageFromCDN(existDbEntry.image_path);
                files = await Utils.streamToBuffer(response.Body);
            }
            if(files.length === 0 && existDbEntry.art_genre === params.artGenre) {
                return;
            }            
            await this.handleImageRemoval({imagePath: existDbEntry.image_path, thumbnailPath: existDbEntry.thumbnail_path});
            return await this.handleImageUploads(params, files);
        } catch(err) {
            console.log("ERROR handleImageUpdate: ", err);
            throw new UnexpectedApiResponseException();
        }
    }
}

module.exports = new ImageUpload;