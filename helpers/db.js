const cloudant = require('cloudant');
const vcap = require('../util/vcapService');

cloudant(vcap.cloudantNoSQLDB[0].credentials.url).db.create('chatsw',()=>{});
const db = cloudant(vcap.cloudantNoSQLDB[0].credentials.url).use('chatsw');


exports.logar = (dados) => {

    db.insert(dados,(err,result) => {
        if(err)
            console.error(err)
    });
}