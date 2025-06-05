const ImgUploads = require('../models/image-upload.model');

class AssetsModel {
    renamePathNames = (params, replaceValue, newValue) => {
        params['imagePath'] = params['imagePath'].replace(replaceValue, newValue);
        params['thumbnailPath'] = params['thumbnailPath'].replace(replaceValue, newValue);
        return params;
    }

    checkForImageUpdate = async (params, files, existDbEntry) => {
        if(files.length <= 0) {
            return;
        } else {
            await ImgUploads.handleImageUploads(params, files, existDbEntry, true);
        }
    }
}

module.exports = new AssetsModel();