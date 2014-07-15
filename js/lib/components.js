$(function ($) {

    function isComponent($el) {
        return $el.data("knb-component") !== undefined;
    }

    function createComponent($el) {
        var widgetName = $.camelCase($el.data("knb-component"));
        if ($.knb[widgetName]) {
            $el[widgetName]($el.data());
        } else {
            throw new Error("\"" + widgetName + "\". Component's handler is not defined");
        }
    }

    function testAndCreate($comp){
        var isAutoCreate = !("autoCreate" in $comp.data()) || $comp.data("autoCreate") === true;
        if (isComponent($comp) && isAutoCreate) {
            //console.log($comp);
            createComponent($comp);
        }
    }

    $("[data-knb-component]").each(function(i, el){
        testAndCreate($(el));
    });

    var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver ||
        window.JsMutationObserver;

    var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0, node, len = mutation.addedNodes.length; i < len; i++) {
                node = mutation.addedNodes[i];
                var $nodes = $("*", $(node));
                $nodes.each(function(i, el) {
                    testAndCreate($(el));
                });
            }
        });
    });

    mo.observe(document.body, {
        childList: true,
//	    attributes: true,
        subtree: true
    });

});