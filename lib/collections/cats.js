cats = new Mongo.Collection('cats');

Meteor.methods({
    catInsert: function(kitten) {
        cats.insert(kitten);
    }
});