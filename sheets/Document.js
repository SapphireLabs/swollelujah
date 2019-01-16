const { promisify } = require('util');
const AllenSheet = require('./AllenSheet');
const EricSheet = require('./EricSheet');
const KennySheet = require('./KennySheet')
const SimSheet = require('./SimSheet')

module.exports = class Document { 
    static get ID_ALLEN() { return 'allen' }
    static get ID_ERIC() { return 'eric' }
    static get ID_KENNY() { return 'kenny' }
    static get ID_SIM() { return 'sim' }
    static get ID_LUSE() { return 'luseluseluse' } // FRIG LUSE

    constructor(doc) {
        this.document_ = doc;
        this.sheetByName_ = {};
    }

    async auth_() {
        const useServiceAccountAuthAsync = promisify(this.document_.useServiceAccountAuth);

        try {
            const creds = {
                'client_email': process.env.GOOGLE_CLIENT_EMAIL,
                'private_key': process.env.GOOGLE_PRIVATE_KEY
            }
            await useServiceAccountAuthAsync(creds);
        } catch( e) {
            console.log('auth error', e.message);
        }
    }

    async fetchData() {
        try {
            await this.auth_();
        } catch(e) {
            // suppress
        }
        const getInfoAsync = promisify(this.document_.getInfo);

        let result;
        try {
            result = await getInfoAsync();
        } catch(e) {
            throw e.message;
        }
        
        const rawWorkSheets = result.worksheets;
        rawWorkSheets.forEach(rawWorkSheet => {
            const title = rawWorkSheet.title.toLowerCase();
            this.sheetByName_[title] = rawWorkSheet;
        });

        return;
    } 
    
    get sheets() { 
        return this.sheetByName_;
    }

    /**
     * return an instance of an allen sheet
     */
    get allen() {
        return new AllenSheet(this.sheetByName_[Document.ID_ALLEN]);
    }

    get eric() {
        return new EricSheet(this.sheetByName_[Document.ID_ERIC]);
    }

    get sim() {
        return new SimSheet(this.sheetByName_[Document.ID_SIM]);
    }

    get kenny() {
        return new KennySheet(this.sheetByName_[Document.ID_KENNY]);
    }


    async getDailyStats() {
        const res = {};

        await this.fetchData(); // fetch

        console.log('finished fetch');

        try {
            const eric = this.eric;
            res.eric = await eric.getLatestStats();
            console.log('Eric Stats:', res.eric);
        
            const allen = this.allen;
            res.allen = await allen.getLatestStats()
            console.log('Allen Stats:', res.allen);
        
            const kenny = this.kenny;
            res.kenny = await kenny.getLatestStats()
            console.log('Kenny Stats:', res.kenny);
        
            const sim = this.sim;
            res.sim = await sim.getLatestStats()
            console.log('Sim Stats:', res.sim);

            return res;
        } catch(e) {
            console.log('rekt, ', e.message);
            return "error brah";
        }
    }
}