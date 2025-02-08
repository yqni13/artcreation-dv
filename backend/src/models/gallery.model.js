const GalleryRepository = require('../repositories/gallery.repository');
const { v4: uuidv4 } = require('uuid');

class GalleryModel {
    createID = () => {        
        const uuid = uuidv4();
        return { id: uuid };
    }

    createRefNr = async (params) => {
        let refNr = '';
        const refParams = {
            table: 'gallery',
            queryParams: {
                art_genre: params['artGenre']
            }
        };
        const allRefNr = await GalleryRepository.findAllFiltered(refParams);

        if(allRefNr['number_of_entries'] === 0) {
            refNr = String(params['artGenre'][0].toUpperCase()) + '00001';
        } else {
            const lastElement = allRefNr['db_select'].at(-1);
            let pureNumber = lastElement['reference_nr'].match(/\d/g);
            pureNumber = Number(pureNumber.join(""));
            pureNumber++;
            refNr = String(params['artGenre'][0]).toUpperCase() + String(pureNumber).padStart(5, '0');
        }

        return { referenceNr: refNr };
    }

    checkGenreChange = async (params) => {
        const dataCurrent = await GalleryRepository.findOne({id: params['id']});
        if(params['artGenre'] !== dataCurrent['db_select']['art_genre']) {
            params['referenceNr'] = (await this.createRefNr(params)).referenceNr;
        }

        return params['referenceNr'];
    }
}

module.exports = new GalleryModel();