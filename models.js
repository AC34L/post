exports.models = {
    "Model":{
      "id":"Model",
      "properties":{
        "name":{
          "type":"string"
        }
      }
    },
    "Category":{
      "id":"Category",
      "properties":{
        "id":{
          "type":"long"
        },
        "name":{
          "type":"string"
        }
      }
    },
    "Pet":{
      "id":"Pet",
      "properties":{
        "tags":{
          "items":{
            "$ref":"Tag"
          },
          "type":"Array"
        },
        "id":{
          "type":"long"
        },
        "category":{
          "type":"Category"
        },
        "status":{
          "allowableValues":{
            "valueType":"LIST",
            "values":[
              "available",
              "pending",
              "sold"
            ],
            "valueType":"LIST"
          },
          "description":"pet status in the store",
          "type":"string"
        },
        "name":{
          "type":"string"
        },
        "photoUrls":{
          "items":{
            "type":"string"
          },
          "type":"Array"
        }
      }
    },
    "Tag":{
      "id":"Tag",
      "properties":{
        "id":{
          "type":"long"
        },
        "name":{
          "type":"string"
        }
      }
    }
  }