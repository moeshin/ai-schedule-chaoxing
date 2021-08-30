/**
 * 解析课程表
 *
 * @link https://github.com/moeshin/ai-schedule-chaoxing
 * @param html
 * @returns {{courseInfos: [], sectionTimes: ?}}
 */
function scheduleHtmlParser(html) {
    let infos = [];
    const tds = $('tbody td.cell');
    const tdsLen = tds.length;
    for (let i = 0; i < tdsLen; ++i) {
        const td = tds[i];
        const children = td.children;
        if (!children || children.length === 0) {
            continue;
        }
        const preset = getPreset(td.attribs);
        parseCell(infos, preset, children[0]);
    }
    infos = format(infos);
    console.log(infos);
    return {
        courseInfos: infos,

        // https://github.com/moeshin/ai-schedule-chaoxing/tree/main/section-times
        // sectionTimes: []
    };
}

/**
 * 获取周
 *
 * 1周
 * 1-2周
 * 1-1,3-3周
 * 1-9(单)周
 * 2-10(双)周
 *
 * @param str {string} 周，例如：1-2周、1周
 * @returns {[]|*[]}
 */
function getWeeks(str) {
    str = str.trim();
    const weeks = [];
    const strLen = str.length;
    if (strLen > 1 && str.substr(-1) === '周') {
        str = str.substr(0, strLen - 1);
        const arr = str.split(',');
        for (const w of arr) {
            const match = w.match(/^(\d+)(?:-(\d+)(?:\(([单双])\))?)?$/);
            let i = parseInt(match[1]);
            if (match[2] === undefined) {
                weeks.push(i);
                continue;
            }
            const end = parseInt(match[2]) + 1;
            const state = match[3];
            if (state === undefined) {
                for (; i < end; ++i) {
                    weeks.push(i);
                }
                continue;
            }
            if (i % 2 === 0) {
                if (state === '单') {
                    ++i;
                }
            } else {
                if (state === '双') {
                    ++i;
                }
            }
            for (; i < end; i += 2) {
                weeks.push(i);
            }
        }
    }
    return weeks;
}

/**
 * 获取预设
 *
 * @param attrs
 * @returns {{day: number, sections: []}}
 */
function getPreset(attrs) {
    const sections = [];
    const match = attrs.id.match(/^Cell(\d)(\d+)$/);
    let i = parseInt(match[2])
    const rowspan = attrs.rowspan;
    const length = i + (rowspan ? parseInt(rowspan): 0);
    for (; i < length; ++i) {
        sections.push({
            section: i
        });
    }
    return {
        day: parseInt(match[1]),
        sections: sections
    }
}

/**
 * 验证 onclick
 *
 * @param node cheerio 节点
 * @param fun 函数名
 * @returns {*|boolean}
 */
function hasOnClick(node, fun) {
    const attrs = node.attribs;
    return attrs && attrs.onclick.trim().startsWith(fun + '(');
}

/**
 * 处理单元
 *
 * @param infos {[]} 全部课程信息
 * @param preset {{}} 预设
 * @param node cheerio 第一个节点
 */
function parseCell(infos, preset, node) {
    const info = Object.assign({}, preset);
    let child;
    if (!(
        (node.name === 'br' ? (node = node.firstChild) : true) &&
        node.name === 'a' &&
        hasOnClick(node, 'openKckb') &&
        (child = node.firstChild) &&
        child.type === 'text' &&
        typeof (info.name = child.data) === 'string' &&
        (node = node.next) &&
        node.type === 'text' &&
        (info.name += node.data) &&
        (info.name = subString(info.name)) &&
        (node = node.next) &&
        node.name === 'br' &&
        (node = node.firstChild) &&
        node.name === 'a' &&
        hasOnClick(node, 'openJskb') &&
        (child = node.firstChild) &&
        child.type === 'text' &&
        typeof (info.teacher = child.data) === 'string' &&
        (info.teacher = subString(info.teacher)) &&
        (node = node.next) &&
        (node.name === 'br' ? (node = node.firstChild) : true) &&
        node.type === 'text' &&
        (info.weeks = getWeeks(node.data)) &&
        (node = node.next) &&
        node.name === 'br' &&
        (node = node.firstChild) &&
        node.name === 'a' &&
        hasOnClick(node, 'openCrkb')
    )) {
        console.error(node, child, info);
        return;
    }
    info.position = subString((child = node.firstChild) && child.type === 'text' ? child.data : '');
    infos.push(info);
    if ((node = node.next) && node.name === 'br' && (child = node.lastChild) && child.name === 'br') {
        parseCell(infos, preset, child);
    }
}

function hash(...args) {
    return args.join('-');
}

function format(infos) {
    const map1 = {};
    for (const info of infos) {
        const weeks = info.weeks;
        const day = info.day;
        const name = info.name;
        const teacher = info.teacher;
        const position = info.position;
        for (const week of weeks) {
            const k = hash(week, day, name, teacher, position);
            let obj = map1[k];
            if (obj === undefined) {
                map1[k] = obj = {
                    name,
                    teacher,
                    position,
                    day,
                    week,
                    sections: []
                };
                obj.sections.toString = function () {
                    let str = '';
                    let first = true;
                    for (const section of this) {
                        if (first) {
                            first = false;
                        } else {
                            str += ',';
                        }
                        str += section.section;
                    }
                    return str;
                }
            }
            obj.sections.push(...info.sections);
        }
    }
    const map2 = {};
    for (const k in map1) {
        const info = map1[k];
        const day = info.day;
        const sections = info.sections;
        const name = info.name;
        const teacher = info.teacher;
        const position = info.position;
        const key = hash(day, sections, name, teacher, position);
        let obj = map2[key];
        if (obj === undefined) {
            map2[key] = obj = {
                name,
                teacher,
                position,
                day,
                sections,
                weeks: []
            };
        }
        obj.weeks.push(info.week);
    }
    return Object.values(map2);
}

function subString(str, length = 19) {
    const len = str.length;
    let i = 0;
    let code;
    for (; i < len && length > 0; ++i) {
        code = str.charCodeAt(i);
        while (--length > 0 && (code /= 0x100) >= 1) {
        }
    }
    if (code >= 0x100) {
        --i;
    }
    return str.substring(0, i)
}

/*
格式：
<br>
<a onclick="openKckb()">课程名</a>
课程类型（理论、实训等）
<br>
<a onclick="openJskb()">老师</a>
<br>
周
<br>
<a onclick="openCrkb()">教室</a>
<br>
*/