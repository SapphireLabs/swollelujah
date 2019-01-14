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
    }

   async getLatestStats() {
        if (!this.hasData()) {
            await this.fetchData();
        }

        return this.stats_;
    }

    // TODO: take subset of the raw row data 
    transform(rawRow) {}

    // i dont even know what this is doing anymore
    async fetchData() {
        const rows = await this.fetchSheetRows_();
        console.log()

        for (const row of rows) {
            this.data_[row['date']] = row;

            for (const key in this.statsMap_) {
                const rawKey = this.statsMap_[key];
                if (Number(row[rawKey]) > 0) {
                    this.stats_[key] = Number(row[rawKey]);
                }
            }
        }
    }
}
