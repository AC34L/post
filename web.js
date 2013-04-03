var DbManager  = require('./db').DbManager;
var AppManager = require('./app').AppManager;

var db = DbManager.getDb();

AppManager.start(db);

// db.once('open', function(err, client) {
//   if (client) {
//     // DbManager.authenticate(db, function() {
//       AppManager.start(db);
//     // });  
//   } else {
//     console.log('Sorry, No DB Connection. So no love.', err); 
//   }
// });