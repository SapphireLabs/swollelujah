require('dotenv').config();

const moment = require('moment');

const GoogleSpreadsheet = require('google-spreadsheet');
const { RTMClient } = require('@slack/client');
const { Document } = require('./sheets');

// script start =================================

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const swoleSheet = new Document(doc);

startBot();
// ============================================

function startBot() {
    const rtm = new RTMClient(process.env.SLACK_TOKEN);

    rtm.start();

    console.log('listening to slack...');
    const WHEYMEN_CHANNEL = 'CAJVD21MJ';
    rtm.on('message', async function(msg) {
        console.log(msg.text);
        if (msg.channel === WHEYMEN_CHANNEL 
            && msg.type === 'message' 
            && msg.text.includes('daily stats')
            ) {
                console.log('triggered!');
                const stats = await swoleSheet.getDailyStats();
                rtm.sendMessage(formatMsg(stats), WHEYMEN_CHANNEL);
        } else if (msg.channel === WHEYMEN_CHANNEL 
            && msg.type === 'message' 
            && msg.text.includes('gj swolefather')) {
        
                rtm.sendMessage('thanks brah', WHEYMEN_CHANNEL);
        }

        if (msg && msg.text && msg.text.toLowerCase().includes('frig luse')) {
            rtm.sendMessage('FRIG LUSE!', msg.channel);
        }
    });
}

function formatMsg(statsJson) {
    let formattedStr = '';

    const date = moment().format('MM/DD/YYYY');
    formattedStr += 'Latest stats as of *'+  date + '*\n\n';

    for (const key in statsJson) {
        let blah = '';
        const user = `*${key.toUpperCase()}*\n`;
        blah += user;

        for (const statKey in statsJson[key]) {
            const statVal = statsJson[key][statKey];
            blah += `- ${statKey}: ${statVal}\n`;
        }

        formattedStr += blah + '\n';
    }

    return formattedStr;
}
