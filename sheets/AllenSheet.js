const moment = require('moment');
const AbstractSheet = require('./AbstractSheet');

module.exports = class AllenSheet extends AbstractSheet {
    constructor(rawSheet) {
        super(rawSheet);

        this.stats_ = {
            deadlift: 0,
            ohp: 0,
            bench: 0,
            squat: 0,
            row: 0,
            weight: 0,
        };

        this.statsMap_ = {
            deadlift: 'deadlift1x5',
            ohp: 'ohp5x5',
            bench: 'bench5x5',
            weight: 'weight',
            squat: 'squat5x5',
            row: 'barbellrow5x5',
        }

        this.rows_ = [];
    }

   async getLatestStats() {
        if (!this.hasData()) {
            await this.fetchData();
        }

        return this.stats_;
    }

    // i dont even know what this is doing anymore
    async fetchData() {
        const rows = await this.fetchSheetRows_();
        this.rows_ = rows;

        for (const row of rows) {
            this.data_[row['date']] = row;

            for (const key in this.statsMap_) {
                const rawKey = this.statsMap_[key];
                if (Number(row[rawKey]) > 0) {
                    this.stats_[key] = Number(row[rawKey]);
                }
            }
        }
        return;
    }

    async getTodayRow() {
        if (!this.hasData()) {
            await this.fetchData();
        }

        const today = moment().format('MM/DD/YYYY');

        let i = 0;
        for (const row of this.rows_) {
            if (row.date === today) {
                console.log(row);
                return row;
            }
        }

        throw "THERE IS NO ROW FOR TODAY ON " + today;
    }
    
    async setTodayRow(opts) {
        const optsMap = {
            date: '01/15/2019',
            squat5x5: '140',
            bench5x5: '115',
            barbellrow5x5: '75',
            ohp5x5: '',
            deadlift1x5: '',
            weight: '177.6',
            irontemple: 'TRUE',
            ketodiet: 'TRUE',
            noalcohol: 'TRUE',
            nosmoke: 'TRUE',
            flossbrush2x: '',
            notes: '',
            improvementideas: ''
        }
    }
}
