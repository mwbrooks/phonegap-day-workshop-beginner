var SessionListView = function () {

    var sessions;

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setSessions = function(list) {
        sessions = list;
        this.render();
    }

    this.render = function() {
        this.$el.html(this.template(sessions));
        return this;
    };

    this.initialize();

}