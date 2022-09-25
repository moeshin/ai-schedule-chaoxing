/**
 * 提取课程表
 *
 * @link https://github.com/moeshin/ai-schedule-chaoxing
 * @param iframeContent {string}
 * @param frameContent {string}
 * @param dom {Document}
 * @returns {string}
 */
async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
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
        await loadTool('AIScheduleTools');
        const dom = await fetch(path)
            .then(r => r.text())
            .then(t => new DOMParser().parseFromString(t, 'text/html'));
        const xhid = dom.querySelector('#xhid').value;
        const xqdm = dom.querySelector('#xqdm').value;
        const arr = [];
        for (let option of dom.querySelectorAll('#xnxq1>option')) {
            const value = option.value;
            if (value) {
                arr.push(value);
            }
        }
        const xnxq = await AIScheduleSelect({
            contentText: '学年学期',
            selectList: arr,
        });
        return fetch('/admin/pkgl/xskb/sdpkkbList?' + new URLSearchParams({
            xnxq,
            xhid,
            xqdm,
        }))
            .then(r => r.text())
            .then(t => JSON.parse(t))
            .then(data => data.map(info => {
                const xq = info['xqmc'];
                return {
                    name: cleanTag(info['kcmc']) + getType(info['type']),
                    teacher: cleanTag(info['tmc']),
                    position: cleanTag(info['croommc']) + (xq ? `（${xq}）` : ''),
                    sections: [info['djc']],
                    weeks: info['zc'],
                    day: info['xingqi'],
                };
            }))
            .then(data => '<!-- JSON -->' + JSON.stringify(data));
    }
    return element.querySelector('table').outerHTML;
}

function cleanTag(str) {
    console.log(str)
    return new DOMParser().parseFromString(str, 'text/html').body.textContent.trim();
}

const TYPES = ['其他', '理论', '实验', '上机', '实践', '环节']
function getType(type) {
    if (type >= TYPES.length) {
        type = 0;
    }
    return `（${TYPES[type]}）`;
}
