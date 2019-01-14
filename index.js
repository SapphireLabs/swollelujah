require('dotenv').config();

const GoogleSpreadsheet = require('google-spreadsheet');
const { RTMClient } = require('@slack/client');
const { Document } = require('./sheets');

// script start 

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const rtm = new RTMClient(process.env.SLACK_TOKEN);

const swoleSheet = new Document(doc);
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
            rtm.sendMessage(JSON.stringify(stats), WHEYMEN_CHANNEL);
    } else if (msg.channel === WHEYMEN_CHANNEL 
        && msg.type === 'message' 
        && msg.text.includes('gj swolefather')) {
    
            rtm.sendMessage('thanks brah', WHEYMEN_CHANNEL);
    }
});
