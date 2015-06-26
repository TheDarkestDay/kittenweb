imageStore = new FS.Store.GridFS('images');

Images = new FS.Collection('images', {
    stores: [imageStore],
    filter: {
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png','jpg']
        },
        onInvalid: function() {
            if (Meteor.isClient)
                alert("Invalid file type to submit");
            else
                console.log("Invalid file type too submit");
        }
    }
});
