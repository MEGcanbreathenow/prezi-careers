var modalHandler = function() {
    function createIFrame(url) {
        var iFrame = document.createElement("iframe");
        iFrame.src = url;
        iFrame.scrolling = "auto";
        iFrame.frameborder = "0";
        iFrame.width = "100%";
        iFrame.height = "100%";
        iFrame.setAttribute('allowFullScreen', '');
        iFrame.setAttribute('webkitAllowFullScreen', '');
        iFrame.setAttribute('mozAllowFullScreen', '');

        if (iFrame.addEventListener) {
            iFrame.addEventListener('load', removeSpinner, true);
        } else if (iFrame.attachEvent) {
            iFrame.attachEvent('onload', removeSpinner);
        }
        return iFrame;
    }

    function removeSpinner() {
        $(this).siblings('.spinner').hide();
    }

    function buildEmbedPreziUrl(oid) {
        var url = "/embed/" +  oid + "/?bgcolor=ffffff&lock_to_path=1&autoplay=no&autohide_ctrls=0";
        if (document.domain == "localhost" || document.domain.indexOf('10.0.0') != -1) {
            url = "//prezi.com" + url;
        }
        return url;
    }

    function addIFrame(modalId, url) {
        $(modalId + ' .modal-body').append(createIFrame(url));
    }

    function addIFrameCallback(modalId, url) {
        return function() {
            addIFrame(modalId, url);
        };
    }

    function isOnMobileScreen() {
        return window.innerWidth <= 768;
    }

    function runFunctionIfModalBodyOnlyContainsSpinner(modalId, func) {
        if ($(modalId + ' .modal-body').children().length == 1) {
            func();
        }
    }

    function resetModal(modalId) {
        var $modalBody = $(modalId + ' .modal-body');

        if ($modalBody.children().length == 2) {
            // Setting the HTML again resets a video (stops it from playing)
            $modalBody.html($modalBody.html());
        }
    }

    function addOnModalEventListeners(modalId, func, url, resetOnClose) {
        $(modalId).on('show.bs.modal', function (e) {
            if (!isOnMobileScreen()) {
                runFunctionIfModalBodyOnlyContainsSpinner(modalId, func);
            } else {
                e.preventDefault();
                e.stopPropagation();

                window.location = url;
            }
        });

        if (resetOnClose) {
            $(modalId).on('hidden.bs.modal', function () {
                resetModal(modalId);
            });
        }
    }

    function addPreziModal(modalId, oid) {
        var url = buildEmbedPreziUrl(oid);
        addOnModalEventListeners(modalId, addIFrameCallback(modalId, url), url, false);
    }

    function addVimeoModal(modalId, videoId) {
        var url = '//player.vimeo.com/video/' + videoId;
        addOnModalEventListeners(modalId, addIFrameCallback(modalId, url), url, true);
    }

    function addYoutubeModal(modalId, videoId, isLocalized, shouldAutoplay) {
        var url = '//www.youtube.com/embed/' + videoId;

        var urlParams = {};
        if (isLocalized) {
            urlParams.hl = Site.LANGUAGE;

            // Force loading subtitles if language is not English (currently only works with the Flash-based video player)
            if (Site.LANGUAGE !== 'en') {
                urlParams.cc_load_policy = 1;
            }
        }
        if (shouldAutoplay) {
            urlParams.autoplay = 1;
        }
        url += "?" + $.param(urlParams);

        addOnModalEventListeners(modalId, addIFrameCallback(modalId, url), url, true);
    }

    function setUpSpinners() {
        $('.spinner').spin({zIndex: 0});
    }

    function setUpPage() {
        setUpSpinners();
    }

    return {
        setUpPage: setUpPage,
        addPreziModal: addPreziModal,
        addVimeoModal: addVimeoModal,
        addYoutubeModal: addYoutubeModal
    };
}();

$(document).ready(function () {
    modalHandler.setUpPage();
});
