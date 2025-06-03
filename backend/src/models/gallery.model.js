const GalleryRepository = require('../repositories/gallery.repository');
const ImgUploadModel = require('../models/image-upload.model');
const CloudStorageAPI = require('../services/external/cloud-storage.api');
const Utils = require('../utils/common.utils');
const { ArtGenreCode } = require('../utils/enums/art-genre.enum');

class GalleryModel {
    createRefNr = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }
        let refNr = '';
        const refParams = {
            table: 'gallery',
            queryParams: {
                art_genre: params['artGenre']
            }
        };
        const allRefNr = await GalleryRepository.findAllFiltered(refParams);
        const genreCode = ArtGenreCode[params['artGenre'].toUpperCase()];

        if(allRefNr['number_of_entries'] === 0) {
            refNr = `${genreCode}001`;
        } else {
            const lastElement = allRefNr['data'].at(-1);
            let pureNumber = lastElement['reference_nr'].match(/\d/g);
            pureNumber = Number(pureNumber.join(""));
            pureNumber++;
            
            // structure: ArtGenreCode like 'PPL' for 'people' + 3 digits (sequential number with leading zeros)
            refNr = `${genreCode}${String(pureNumber).padStart(3, '0')}`;
        }

        return { referenceNr: refNr };
    }

    checkGenreChange = async (params) => {
        const dataCurrent = await GalleryRepository.findOne({id: params['id']});
        if(params['artGenre'] !== dataCurrent['body']['data']['art_genre']) {
            params['referenceNr'] = (await this.createRefNr(params)).referenceNr;
        }

        return params['referenceNr'];
    }

    parseGalleryRefParams = async (refNr) => {
        return {
            table: 'gallery',
            queryParams: {
                reference_nr: refNr['reference_nr']
            }
        }
    }

    checkForImageUpdate = async (params, files, existDbEntry) => {
        // case #1: no genre change + no img change
        if(files.length <= 0 && existDbEntry.art_genre === params.artGenre) {
            return;
        }

        // case #2: genre change + no img change
        if(files.length <= 0 && existDbEntry.art_genre !== params.artGenre) {
            const response = await CloudStorageAPI.readImageFromCDN(existDbEntry.image_path);
            files = await Utils.streamToBuffer(response.Body);
        }

        // case #3: no genre change + img change
        // case #4: genre change + img change
        await ImgUploadModel.handleImageUpdate(params, files, existDbEntry, true);
    }
}

module.exports = new GalleryModel();