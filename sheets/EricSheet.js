const AbstractSheet=require('./AbstractSheet')
const moment = require('moment');

module.exports = class EricSheet extends AbstractSheet {
    constructor(rawSheet) {
        super(rawSheet);

        this.stats_ = {};

        this.statsMap_ = {
            exercise: 'exercise',
            noGames: 'no games',
            weight: 'health'
        };
    }

    // TODO : this should use date and not be so hacky
    async getLatestStats() {
        const date = moment().format('M/DD');

        const rawRows = await this.fetchSheetCells_({
            'min-col': 2,
            'max-col': 4,
            'min-row': 2,
            'max-row': 32,
            'return-empty': false
        });
    
        const lastRow = rawRows[rawRows.length-1].row;
        return rawRows
            .filter(row => row.row === lastRow)
            .reduce((total, row) => {
                if (row.col === 2) {
                    total.exercise = row.value;
                } else if (row.col === 3) {
                    total.noGames = row.value;
                } else if (row.col === 4) {
                    total.weight = row.value;
                }
                return total;
            }, {
                exercise: 'none',
                noGames: 'false',
                weight: 0
            })
    }


    async fetchData() {
        return;
    }

}