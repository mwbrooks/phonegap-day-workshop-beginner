var ConferenceService = function () {

    this.initialize = function () {
        var deferred = $.Deferred();
        this.db = window.openDatabase("conferenceDemoDB", "1.0", "conference Demo DB", 200000);
        this.db.transaction(
            function (tx) {
                createTable(tx);
                addSampleData(tx);
            },
            function (error) {
                console.log('Transaction error: ' + error);
                deferred.reject('Transaction error: ' + error);
            },
            function () {
                console.log('Transaction success');
                deferred.resolve();
            }
        );
        return deferred.promise();
    }

    this.findByName = function (searchKey) {
        var deferred = $.Deferred();
        this.db.transaction(
            function (tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, e.description, e.room, e.time, e.twitter_id, e.pic " +
                    "FROM session e " +
                    "WHERE e.firstName || ' ' || e.lastName LIKE ? " +
                    "GROUP BY e.id ORDER BY e.lastName, e.firstName";

                tx.executeSql(sql, ['%' + searchKey + '%'], function (tx, results) {
                    var len = results.rows.length,
                        sessions = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        sessions[i] = results.rows.item(i);
                    }
                    deferred.resolve(sessions);
                });
            },
            function (error) {
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    }

    this.findById = function (id) {
        var deferred = $.Deferred();
        this.db.transaction(
            function (tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, e.description, e.room, e.time, e.twitter_id, e.pic " +
                    "FROM session e " +
//                    "LEFT JOIN session r ON r.managerId = e.id " +
//                    "LEFT JOIN session m ON e.managerId = m.id " +
                    "WHERE e.id=:id";

                tx.executeSql(sql, [id], function (tx, results) {
                    deferred.resolve(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function (error) {
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    };

    var createTable = function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS session');
        var sql = "CREATE TABLE IF NOT EXISTS session ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "firstName VARCHAR(50), " +
            "lastName VARCHAR(50), " +
            "title VARCHAR(50), " +
            "description VARCHAR(50), " +
            "time VARCHAR(50), " +
            "room VARCHAR(50), " +
            "twitter_id VARCHAR(50), " +
            "pic VARCHAR(50))";
        tx.executeSql(sql, null,
            function () {
                console.log('Create table success');
            },
            function (tx, error) {
                alert('Create table error: ' + error.message);
            });
    }

    var addSampleData = function (tx, sessions) {

        var sessions = [
            { "id":0,"title":"PhoneGap Developer App and the PhoneGap GUI","firstName":"Tim","lastName":"Kim","pic":"timkim.jpeg","time":"9:00am","room":"Ballroom A","twitter_id":"timkim","description":"Developing for PhoneGap just got easier with the newly released PhoneGap GUI that ties in with the PhoneGap Developer App. Learn how to use both to make your PhoneGap development workflow faster and easier than before."},
            { "id":1,"title":"Enterprise: Not just a dirty word any more","firstName":"Bruce","lastName":"Lefebvre","pic":"bruce_lefebvre.png","time":"11:00am","room":"Ballroom C","twitter_id":"brucelefebvre","description":"This talk will focus on the integration of Adobe Experience Manager (AEM) and PhoneGap, affectionately known as PhoneGap Enterprise. We'll cover why you should care (hint: $) and bring you up to speed on what the platform can do for you and your clients."},
            { "id":2,"title":"PhoneGap Build: Building without an SDK","firstName":"Brett","lastName":"Rudd","pic":"brettrudd.jpg","time":"2:00pm","room":"Ballroom D","twitter_id":"brettrudd","description":"This presentation will cover the features of the service, focusing on some of our new-ish features such as our oath support, plugins and debugging. There will also be some exclusive sneak peeks of new features revolved around external and private plugins that will hopefully be open for immediate beta testing!  We’ll end on discussing the future and what is on our roadmap in the coming months."},
            { "id":3,"title":"Many Views: Third Party WebViews on Android","firstName":"Joe","lastName":"Bowser","pic":"joe_bowser.jpg","time":"1:00pm","room":"Ballroom B","twitter_id":"infil00p","description":"Learn about the recent changes in Cordova, and how developers now have the option to use Mozilla's GeckoView in addition to Intel Crosswalk and the default Android WebView on Cordova.  This new feature coming to Cordova on Android finally gives developers a way out of previously irritating bugs that there was no way to work around.  This will go over the ups and downs of developing for different webviews, as well as a demo showing the power of this new feature."},
            { "id":4,"title":"PhoneGap Enterprise","firstName":"Anis","lastName":"Kadri","pic":"anis.png","time":"10:00am","room":"Ballroom F","twitter_id":"aniskadri","description":"Learn more about PhoneGap enterprise. A new way to create and distribute apps inside your enterprise powered by Adobe Marketing Cloud and Adobe Experience Manager. Find out how you can speed up your development cycles and allow your team members to better collaborate in order to easily create mobile apps."},
            { "id":5,"title":"Sneak Peek: Adobe Experience Manager and Mobile","firstName":"Anthony","lastName":"Rumsey","pic":"anthony.jpeg","time":"4:45pm","room":"Ballroom A","twitter_id":"planetrumsey","description":"See a sneak peek demo of the new features coming soon to PhoneGap Enterprise and Adobe Experience Manager."},
            { "id":6,"title":"Workshop: Intro to PhoneGap","firstName":"Michael","lastName":"Brooks","pic":"mwbrooks.jpeg","time":"10:00am","room":"Theater","twitter_id":"mwbrooks","description":"This workshop will provide an introduction to PhoneGap, the philosophy behind it and how to get started quickly using a variety of different tools available. The CLI, PhoneGap Developer App, PhoneGap Build and more will be shown and you will learn about the many frameworks available to choose from when building your mobile apps. You will also be shown debugging techniques and walk away with a solid understanding of what PhoneGap is all about."},
            { "id":7,"title":"Workshop: Architecting PhoneGap Apps ","firstName":"Christophe","lastName":"Coenraets","pic":"christophe.jpg","time":"1:00pm","room":"Theater","twitter_id":"raymondcamden","description":"Learn how to architect large, complex, and native-like PhoneGap apps using HTML, JavaScript, and CSS. We will investigate mobile challenges and find solutions for them as well as learn all about Single Page Architecture, HTML templates, effective touch events, performance techniques, MVC Frameworks and more."},
            { "id":8,"title":"Workshop: PhoneGap and Firefox OS","firstName":"Jason","lastName":"Weathersby","pic":"jasonweathersby.jpeg","time":"3:00pm","room":"Theater","twitter_id":"jasonweathersby","description":"We'll begin with the current status of the Firefox OS Cordova integration, including demos of building and debugging basic Cordova Apps using Firefox’s new Web IDE. The rest of the workshop will be hands-on: we'll help you run your app on a Firefox OS device."},
            { "id":9,"title":"Workshop: Build a PhoneGap App with Ionic+AngularJS","firstName":"Holly","lastName":"Schinsky","pic":"holly.jpg","time":"3:00pm","room":"Theater","twitter_id":"devgirlfl","description":"In this workshop we’ll build a full-blown mobile application from scratch for a real world scenario using PhoneGap and the Ionic+AngularJS framework stack."}
        ];
        var l = sessions.length;
        var sql = "INSERT OR REPLACE INTO session " +
            "(id, firstName, lastName, title, description, time, room, twitter_id, pic) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = sessions[i];
            tx.executeSql(sql, [e.id, e.firstName, e.lastName, e.title, e.description, e.time, e.room, e.twitter_id, e.pic],
                function () {
                    console.log('INSERT success');
                },
                function (tx, error) {
                    alert('INSERT error: ' + error.message);
                });
        }
    }

}