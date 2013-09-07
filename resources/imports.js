define([
    "hr/hr",
    "text!resources/i18n/en.json",
], function(hr) {

    // Define loader for templates
    hr.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    // Define loader for i18n
    hr.Resources.addNamespace("i18n", {
        loader: "require",
        base: "resources/i18n",
        extension: ".json"
    });

    hr.I18n.loadLocale(["en"]);

    return arguments;
});