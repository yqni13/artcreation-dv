const { v4: uuidv4 } = require('uuid');

exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    };
};

exports.createID = async (repository, table) => {        
    const uuid = uuidv4();
    const key = `${table}_id`
    const refParams = {
        table: table,
        queryParams: {
            [key]: uuid
        }
    };
    if((await repository.findAllFiltered(refParams))['number_of_entries'] === 0) {
        return { id: uuid };
    } else {
        await this.createID(repository, table);
    }
}