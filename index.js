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
const channel = 'CAJVD21MJ';
rtm.on('message', async function(msg) {
    console.log(msg.text);
    if (msg.channel === channel 
        && msg.type === 'message' 
        && msg.text.includes('daily stats')
        ) {
            console.log('triggered!');

            const stats = await swoleSheet.getDailyStats();
            rtm.sendMessage(JSON.stringify(stats), channel);
    }
});
