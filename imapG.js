import GetOwnPropertyKeys from 'es-abstract/2015/getownpropertykeys';

var Imap = require('imap'),
  inspect = require('util').inspect;
var fs = require('fs'), fileStream;
var buffer = '';
var DOMParser = require('dom-parser');
var myMap;
var otp;
var parser = new DOMParser();

export default function (username,password) {
  var imap = new Imap({
      user: username,
      password: password,
      host: "imap.gmail.com", //this may differ if you are using some other mail services like yahoo
      port: 993,
      tls: true,
      connTimeout: 10000, // Default by node-imap 
      authTimeout: 5000, // Default by node-imap, 
      //debug: console.log, // Or your custom function with only one incoming argument. Default: null 
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor 
      searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved 
      markSeen: true, // all fetched email willbe marked as seen and not fetched next time 
      fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`, 
      mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib. 
      attachments: true, // download attachments as they are encountered to the project directory 
      attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments 
    });
    function openInbox(cb) {
      imap.openBox('INBOX', false, cb);
    }
     
    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;
        imap.search(['UNSEEN', ['SUBJECT', 'is your Instagram code']], function (err, results) {
          if (err) throw err;
          for (const uid of results) {
          var f = imap.fetch(results, { bodies: 'HEADER.FIELDS (SUBJECT)', markSeen: true });
          f.on('message', function (msg, seqno) {
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
              stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
                var htmlDoc = parser.parseFromString(buffer);
                var subjectLine = htmlDoc.rawHTML;
                let text =subjectLine;
                let pattern = /\d{6}/;
                let result = text.match(pattern);
                otp = result[0];
              })
              stream.once("end", () => imap.addFlags(uid, "Deleted"));
            });
          f.once('error', function (err) {
            console.log('Fetch error: ' + err);
          });
          f.once('end', function () {
            //imap.addFlags(uid, "Deleted");
            console.log('Done fetching all messages!');
            imap.end();
          });
        });

      }
      });
    });
    });

    imap.once('error', function (err) {
      console.log(err);
     });
     

  imap.connect();
  return new Promise((resolve, reject) => {
    imap.once('end', async function () {
      console.log('Connection ended');
      resolve(otp);
    });
  })
}