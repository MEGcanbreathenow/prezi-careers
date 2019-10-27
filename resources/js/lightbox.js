var lightboxModalHandler = function(modalHandler) {
    var enableJSApi = window.Site && window.Site.enableYouTubeJsApi ? '&enablejsapi=1' : '';
    var currentContentId = null;
    var currentContentType = null;

    // Video/content ID in embed URL will be referenced as contentId
    var embeddedContentLinkMap = {
        vidyard: {
            id: "vidyard_contentId",
            dataAttributeTag: "data-vidyard-id",
            link: "https://play.vidyard.com/contentId.html?v=3.1.1",
        },
        youtube: {
            id: "video_contentId",
            dataAttributeTag: "data-video-id",
            link: "//www.youtube.com/embed/contentId?badge=0&autoplay=1&html5=1&rel=0" + enableJSApi,
        },
        prezi: {
            id: "prezi_contentId",
            dataAttributeTag: "data-prezi-oid",
            link: "//prezi.com/embed/contentId/?bgcolor=000000&lock_to_path=1&autoplay=yes&autohide_ctrls=0",
        },
        preziNext: {
            id: "prezi_next_contentId",
            dataAttributeTag: "data-prezi-next-oid",
            link: "https://prezi.com/p/contentId/embed",
        },
        tedTalk: {
            id: "ted_talk_contentId",
            dataAttributeTag: "data-ted-talk-id",
            link: "//embed.ted.com/talks/contentId",
        },
        vimeo: {
            id: "vimeo_contentId",
            dataAttributeTag: "data-vimeo-id",
            link: "https://player.vimeo.com/video/contentId?autoplay=1",
        },
    };

    function centerModals(){
        $('.modal').each(function(i){
            var top = Math.round(($(this).height() - $(this).find('.modal-content').height()) / 2);
            top = top > 0 ? top : 0;
            $(this).find('.modal-content').css("margin-top", top);
        });
    }

    function getContentId(linkMap, element, contentType) {
        return $(element).attr(linkMap[contentType]['dataAttributeTag']);
    }

    function parseContentInfo(linkMap, element) {

        for(var key in linkMap) {
            var tag = linkMap[key].dataAttributeTag;
            if ($(element).attr(tag) !== undefined) {
                currentContentType = key;
                currentContentId = getContentId(linkMap, element, key);
            }
        }
    }

    function logClick() {

        var payload = {
            '_action': 'view_modal',
            '_category': 'lightbox',
            'object': 'video_thumbnail',
            'trigger': 'click',
            'platform': 'Web',
            'user_id': Site.user_id || 0,
            'content_id': currentContentId,
            'content_type': currentContentType,
            'putma_id': $.cookie('__putma'),
        }
        $.jsonlog(payload);
    }

    function openLightBox(element, event) {
        
        if (!currentContentType) {
            console.log('Invalid content tag.');
        } else {
            var embeddedVideoLink = embeddedContentLinkMap[currentContentType].link.replace('contentId', currentContentId);
            var modalId = embeddedContentLinkMap[currentContentType].id.replace('contentId', currentContentId);
            $(element).attr('data-remote', embeddedVideoLink);
            $(element).attr('data-type', 'video');
            $(element).ekkoLightbox({
                'modal_id': 'modal_' + modalId,
                'loadingMessage': '',
                onContentLoaded: centerModals,
                'footer': '<a href="#" data-dismiss="modal" class="pull-right close modal-close"><svg width="17px" height="23px" viewBox="0 0 26 27" version="1.1" xmlns="http://www.w3.org/2000/svg"> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g transform="translate(-389, -14)" fill="#152235"> <g transform="translate(388, 14)"> <rect transform="translate(14, 14) rotate(-45) translate(-14, -14)" x="-3" y="12" width="34" height="5" rx="2"/> <rect transform="translate(14, 14) rotate(45) translate(-14, -14)" x="-3" y="12" width="34" height="5" rx="2"/> </g> </g> </g> </svg></a>'
            });
        }

        if (event) {
            event.preventDefault();
        }
    }

    function setUpLightbox() {
        $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
            parseContentInfo(embeddedContentLinkMap, this);
            logClick();
            openLightBox(this, event);
        });
    }

    function setUpPage() {
        setUpLightbox();
        $('.modal').on('show.bs.modal', centerModals);
        $(window).on('resize', centerModals);
    }

    return {
        setUpPage: setUpPage
    };
}(modalHandler);

$(document).ready(function () {
    lightboxModalHandler.setUpPage();
});
