filter = {};

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.map(function() {
    this.route('homePage', { path: '/'});
    this.route('newsPage', {path: '/news'});
    this.route('catsPage', { 
        path: '/cats',
        waitOn: function() {
            return [Meteor.subscribe('allCats', Meteor.userId()),Meteor.subscribe('images')];
        }
    });
    this.route('searchResultPage', {
        path: '/result',
        waitOn: function() {
            return [Meteor.subscribe('findCats', filter), Meteor.subscribe('images')];
        }
    });
    this.route('discussPage', { 
        path: '/discuss',
        waitOn: function() {
            return Meteor.subscribe('threads');
        }
    });
    this.route('newThreadPage', { path: '/newthread'});
    this.route('threadPage', {
        path: 'topic/:_id',
        waitOn: function() {
            return Meteor.subscribe('postsInThread', this.params._id);
        }
    });
    this.route('contactsPage', { path: '/contacts' });
    this.route('loginPage', { path: '/login'});
    this.route('crtAccPage', { path: '/signin' });
    this.route('success', { path: '/success' });
    this.route('newCatPage', {path: '/newcat'});
    this.route('myCats', {
        path: '/my',
        waitOn: function() {
            return [Meteor.subscribe('userCats', Meteor.userId()),Meteor.subscribe('images')];
        }
    });
    this.route('catPage', {
        path: 'cats/:_id',
        waitOn: function() {
            return [Meteor.subscribe('concreteCat',this.params._id), Meteor.subscribe('images')];
        },
        data: function() {
            return cats.findOne();
        }
    });
});

Router.onBeforeAction('loading')