var mongodb    = require('mongodb');
var mongoose   = require('mongoose');

DbManager = (function() {

  var enabled_auth = true;

  mongoose.connect(process.env.MONGOHQ_URL);

  var db = mongoose;

  var blogSchema = new db.Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });

  db.blogSchema = blogSchema;

  db.blogSchema.methods.findOne = function (cb) {
    return this.model('Blog').find({}, cb);
  }

  // var mongoCon = require('url').parse( process.env.MONGOHQ_URL );
  // mongoCon.auth_ex = mongoCon.auth.split(':');
  // var _dbUser = mongoCon.auth_ex[0];
  // var _dbPass = mongoCon.auth_ex[1];
  // var _dbname = mongoCon.path.replace('/', '');
  // var _server = new mongodb.Server(mongoCon.hostname, parseInt(mongoCon.port), { safe: false });
  // var db     = new mongodb.Db(_dbname, _server, { native_parser: true });

  return {
    getDb: function() {
      return db;
    },
    authenticate: function(client, cb) {
      if (enabled_auth) {
        client.authenticate( _dbUser, _dbPass, function(err, success) { 
          cb(client)
        });
      } else {
        cb(client);
      }
    }
  }
})();

exports.DbManager = DbManager;