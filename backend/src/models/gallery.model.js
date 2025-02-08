const GalleryRepository = require('../repositories/gallery.repository');
const { v4: uuidv4 } = require('uuid');

class GalleryModel {
    createID = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        
        const uuid = uuidv4();
        const refParams = {
            table: 'gallery',
            queryParams: {
                art_genre: params['artGenre']
            }
        };
        let refNr = '';

        const allRefNr = await GalleryRepository.findAllFiltered(refParams);
        if(allRefNr['db_select'].length === 0) {
            refNr = String(params['artGenre'][0].toUpperCase()) + '00001';
        } else {
            const lastElement = allRefNr['db_select'].at(-1);
            let pureNumber = lastElement['reference_nr'].match(/\d/g);
            pureNumber = Number(pureNumber.join(""));
            pureNumber++;
            refNr = String(params['artGenre'][0]).toUpperCase() + String(pureNumber).padStart(5, '0');
        }

        return {
            uuid: uuid,
            referenceNr: refNr
        }
    }
}

module.exports = new GalleryModel();