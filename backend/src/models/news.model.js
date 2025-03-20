const NewsRepository = require('../repositories/news.repository');

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
}

module.exports = new NewsModel();