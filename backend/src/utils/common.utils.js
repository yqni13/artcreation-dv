const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/config.logger').getLogger();

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
    // this solution does NOT take care of timezones (neither local nor prod)!
    const time = new Date();
    const date = new Date();
    
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
    const month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : (date.getMonth()+1).toString();

    const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
    const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : `${time.getSeconds()}`;
    
    // need prefix-0 on single digits
    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

exports.getEntryImagePaths = async (repository, params) => {
    const data = await repository.findOne(params);
    return data.body.error
        ? data.body
        : data.body.data === null
            ? null
            : {
                imagePath: data.body.data.image_path,
                thumbnailPath: data.body.data.thumbnail_path
            }
}

exports.parseReqBody = (req, res, next) => {
    try {
        if(req.body && req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
    } catch(err) {
        logger.error("ERROR PARSE REQ BODY", {
            error: err.code,
            stack: err.stack,
            context: {
                method: 'artdv_common_ParseReqBody'
            }
        });
        return res.status(400).json({ message: 'Invalid JSON data in request body' });
    }
    next();
}

exports.streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * 
 * @param {file[]} files 
 * @param {string[]} replaceValue 
 * @param {string[]} newValue 
 * @returns {file[]}
 */
exports.renameFileNames = (files, replaceValue, newValue) => {
    for (let i = 0; i < files.length; i++) {
        if(files[i] && files[i]['originalname'].includes(replaceValue[i])) {
            files[i]['originalname'] = files[i]['originalname'].replace(replaceValue[i], newValue[i]);
        }
    }
    return files;
}

exports.alarmCustomError = (req, customError) => {
    if(!req.customValidationErrors) {
        req.customValidationErrors = [];
    }
    req.customValidationErrors.push(...customError);

    return req;
}