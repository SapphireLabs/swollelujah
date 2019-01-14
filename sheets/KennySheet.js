const AbstractSheet = require('./AbstractSheet')

module.exports = class KennySheet extends AbstractSheet {
    constructor(rawSheet) {
        super(rawSheet)
    }

    async getLatestStats() {
        const rawCells = await this.fetchSheetCells_({
            'min-col': 2,
            'max-col': 3,
            'min-row': 2,
            'max-row': 32,
            'return-empty': false
        });

        // find last row
        let lastRow;
        for (let i = rawCells.length-1; i >= 0; i--) {
            const cell = rawCells[i];

            if (cell.col === 3 && Number(cell.value) > 0) {
                lastRow = cell.row;
                break;
            }
        }

        // data problem
        if (!lastRow) {
            throw "fuk";
        }

        return rawCells
            .filter(row => row.row === lastRow)
            .reduce((total, row) => {
                if (row.col === 2) {
                    total.gym = row.value;
                } else if (row.col === 3) {
                    total.weight = row.value;
                }

                return total;
            }, {
                gym: 'none',
                weight: 0
            })
    }


    async fetchData() {
        return;
    }
}