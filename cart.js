
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;

    
    this.getCart = function(userId, callback) {
        "use strict";

        database.collection('cart').findOne({ "userId": userId }, function(err, user) {
            assert.equal(err, null);
            var userCart = user;
            callback(userCart);
        });
    };


    this.itemInCart = function(userId, itemId, callback) {
        "use strict";

        database.collection('cart').findOne({ "userId": userId }, function(err, user) {
            assert.equal(err, null);
            var userCartItems = user.items;
            var response = null;
            for (var i = 0; i < userCartItems.length; i++) {
                if (itemId == userCartItems[i]._id) {
                    response = userCartItems[i];
                }
            }
            callback(response);
        });
    };


    this.addItem = function(userId, item, callback) {
        "use strict";

        // Will update the first document found matching the query document.
        this.db.collection("cart").findOneAndUpdate(
            // query for the cart with the userId passed as a parameter.
            {userId: userId},
            // update the user's cart by pushing an item onto the items array
            {"$push": {items: item}},
            // findOneAndUpdate() takes an options document as a parameter.
            // Here we are specifying that the database should insert a cart
            // if one doesn't already exist (i.e. "upsert: true") and that
            // findOneAndUpdate() should pass the updated document to the
            // callback function rather than the original document
            // (i.e., "returnOriginal: false").
            {
                upsert: true,
                returnOriginal: false
            },
            // Because we specified "returnOriginal: false", this callback
            // will be passed the updated document as the value of result.
            function(err, result) {
                assert.equal(null, err);
                // To get the actual document updated we need to access the
                // value field of the result.
                callback(result.value);
            });

        /*
          Without all the comments this code looks is written as follows.
        this.db.collection("cart").findOneAndUpdate(
            {userId: userId},
            {"$push": {items: item}},
            {
                upsert: true,
                returnOriginal: false
            },
            function(err, result) {
                assert.equal(null, err);
                callback(result.value);
            });
        */
        
    };


    this.updateQuantity = function(userId, itemId, quantity, callback) {
        "use strict";
        
        if (quantity == 0) {
            database.collection('cart').findOneAndUpdate({ "userId": userId }, { $pull: { items: { _id: itemId } } }, { upsert: true, returnOriginal: false }, function(err, result) {
                assert.equal(err, null);
                callback(result.value);
            });
        } else {
            database.collection('cart').findOneAndUpdate({ "userId": userId, "items._id": itemId }, { $set: { "items.$.quantity" : quantity } }, { upsert: true, returnOriginal: false }, function(err, result) {
                assert.equal(err, null);
                callback(result.value);
            });
        }
    };

    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            quantity: 1,
            reviews: []
        };

        return item;
    }

}


module.exports.CartDAO = CartDAO;