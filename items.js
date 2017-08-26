

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";
        
        database.collection('item').aggregate(
         [
            { $match: { category: { $exists: true } } },
            { $group: {
                _id: "$category",
                num: { $sum: 1 }
            } },
            { $sort: { "_id.category": 1 } },
            { $project: { _id: 1, num: 1 }}
         ]
        ).toArray(function(err, result) {
            assert.equal(err, null);
            var categories = result;
            
            // get the total number of items in all categories
            
            var count = 0;
            for (var i = 0; i < result.length; i++) {
                count += result[i].num;
            }
            
            var category = {
                _id: "All",
                num: count
            };
            
            // push all category to the results
            categories.push(category);
            
            // send back the results with the all category added
            callback(categories);
            
            });
    };


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
         
        var skipNum = page * itemsPerPage;
        var query = { "category": category };
        if (category == "All") {
            query = {};
        }
        database.collection('item').find(query).limit(itemsPerPage).skip(skipNum).toArray(function(err, result) {
            assert.equal(err, null);
            var pageItems = result;

            callback(pageItems);
        });
    };


    this.getNumItems = function(category, callback) {
        "use strict";
         
        /*

         * Count items by category. 
         */
         
        var query = { "category": category };
        if (category == "All") {
            query = {};
        }
        
        database.collection('item').find(query).count(function(err, count) {
            assert.equal(err, null);
            var numItems = count;
            callback(numItems);
        });
    };


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        var skipNum = page * itemsPerPage;

        database.collection('item').find({ $text: { $search: query } }).limit(itemsPerPage).skip(skipNum).toArray(function(err, result) {
            assert.equal(err, null);
            var pageItems = result;

            callback(pageItems);
        });
    };

    this.getNumSearchItems = function(query, callback) {
        "use strict";
        
        database.collection('item').find({ $text: { $search: query } }).count(function(err, count) {
            assert.equal(err, null);
            var numItems = count;
            callback(numItems);
        });
    };


    this.getItem = function(itemId, callback) {
        "use strict";
        database.collection('item').findOne({ _id: itemId }, function(err, doc) {
            assert.equal(err, null);
            var item = doc;
            callback(item);
        });
    };


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        };
        
        database.collection('item').updateOne({"_id": itemId}, { $push: { "reviews": reviewDoc } }, function(err, update) {
            assert.equal(err, null);
            callback(reviewDoc);
        });

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
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;