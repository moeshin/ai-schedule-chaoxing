/**
 * 提取课程表
 *
 * @link https://github.com/moeshin/ai-schedule-chaoxing
 * @param iframeContent {string}
 * @param frameContent {string}
 * @param dom {Document}
 * @returns {string}
 */
function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    let element = document.querySelector('[name=username]');
    if (element) {
        const value = element.value;
        if (typeof value === 'string' && value.toUpperCase() === 'PASS') {
            return '<!-- PASS -->';
        }
    }
    const iframe = dom.querySelector('iframe[src$="/queryKbForXsd"]');
    const path = '/admin/pkgl/xskb/queryKbForXsd';
    if (location.pathname.replace(/\/+/g, '/')
        .replace(/\/$/, '') === path) {
        element = dom;
    } else if (iframe) {
        element = iframe.contentDocument;
    } else {
//         alert('「首页」的「个人课表」并不完整！请点击「个人课表」日期右边的省略按钮，或者「学生端」>「信息查询」>「我的课表」');
        open(path, '_self');
        return;
    }
    return element.querySelector('table').outerHTML;
}
