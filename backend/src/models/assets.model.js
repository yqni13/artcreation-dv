class AssetsModel {
    renamePathNames = (params, replaceValue, newValue) => {
        params['imagePath'] = params['imagePath'].replace(replaceValue, newValue);
        params['thumbnailPath'] = params['thumbnailPath'].replace(replaceValue, newValue);
        return params;
    }
}

module.exports = new AssetsModel();