require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "views/imports",
    "ressources/imports"
], function(_, yapp, args) {
    // Configure yapp
    yapp.configure(args, {
        logLevel: "none"
    });

    // Define base application
    var Application = yapp.Application.extend({
        name: "Doks",
        template: "main.html",
        metas: {
            "description": "Searching documentation made easy",
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        routes: {
            "search/:doc/:q": "search",
            "search/:doc/": "search",
            "search/:doc": "search",
            "api": "modeDoc"
        },
        events: {
            "keyup .search input": "doSearch",
            "change .search select": "doSearch",
            "submit .search form": "doSearch"
        },
        doc: "JavaScript",
        docs: [],

        initialize: function() {
            var self = this;
            Application.__super__.initialize.apply(this, arguments);

            // Create search method with throttle
            this.queryResults = _.throttle(function(doc, q) {
                // Do requests
                self.$(".search").addClass("mode-loading");
                yapp.Requests.getJSON("http://api.doks.io/search?callback=?", {
                    "q": q,
                    "docset": doc
                }).always(function() {
                    self.$(".search").removeClass("mode-loading");
                }).then(function(data) {
                    self.components.results.setResults(data.results);
                    self.$(".search").removeClass("mode-error");
                }, function() {
                    self.$(".search").addClass("mode-error");
                });
            }, 500);

            // Get docs list
            yapp.Requests.getJSON("http://api.doks.io/docs?callback=?").done(function(data) {
                self.docs = _.sortBy(data, _.identity);
                self.run();
            });
            return this;
        },

        templateContext: function() {
            return {
                currentDoc: this.doc,
                docs: this.docs
            }
        },

        /* Route */
        search: function(doc, q) {
            var self = this;
            q = q || "";

            if (_.indexOf(this.docs, doc) < 0) doc = _.first(this.docs);

            this.$(".search input").val(q);
            this.$(".search select").val(doc);
            this.$(".page").removeClass("mode-doc");

            if (_.size(q) > 0) {
                this.$(".search").addClass("mode-results");
            } else {
                this.$(".search").removeClass("mode-results");
                this.components.results.setResults([]);
            }

            this.doc = doc;
            this.queryResults(doc, q);

            return this;
        },

        /* (event) Do search */
        doSearch: function(e) {
            e.preventDefault();
            doc = this.$(".search select").val();
            q = this.$(".search input").val();
            this.router.navigate("search/"+doc+"/"+q);
        },

        /* (event) Mode api doc */
        modeDoc: function() {
            this.search(this.doc, "");
            this.$(".page").addClass("mode-doc");
        }
    });

    var app = new Application();
});