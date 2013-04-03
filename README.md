### Post Content API

This is a proof of concept project to build a API Content Storage system. 

There is none of the following implemented yet:
* Security
* Persistence
* Backup
* Caching

### Vision
This project 'should' result in a NPM module and/or API-as-a-service. The goal is to create a CMS API that handles the
storage storage and business logic for content. All CMS UI and services would be handled in separate client apps. We hope
to build a few boilerplate CMS clients to demo the concept. 

Approach:
* MongoDB for Storage
* XAuth for API Security and consumption.
* Node.js
* Mongoose for Object Mapping and management.
* REST for all API interatives.
* Swagger for API UI.