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
    const iframe = dom.querySelector('iframe[src$="/queryKbForXsd"]');
    const path = '/admin/pkgl/xskb/queryKbForXsd';
    let doc;
    if (location.pathname.replace(/\/+/g, '/').replace(/\/$/, '') === path) {
        doc = dom;
    } else if (iframe) {
        doc = iframe.contentDocument;
    }
    if (doc) {
        const table = doc.querySelector('table');
        if (table) {
            return doc.querySelector('table').outerHTML;
        }
    }
    const user = parseUser();
    const data = JSON.parse(request(`/admin/pkgl/xskb/sdpkkbList?xnxq=${user.xq}&xhid=${user.xh}`));

    const _map = {};
    for (const _info of data) {
        const zc = _info.zc;
        const zca = zc.split(',');
        const name = clean(_info.kcmc) + getType(_info.type);
        const teacher = clean(_info.tmc);
        const position = clean(_info.croommc);
        const day = _info.xingqi;
        for (const zco of zca) {
            const arr = zco.split('-');
            const end = parseInt(arr[1]) + 1;
            for (let i = parseInt(arr[0]); i < end; ++i) {
                const k = getKey(i, day, name, teacher, position);
                const info = _map[k] || (_map[k] = {
                    name,
                    teacher,
                    position,
                    day,
                    week: i,
                    sections: []
                });
                info.sections.push(_info.djc);
            }
        }
    }
    const map = {};
    for (const key in _map) {
        const _info = _map[key];
        const day = _info.day;
        const sections = _info.sections;
        const name = _info.name;
        const teacher = _info.teacher;
        const position = _info.position;
        const k = getKey(day, sections, name, teacher, position);
        const info = map[k] || (map[k] = {
            day,
            sections,
            name,
            teacher,
            position,
            weeks: [],
        });
        info.weeks.push(_info.week);
    }
    const infos = Object.values(map);
    return JSON.stringify(infos);
}

/**
 * HTTP 请求
 *
 * @returns {undefined, Object}
 * @param url {string}
 */
function request(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.response;
    }
    return undefined;
}

const XH_PREFIX = '学号：';
const XQ_PREFIX = '当前学年学期：';

/**
 * 解析账号信息
 *
 * @returns {{xh: string, xq: string}}
 */
function parseUser() {
    const info = {};
    const response = request('/admin/xsd/xyjc/xfjc');
    if (response && typeof response === 'string') {
        const parse = new DOMParser();
        const dom = parse.parseFromString(response, "text/html");
        const container = dom.querySelector('#zyfxGridIdGridQuery');
        const elements = container.querySelectorAll('label');
        for (const element of elements) {
            const text = element.textContent.trim();
            let index = text.indexOf(XQ_PREFIX);
            if (index !== -1) {
                info.xq = text.substring(index + XQ_PREFIX.length).trim();
            } else {
                index = text.indexOf(XH_PREFIX);
                if (index !== -1) {
                    info.xh = text.substring(index + XH_PREFIX.length).trim();
                }
            }
        }
    }
    return info;
}

/**
 * 课程类型
 *
 * @param type
 * @returns {string}
 */
function getType(type) {
    switch (type) {
        case 1:
            return '（理论）';
        case 2:
            return '（实验）';
        case 3:
            return '（上机）';
        case 4:
            return '（实践）';
        case 5:
            return '（环节）';
        default:
            return '（其他）';
    }
}

function clean(str) {
    return str.replace(/.*<a.*?>(.*?)<\/a>$/, '$1').trim();
}

function getKey(...args) {
    return args.join('-');
}
