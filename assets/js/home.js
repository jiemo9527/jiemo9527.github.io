// home.js

// GitHub
function updateGitHub(repository) {
    $('#github-watch img').attr('src', `https://img.shields.io/github/watchers/${repository}.svg?style=social&label=Watch`);
    $('#github-star img').attr('src', `https://img.shields.io/github/stars/${repository}.svg?style=social&label=Star`);
    $('#github-fork img').attr('src', `https://img.shields.io/github/forks/${repository}.svg?style=social&label=Fork`);
};
var repository = $('meta[name=repository]').attr('content');
updateGitHub(repository);
setInterval(function () {
    if (!document.hidden) {
        updateGitHub(repository);
    };
}, 60000);

// version
dayjs.locale('zh-cn');
dayjs.extend(dayjs_plugin_relativeTime);
function updateVersion(timestamp) {
    $('#version img').attr('src', `https://img.shields.io/badge/%E6%9B%B4%E6%96%B0%E4%BA%8E-${encodeURIComponent(dayjs(timestamp).fromNow())}-brightgreen.svg`);
};
var updateAt = $('meta[name=updated_at]').attr('content');
updateVersion(updateAt);
setInterval(function () {
    if (!document.hidden) {
        updateVersion(updateAt);
    };
}, 60000);



// search
$('#search-services').dropdown();

function updateDropdown() {
    $('#search-services').dropdown('set selected', Cookies.get('byr_navi_previous_used_search_service'));
};

function setCookie(name, value) {
    Cookies.set(name, value, {
        expires: 365,
        domain: '.byr-navi.com',
        secure: true
    });
};

function redirect(service, query) {
    if (service.data('transcode')) {
        query = query.replace(new RegExp(service.data('transcode-from'), 'g'), service.data('transcode-to'));
    };
    window.open(`search/?service=${encodeURIComponent(service.text())}&query=${query}&next=${encodeURIComponent(service.data('url').replace('{query}', query))}`, '_blank');
};

// initialize previous used search service
if (Cookies.get('byr_navi_previous_used_search_service') === undefined || Cookies.get('byr_navi_previous_used_search_service') === '' || $(`#${Cookies.get('byr_navi_previous_used_search_service')}`).length === 0) {
    setCookie('byr_navi_previous_used_search_service', $('#search-services').val());
} else {
    updateDropdown();
};

// search button
$('#search-button').click(function () {
    let service = $(`#${$('#search-services').val()}`);
    let query = $('#search-query').val();
    query = encodeURIComponent(query);
    if (query) {
        setCookie('byr_navi_previous_used_search_service', service.val());
        redirect(service, query);
    } else {
        $('#search-div').addClass('error');
        $('#search-query').attr('placeholder', '?????????????????????');
    };
});

// query input: click to select
$('#search-query').click(function () {
    $(this).select();
});

// query input: auto focus
$(document).ready(function () {
    $('#search-query').focus();
});

// query input: press return/enter to submit
$(window).keyup(function (event) {
    let windowTop = $(window).scrollTop();
    let windowHeight = $(window).innerHeight();
    let windowBottom = windowTop + windowHeight;
    let searchBoxTop = $('#search-div').offset().top;
    let searchBoxHeight = $('#search-div').innerHeight();
    let searchBoxBottom = searchBoxTop + searchBoxHeight;
    if (event.key === 'Enter' && searchBoxBottom > windowTop && searchBoxTop < windowBottom) {
        let service = $(`#${$('#search-services').val()}`);
        let query = $('#search-query').val();
        query = encodeURIComponent(query);
        if (query) {
            if ($('#search-query:focus').length > 0) {
                setCookie('byr_navi_previous_used_search_service', service.val());
                redirect(service, query);
            } else {
                $('#search-query').focus().select();
            };
        } else {
            $('#search-div').addClass('error');
            $('#search-query').attr('placeholder', '?????????????????????').focus();
        };
    };
});

// query input: input anything to restore
$('#search-query').keyup(function (event) {
    if (event.key) {
        if ($('#search-query').val()) {
            $('#search-div').removeClass('error');
            $('#search-query').attr('placeholder', '????????????');
        };
    };
});

// initialize customized shortcuts
if (Cookies.get('byr_navi_search_shortcuts')) {
    let shortcuts = JSON.parse(Cookies.get('byr_navi_search_shortcuts'));
    $('#search-shortcuts .ui.label').each(function () {
        if (shortcuts[$(this).data('search-service-id')]) {
            if ($(this).hasClass('hidden')) {
                $(this).removeClass('hidden');
            };
        } else {
            if (!$(this).hasClass('hidden')) {
                $(this).addClass('hidden');
            };
        };
    });
};

// shortcuts
$('#search-shortcuts .ui.label').each(function () {
    $(this).click(function () {
        let service = $(`#${$(this).data('search-service-id')}`);
        let query = $('#search-query').val();
        query = encodeURIComponent(query);
        if (query) {
            setCookie('byr_navi_previous_used_search_service', service.val());
            updateDropdown();
            redirect(service, query);
        } else {
            $('#search-div').addClass('error');
            $('#search-query').attr('placeholder', '?????????????????????');
        };
    });
});

// query suggestions
var sugParams = {
    "XOffset": -3, //??????????????????????????????,??????px
    "YOffset": -2, //??????????????????????????????,??????px
    // "width": $('#search-query').innerWidth(), //????????????????????????px
    "fontColor": "rgba(0, 0, 0, 0.87)", //?????????????????????
    "fontColorHI": "rgba(0, 0, 0, 0.87)", //????????????????????????????????????
    "fontSize": "14px", //????????????
    "fontFamily": "Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif", //????????????
    "borderColor": "rgba(34, 36, 38, 0.14902)", //????????????????????????
    "bgcolorHI": "rgba(0, 0, 0, 0.05)", //??????????????????????????????
    "sugSubmit": false //?????????????????????????????????????????????
};
BaiduSuggestion.bind('search-query', sugParams);
