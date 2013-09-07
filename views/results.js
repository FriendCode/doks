define([
    "jQuery",
    "hr/hr"
], function($, hr) {
    var ResultsView = hr.View.extend({
        tagName: "ul",
        className: "component-results",
        template: "results.html",
        events: {
            "click .type": "filterType"
        },
        defaults: {
            results: []
        },
        initialize: function() {
            ResultsView.__super__.initialize.apply(this, arguments);
            this.results = this.options.results;
            return this;
        },
        templateContext: function() {
            return {
                results: this.results
            }
        },

        /* Set results */
        setResults: function(rs) {
            this.results = rs;
            return this.render();
        },

        /* (event) Filter type */
        filterType: function(e) {
            e.preventDefault();
            var type = $(e.currentTarget).data("filter");
            if (type.length > 0) {
                this.$(".filter").removeClass().addClass("filter").addClass("type").addClass(type);
                this.$("li[data-type!='"+type+"']").addClass("filter-hide");
                this.$("li[data-type='"+type+"']").removeClass("filter-hide");
            } else {
                this.$(".filter").removeClass("type");
                this.$("li").removeClass("filter-hide");
            }
        }
    });

    /* Register template component */
    hr.View.Template.registerComponent("results", ResultsView);
    return ResultsView;
});