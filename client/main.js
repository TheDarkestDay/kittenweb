
Template.layout.events({
    "click #logoutBtn": function(event, template) {
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    },
    "click #home-anchor": function(event, template) {
        event.preventDefault();
        if (Meteor.user()) {
            Router.go('/my');
        } else {
            Router.go('/');
        }
    }
});


/*-----------------------------------------------------------
Login/Sign in forms
-------------------------------------------------------------*/

Template.loginPage.events({
    "submit #loginForm": function(event, template) {
        event.preventDefault();
        Meteor.loginWithPassword(
            {username: template.find("#usermail").value},
            template.find("#password").value,
            function(error) {
                if (error) {
                    alert('Unknown combination of username and password')
                } else {
                    Router.go('/my');
                }
            }
        );
    }
});

Template.crtAccPage.events({
    "submit #crtAccForm": function(event, template) {
        event.preventDefault();
        var mail = template.find('#mail').value;
        var confirmMail = template.find('#confirm-mail').value;
        var pass = template.find('#password').value;
        var confirmPass = template.find('#confirm-password').value;
        if (mail === confirmMail && pass == confirmPass) {
            Accounts.createUser({
                username: mail,
                password: pass,
            },function(error) {
                if (error) {
                    alert('This email is already taken')
                } else {
                    Router.go('/my')
                }
            });
        } else {
            alert("Fields doesn't match");
        }
    }
});

Template.catsPage.onRendered(function() {
    $('#rangeSlider').noUiSlider({
                start: [1, 15],
                step: 1,
                orientation: 'horizontal',
                direction: 'ltr',
                margin: 1,
                connect: true,
                range: {
                    'min': 1,
                    'max': 15
                }
            });
    $('#rangeSlider').noUiSlider_pips({
	   mode: 'steps',
	   density: 1
    });
});


Template.catsPage.events({
    "submit .search-cat-form": function(evt, template) {
        event.preventDefault();
        var name = template.find('#catName').value;
        var sex = template.find('input:checked').value;
        var minage = template.find('#catAgeMin').value;
        var maxage = template.find('#catAgeMax').value;
        var minweight = parseInt($('#rangeSlider').val()[0]);
        var maxweight = parseInt($('#rangeSlider').val()[1]); 
        var kind = template.find('#catKind').value ;
        filter = {};
        if (sex != "nope")
            filter["sex"] = sex;
        filter["weight"] = {
            $gte: minweight,
            $lte: maxweight
        };
        if (minage != "")
            filter["age"]["$gte"] = minage;
        if (maxage != "")
            filter["age"]["$lte"] = maxage;
        if (name != "")
            filter["name"] = name;
        if (kind != "")
            filter["kind"] = kind;
        console.log(filter);
        Router.go('/result');
    }
});

Template.searchResultPage.helpers({
    kitty: function() {
        return cats.find();
    }
});



Template.newCatPage.events({
    "submit #newCatForm": function(event, template) {
        event.preventDefault();
    //    var prevKittens = Meteor.users.find({_id: Meteor.userId()}).fetch()[0].profile.cats;
        var newKitten = {
            owner: Meteor.userId(),
            name: template.find('#catName').value,
            sex: template.find('input:checked').value,
            age: parseInt(template.find('#catAge').value),
            weight: parseInt(template.find('#catWeight').value),
            kind: template.find('#catKind').value,
            avatar: imageURL
        }
        Meteor.call('catInsert', newKitten, function(error,result) {
            if (error)
                return alert(error.reason);
            Router.go('/my');
            imageURL = "";
        });
  //     Meteor.users.update({_id: Meteor.userId()}, {$set :{'profile.cats':prevKittens}});
    },
    "change #catImg": function(event,template) {
        event.preventDefault();
        FS.Utility.eachFile(event, function(file) {
            Images.insert(file, function(err, fileObj) {
                imageURL = "cfs/files/images/"+fileObj._id;
            });
        });
    }
});


Template.catPage.helpers({
    viewerIsOwner: function() {
        return (cats.findOne().owner == Meteor.userId());
    }
});

Template.catPage.events({
    "submit #editCatForm": function(event,template) {
        event.preventDefault();
        var newKitten = {};
        newKitten["owner"] = Meteor.userId();
        newKitten["name"] = template.find('#catName').value;
        newKitten["sex"] = template.find('input:checked').value;
        newKitten["age"] = parseInt(template.find('#catAge').value);
        newKitten["weight"] = parseInt(template.find('#catWeight').value);
        newKitten["kind"] = template.find('#catKind').value;
        //newKitten["avatar"] = imageURL;
        Meteor.call("catUpdate", newKitten, cats.findOne()._id, imageURL, function(err, result) {
            if (err) {
                alert(err.reason)
            } else {
                Router.go('/cats');
                imageURL = "";
            }
        });
    },
    "change #catImg": function(event,template) {
        event.preventDefault();
        FS.Utility.eachFile(event, function(file) {
            Images.insert(file, function(err, fileObj) {
                imageURL = "cfs/files/images/"+fileObj._id;
            });
        });
    },
    "click #removeCat": function(event) {
        event.preventDefault();
        Meteor.call("catDelete", cats.findOne()._id, function(err,result) {
            if (err) {
                alert(err.reason);
            } else {
                Router.go('/cats');
            }
        });
    }
});


Template.myCats.helpers({
    kitty: function() {
        return cats.find();
    } 
});


Template.catsPage.helpers({
    kitty: function() {
        return cats.find();
    }
});



Template.discussPage.helpers({
    thread: function() {
        return threads.find();
    }
});

Template.newThreadPage.events({
    "click #crt-thread-btn": function(evt, template) {
        evt.preventDefault();
        console.log('blah');
        var topicName = template.find("#topic-name").value;
        Meteor.call('threadInsert',topicName, function(err, result) {
            if (err)
                alert(err.reason);
            else
                Router.go('/discuss');
        });
    }
});


Template.threadPage.helpers({
    post: function() {
        return posts.find();
    }
});


Template.threadPage.events({
    "submit .write-post": function(evt,template) {
        evt.preventDefault();
        var message_text = template.find('textarea').value;
        var loc = window.location.href.split('/');
        var thread = loc[loc.length-1];
        Meteor.call('postInsert', message_text, thread, function(err,result){
            if (err)
                alert(err.reason);
            else
                template.find('textarea').value = "";
        });
    }
});