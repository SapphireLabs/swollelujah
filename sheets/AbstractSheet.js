const { promisify } = require('util');

/**
 * Interface for the sheets
 */
module.exports = class AbstractSheet {
    constructor(rawSheet) {
        this.rawSheet_ = rawSheet;
        this.data_ = {};
    }

    async fetchSheetCells_(options) {
        return promisify(this.rawSheet_.getCells)(options ? options : {});
    }

    async fetchSheetRows_(options) {
        return promisify(this.rawSheet_.getRows)(options ? options : {});
    }

    async getLatestStats() {
        throw 'not implemented';
    }

    async fetchData() {
        throw 'not implemented';
    }

    get rawSheet() {
        return this.rawSheet_;
    }

    hasData() {
        return Object.keys(this.data_).length > 0;
    }
}
