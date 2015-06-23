cats = new Mongo.Collection('cats');

Meteor.methods({
    catInsert: function(kitten) {
        cats.insert(kitten);
    }
});

Meteor.methods({
    catUpdate: function(query,cat_id,imgUrl) {
        if (imgUrl != "")
            query["avatar"] = imgUrl;
        cats.update({_id: cat_id}, {$set: query});
    },
    catDelete: function(cat_id) {
        cats.remove({_id: cat_id});
    }
});
