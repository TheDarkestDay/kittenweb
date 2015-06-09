Meteor.publish('allCats', function() {
    return cats.find();
});

Meteor.publish('userCats', function(owner) {
    return cats.find({owner: owner});
});

Meteor.publish('concreteCat', function(catId) {
    return cats.find({_id: catId});
});

Meteor.publish('images', function() {
    return Images.find();
});