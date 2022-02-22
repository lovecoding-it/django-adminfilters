var QueryStringFilterHandler = function (element, options) {
    var self = this;
    var config = Object.assign({negated: false, canNegate: true, button: true}, options);
    var $wrapper = django.jQuery(element);
    var $container = $wrapper.find(".filter-content ul.adminfilter");
    var $negate = $container.find("input[type=checkbox]").first();
    var $textarea = $container.find("textarea");
    var $button = $container.find("a.button");
    var qs = $container.data("qs");
    var timer = null;

    var getUrl = function () {
        var url;
        var action = $container.data("action");
        if (action === "clear") {
            url = qs;
        } else if ($textarea.val()) {
            url = qs + "&" + $textarea.data("lk") + "=" + encodeURI($textarea.val());
            url = url + "&" + $negate.data("lk") + "=" + $negate.is(":checked");
        }
        return url;
    };
    self.click = function () {
        var url = getUrl();
        if (url) {
            location.href = url;
        }
    };
    var updateStatus = function () {
        var newAction;
        var changed = ($textarea.val() != $textarea.data("original"))
            || ($negate.is(":checked") != $negate.data("original"));
        if (changed) {
            newAction = "filter";
            console.log("DEBUG", "$value", $textarea, $textarea.val() == $textarea.data("original"), $textarea.val(), $textarea.data("original"));
            console.log("DEBUG", "$negate", $negate, $negate.is(":checked") == $negate.data("original"), $negate.is(":checked"), $negate.data("original"));
        } else {
            newAction = "clear";
        }
        console.log("DEBUG", "newAction", newAction, getUrl());
        $button.html(newAction);
        $container.data("action", newAction);
        $container.attr("data-action", newAction);
        $button.removeClass("filter").removeClass("clear").addClass(newAction);
        timer = null;
    };
    $negate.on("change", function (e) {
        if (timer === null) {
            setTimeout(updateStatus, 500);
        }
    });
    $textarea.on("keyup", function (e) {
        if (e.which === 13 && e.altKey) {
            self.click();
        } else if (timer === null) {
            setTimeout(updateStatus, 500);
        }
    });
    $button.on("click", self.click);
};
