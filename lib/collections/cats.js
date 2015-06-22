cats = new Mongo.Collection('cats');

Meteor.methods({
    catInsert: function(kitten) {
        cats.insert(kitten);
    }
});

Meteor.methods({
    catUpdate: function(query,cat_id) {
        cats.update({_id: cat_id}, {$set: query});
    }
});