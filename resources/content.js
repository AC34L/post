var sw    = require("swagger-node-express");
var param = sw.params;
var url   = require("url");
var swe   = sw.errors;
var db    = require('../db').DbManager.getDb();
var petData = require("../data.js");
var mongoose = require ("mongoose");

function writeResponse (res, data) {
  sw.setHeaders(res);
  res.send(JSON.stringify(data));
}

exports.models = require("../models.js");

exports.byStatus = {
  'spec': {
    "description" : "Documents by Status",  
    "path" : "/content.{format}/findByStatus",
    "notes" : "Multiple status values can be provided with comma-separated strings",
    "summary" : "Find Content Document by Status.",
    "method": "GET",    
    "params" : [
      param.query("status", "Status of the content", "string", true, true, "LIST[draft,published,archived]", "draft")
    ],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('status')],
    "nickname" : "findDocumentsbyStatus"
  },  
  'action': function (req,res) {
    var statusString = url.parse(req.url,true).query["status"];
    if (!statusString) {
      throw swe.invalid('status'); }

    var output = petData.findPetByStatus(statusString);
    res.send(JSON.stringify(output));
  }
};

exports.byTags = {
  'spec': {
    "path" : "/content.{format}/findByTags",
    "notes" : "Multiple tags can be provided with comma-separated strings. Use tag1, tag2, tag3 for testing.",
    "summary" : "Find Document Tags",
    "method": "GET",    
    "params" : [param.query("tags", "Tags to filter by", "string", true, true)],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('tag')],
    "nickname" : "findDocumentsbyTags"
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
    "path" : "/content.{format}/{id}",
    "notes" : "Get Content Document",
    "summary" : "Get a Content Document",
    "method": "GET",    
    "params" : [param.query("tags", "Tags to filter by", "string", true, true)],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('tag')],
    "nickname" : "getContent"
  },
  'action': function (req,res) {
    // var tagsString = url.parse(req.url,true).query["tags"];
    // if (!tagsString) {
    //   throw swe.invalid('tag'); }
    // var output = petData.findPetByTags(tagsString);
    // writeResponse(res, output);

    // var Blog = db.model('Blog', db.blogSchema);

    // Blog.find({}).exec(function(err, data) {
    //   console.log(data);
    // });

    res.send('here we are');
  }
};

exports.add = {
  'spec': {
    "path" : "/content.{format}",
    "notes" : "Add content.",
    "summary" : "Add a new content document",
    "method": "POST",
    "params" : [param.post("document", "New Document model")],
    "errorResponses" : [swe.invalid('input')],
    "nickname" : "addPet"
  },  
  'action': function(req, res) {

    console.log(db);

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

    var Blog = mongoose.model('Blog', blogSchema);

    var blog = new Blog({ title: 'My First Post' });

    blog.save(function(err, data) {
      console.log(data);
    });
    res.send('here now');

    // var body = req.body;
    // if(!body || !body.id){
    //   throw swe.invalid('pet');
    // }
    // else{
    //   petData.addPet(body);
    //   res.send(200);
    // }  
  }
};

exports.update = {
  'spec': {
    "path" : "/content.{format}",
    "notes" : "Update Content.",
    "method": "PUT",    
    "summary" : "Update Content",
    "params" : [param.post("Pet", "Pet object that needs to be updated in the store", "{\n  \"id\": 3,\n  \"category\": {\n    \"id\": 2,\n    \"name\": \"Cats\"\n  },\n  \"name\": \"Cat 3\",\n  \"urls\": [\n    \"url1\",\n    \"url2\"\n  ],\n  \"tags\": [\n    {\n      \"id\": 3,\n      \"name\": \"tag3\"\n    },\n    {\n      \"id\": 4,\n      \"name\": \"tag4\"\n    }\n  ],\n  \"status\": \"available\"\n}")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet'), swe.invalid('input')],
    "nickname" : "addPet"
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
    "path" : "/content.{format}/{id}",
    "notes" : "Delete Content Document",
    "method": "DELETE",
    "summary" : "Delete Content Document.",
    "params" : [param.path("id", "ID of pet that needs to be removed", "string")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet')],
    "nickname" : "deleteContent" 
  },  
  'action': function(req, res) {
    var id = parseInt(req.params.id);
    petData.deletePet(id)
    res.send(200);
  }
};