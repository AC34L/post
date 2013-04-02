var sw    = require("swagger-node-express");
var param = sw.params;
var url   = require("url");
var swe   = sw.errors;

var petData = require("../data.js");

function writeResponse (res, data) {
  sw.setHeaders(res);
  res.send(JSON.stringify(data));
}

exports.models = require("../models.js");

exports.get = {
  'spec': {
    "path" : "/model.{format}/list",
    "notes" : "Get Content Models",
    "summary" : "Get a all Content Models",
    "method": "GET",    
    "params" : [],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('tag')],
    "nickname" : "getAllModels"
  },
  'action': function (req,res) {
    var tagsString = url.parse(req.url,true).query["tags"];
    if (!tagsString) {
      throw swe.invalid('tag'); }
    var output = petData.findPetByTags(tagsString);
    writeResponse(res, output);
  }
};

exports.get = {
  'spec': {
    "path" : "/model.{format}/{id}",
    "notes" : "Get Content Model",
    "summary" : "Get a Content Model",
    "method": "GET",    
    "params" : [param.query("tags", "Tags to filter by", "string", true, true)],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('tag')],
    "nickname" : "getModel"
  },
  'action': function (req,res) {
    var tagsString = url.parse(req.url,true).query["tags"];
    if (!tagsString) {
      throw swe.invalid('tag'); }
    var output = petData.findPetByTags(tagsString);
    writeResponse(res, output);
  }
};

exports.add = {
  'spec': {
    "path" : "/model.{format}",
    "notes" : "Add Content Model",
    "summary" : "Add a new Content Model",
    "method": "POST",
    "params" : [param.post("Pet", "Pet object that needs to be added to the store")],
    "errorResponses" : [swe.invalid('input')],
    "nickname" : "addContentModel"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('pet');
    }
    else{
      petData.addPet(body);
      res.send(200);
    }  
  }
};

exports.update = {
  'spec': {
    "path" : "/model.{format}",
    "notes" : "Update Content Model.",
    "method": "PUT",    
    "summary" : "Update a Content Model",
    "params" : [param.post("Pet", "Pet object that needs to be updated in the store", "{\n  \"id\": 3,\n  \"category\": {\n    \"id\": 2,\n    \"name\": \"Cats\"\n  },\n  \"name\": \"Cat 3\",\n  \"urls\": [\n    \"url1\",\n    \"url2\"\n  ],\n  \"tags\": [\n    {\n      \"id\": 3,\n      \"name\": \"tag3\"\n    },\n    {\n      \"id\": 4,\n      \"name\": \"tag4\"\n    }\n  ],\n  \"status\": \"available\"\n}")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet'), swe.invalid('input')],
    "nickname" : "updateContentModel"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('pet');
    }
    else {
      petData.addPet(body);
      res.send(200);
    }
  }
};

exports.delete = {
  'spec': {
    "path" : "/model.{format}/{id}",
    "notes" : "Delete Content Document",
    "method": "DELETE",
    "summary" : "Delete Content Model.",
    "params" : [param.path("id", "ID of pet that needs to be removed", "string")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet')],
    "nickname" : "deleteContentModel" 
  },  
  'action': function(req, res) {
    var id = parseInt(req.params.id);
    petData.deletePet(id)
    res.send(200);
  }
};
