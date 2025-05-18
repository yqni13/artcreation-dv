const sharp = require('sharp');
const CloudStorageAPI = require('../services/external/cloud-storage.api');
const { UnexpectedApiResponseException } = require('../utils/exceptions/api.exception');
const Utils = require('../utils/common.utils');
const logger = require('../logger/config.logger').getLogger();

class ImageUpload {
    msg0 = '';
    msg1 = '';

    constructor() {
        this.msg0 = 'Error';
        this.msg1 = 'Success';
    }

    #convertImage = async (imageBuffer, meta, target) => {
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
                .webp()
                .toBuffer()
        } catch(err) {
            console.log("CONVERT IMAGE SIZE & TYPE ERROR: ", err);
            throw {
                error: err.message,
                location: 'failed at func() convertImage, image-upload.model.js'
            }
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
            image = await this.#convertImage(image, imageData.meta, 'image');
            thumbnail = await this.#convertImage(thumbnail, thumbnailData.meta, 'thumbnail');
            
            await CloudStorageAPI.uploadImageOnCDN(image, imageData.path);
            await CloudStorageAPI.uploadImageOnCDN(thumbnail, thumbnailData.path)
        } catch(err) {
            logger.error("ERROR handleImageUploads", {
                error: err.code,
                stack: err.stack,
                context: {
                    method: 'artdv_image_handleImageUploads',
                    params
                }
            });
            throw new UnexpectedApiResponseException();
        }
    }

    handleImageRemoval = async (params) => {
        try {
            await CloudStorageAPI.deleteImageOnCDN(params['imagePath']);
            await CloudStorageAPI.deleteImageOnCDN(params['thumbnailPath']);
        } catch(err) {
            logger.error("ERROR handleImageRemoval", {
                error: err.code,
                stack: err.stack,
                context: {
                    method: 'artdv_image_handleImageRemoval',
                    params
                }
            });
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

            // prevent removal on news if update from linked artwork to new uploaded image
            if(existDbEntry.image_path !== null && existDbEntry.thumbnail_path !== null) {
                await this.handleImageRemoval({imagePath: existDbEntry.image_path, thumbnailPath: existDbEntry.thumbnail_path});
            }
            return await this.handleImageUploads(params, files);
        } catch(err) {
            logger.error("ERROR handleImageUpdate", {
                error: err.code,
                stack: err.stack,
                context: {
                    method: 'artdv_image_handleImageUpdate',
                    params
                }
            });
            throw new UnexpectedApiResponseException();
        }
    }
}

module.exports = new ImageUpload;