var express = require("express"),
    url     = require("url"),
    swagger = require("swagger-node-express");

var app = express();
app.configure(function(){

  app.use(express.bodyParser());

  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/swagger-ui-1.1.7');
  app.set('view options', { layout: false, pretty: false });
  app.set('view engine', 'jade');

  app.use(express.logger('dev'));
  swagger.setAppHandler(app);

  app.use(function(req, res, next) {
    var url = require('url');
    var queryURL = url.parse(req.url, true);
    req.urlparams = queryURL.query;
    next();
  });

  swagger.addValidator(
    function validate(req, path, httpMethod) {

      if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
        var apiKey = req.headers["api_key"];
        if (!apiKey) {
          apiKey = url.parse(req.url,true).query["api_key"]; }
        if ("special-key" == apiKey) {
          return true; 
        }
        return false;
      }

      return true;
    }
  );

});


var resources = require("./resources/index");

// Add models and methods to swagger
swagger.addModels(resources.content.models)
  // Content CRUD
  .addGet(     resources.content.get      )
  .addGet(     resources.content.byTags   )
  .addGet(     resources.content.byStatus )
  .addPost(    resources.content.add      )
  .addPut(     resources.content.update   )
  .addDelete(  resources.content.delete   )

  // Model CRUD
  .addGet(     resources.models.get       )
  .addPost(    resources.models.add       )
  .addPut(     resources.models.update    )
  .addDelete(  resources.models.delete    )
;

// Configures the API's base path and api version.
swagger.configure(process.env.API_URL || 'http://localhost:4000', '0.1');

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui-1.1.7/');

// Direct all root traffic to the UI.
app.get('/', function(req, res) {
  res.redirect('/docs');
});

app.get('/docs/', function(req, res) {
  res.render('index', { API_URL: process.env.API_URL || 'http://localhost:4000'});
});

app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

var port = process.env.PORT || 4000;
app.listen(port, function() { 
  console.log('StartUp: content API ' + port ); 
});

