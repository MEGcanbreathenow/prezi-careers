$(function(){
    var $root = $('html, body');

    function animateElement(href, scrollTime, easing) {
        $root.animate({
            scrollTop: $(href).offset().top
        }, scrollTime, easing, function () {
            window.location.hash = href;
        });
        return false;
    }

    $('a[data-scroll-smooth="true"]').click(function() {
        var href = $.attr(this, 'href');
        var scrollTime = parseInt($.attr(this, 'data-scroll-time')) || 500;
        var easing = $.attr(this, 'data-scroll-easing') || 'swing';

        animateElement(href, scrollTime, easing);

        return false;
    });
    $('button[data-scroll-smooth="true"]').click(function() {
        var href = $.attr(this, 'href');
        var scrollTime = parseInt($.attr(this, 'data-scroll-time')) || 500;
        var easing = $.attr(this, 'data-scroll-easing') || 'swing';

        animateElement(href, scrollTime, easing);

        return false;
    });
});
