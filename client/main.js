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





Template.newCatPage.events({
    "submit #newCatForm": function(event, template) {
        event.preventDefault();
    //    var prevKittens = Meteor.users.find({_id: Meteor.userId()}).fetch()[0].profile.cats;
        var newKitten = {
            owner: Meteor.userId(),
            name: template.find('#catName').value,
            sex: template.find('input:checked').value,
            age: template.find('#catAge').value,
            weight: template.find('#catWeight').value,
            kind: template.find('#catKind').value,
            avatar: imageURL
        }
        Meteor.call('catInsert', newKitten, function(error,result) {
            if (error)
                return alert(error.reason);
            Router.go('/my');
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