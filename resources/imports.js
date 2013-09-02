define([
    "yapp/yapp",
    "text!resources/i18n/en.json",
], function(yapp) {

    // Define loader for templates
    yapp.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    // Define loader for i18n
    yapp.Resources.addNamespace("i18n", {
        loader: "require",
        base: "resources/i18n",
        extension: ".json"
    });

    yapp.I18n.loadLocale(["en"]);

    return arguments;
});