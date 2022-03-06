const { Client } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const SESSION_FILE_PATH = './sessions.js'
let sessionData;

const countryCode = '57'
const number = '3007300582'
const msg = 'Buena tarde'

if(fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH)
}

const client = new Client({
  session: sessionData
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, {small: true})
});

client.on("ready", () => {
  console.log("Client is ready!");

  let chatId = countryCode + number + '@c.us'
  client.sendMessage(chatId, msg)
  .then(res => {
    if(res.id.fromMe){
      console.log('El mensaje fue enviado');
    }
  })
});

client.on('authenticated', (session) => {
  sessionData = session

  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
    if(err){
      console.error(err)
    }
  }) 
})

client.on('auth_failure', (msg) => {
  console.error('Hubo un fallo en autenticación', msg)
})

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    client.searchMessages(msg.from, 'Pong')
  }else if (msg.body == 'Hola'){
    client.searchMessages(msg.from, 'Hola, buena tarde.')
  }
});

client.initialize();
