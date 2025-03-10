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

exports.getCustomLocaleTimestamp = () => {
    const time = new Date().toLocaleTimeString();
    let rawLocaleDate = new Date().toLocaleDateString(); // dd.mm.yyyy
    
    let day = rawLocaleDate.substring(0, rawLocaleDate.indexOf('.'));
    rawLocaleDate = rawLocaleDate.replace(`${day}.`, '');
    let month = rawLocaleDate.substring(0, rawLocaleDate.indexOf('.'));
    const year = rawLocaleDate.replace(`${month}.`, '');
    
    // need prefix-0 on single digits
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}T${time}.000Z`;
}