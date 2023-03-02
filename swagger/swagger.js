// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "products",
    "version": "1"
  },
  "paths": {
    "/product/getProductList": {
      "get": {
        "summary": "getProductList",
        "description": "",
        "operationId": "getProductList.get.product/getProductList",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/product/getProductById": {
      "get": {
        "summary": "getProductById",
        "description": "",
        "operationId": "getProductById.get.product/getProductById",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "productId",
            "type": "string",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {
    "DataType": {
      "title": "DataType",
      "type": "string"
    }
  },
  "securityDefinitions": {}
};