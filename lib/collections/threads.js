threads = new Mongo.Collection('threads');

Meteor.methods({
    threadInsert: function(topic) {
        var newThread = {
            name: topic,
            author_id: Meteor.userId(),
            author_name: Meteor.users.findOne().username
        };
        threads.insert(newThread);
    },
});