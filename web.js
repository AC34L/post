var express = require("express")
 , url = require("url")
 , swagger = require("swagger-node-express");

var app = express();
app.use(express.bodyParser());
app.use(express.logger('dev'));
swagger.setAppHandler(app);

swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
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
  .addDelete(  resources.models.delete    );

// Configures the app's base path and api version.
swagger.configure(process.env.API_URL || 'http://localhost:8002', '0.1');

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui-1.1.7/');
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

app.listen(4050);
