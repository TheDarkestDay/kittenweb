posts = new Mongo.Collection('posts');


Meteor.methods({
    postInsert: function(message, thread) {
        var newPost = {
            author: Meteor.user().username,
            thread_id: thread,
            message: message,
            date_created: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        };
        posts.insert(newPost);
    }
});
