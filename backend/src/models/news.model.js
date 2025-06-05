const NewsRepository = require('../repositories/news.repository');
const ImgUploadModel = require('../models/image-upload.model');

class NewsModel {
    checkUseOfForeignKey = async (params) => {
        const refParams = {
            table: 'news',
            queryParams: {
                gallery: params['id']
            }
        };

        const linkedNewsEntries = await NewsRepository.findAllFiltered(refParams);
        let proceedDeletion, number_of_entries, code;
        let useOfFK = [];
        if(linkedNewsEntries['data'] && linkedNewsEntries['number_of_entries'] === 0) {
            proceedDeletion = true;
            number_of_entries = 0;
            useOfFK = [];
            code = 1;
        } else if(linkedNewsEntries['data'] && linkedNewsEntries['number_of_entries'] > 0) {
            proceedDeletion = false;
            number_of_entries = linkedNewsEntries['number_of_entries'];
            Object.values(linkedNewsEntries['data']).forEach((val) => {
                useOfFK.push(val['gallery']);
            });
            code = 1;
        } else if(!linkedNewsEntries['data']) {
            return {
                body: {
                    db_operation: linkedNewsEntries['db_operation'],
                    error: linkedNewsEntries['error'],
                },
                code: 0,
                msg: 'Error'
            }
        }

        return {
            body: {
                proceedDeletion: proceedDeletion,
                number_of_entries: number_of_entries,
                useOfFK: useOfFK,
            },
            code: code,
            msg: 'Success'
        }
    }

    renamePathNames = (params, replaceValue, newValue) => {
        if((Object.keys(params).length > 0 && params.id && params.imagePath !== null) 
            && params.imagePath.includes(replaceValue)) {
            params['imagePath'] = params['imagePath'].replace(replaceValue, newValue);
            params['thumbnailPath'] = params['thumbnailPath'].replace(replaceValue, newValue);
        }
        return params;
    }

    checkForImageUpdate = async (params, files, existDbEntry) => {        
        // case #1: no new file && no link
        // case #2:  no new file && only link changed
        if(files.length <= 0 && ((!params.gallery && existDbEntry.image_path) 
            || (params.gallery && !existDbEntry.image_path))) {
            return;
        }

        // case #3: no new file && from img to link
        if(files.length <= 0 && existDbEntry.image_path && params.gallery) {
            await ImgUploadModel.handleImageRemoval(params);
            return;
        }

        if(files.length <= 0) {
            return;
        }
        
        // case #4: new file && from old img to new img
        if(files.length > 0 && params.gallery === null && existDbEntry.image_path !== params.imagePath) {
            await ImgUploadModel.handleImageUploads(params, files, existDbEntry, true);
            return;
        }

        await ImgUploadModel.handleImageUploads(params, files, existDbEntry, false);
    }
}

module.exports = new NewsModel();