Meteor.publish('allCats', function() {
    return cats.find();
});

Meteor.publish('findCats', function(filter) {
    return cats.find(filter);
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

Meteor.publish('threads', function() {
    return threads.find();
});

Meteor.publish('postsInThread', function(threadId) {
    return posts.find({thread_id: threadId});
});