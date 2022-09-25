/**
 * 解析课程表
 *
 * @link https://github.com/moeshin/ai-schedule-chaoxing
 * @param html
 * @returns {[]}
 */
function scheduleHtmlParser(html) {
    if (html === '<!-- PASS -->') {
        return [{
            name: 'PASS',
            day: 1,
            position: '',
            sections: [{
                section: 1
            }],
            weeks: [1]
        }];
    }
    let infos = [];
    const tds = $('tbody td.cell');
    const tdsLen = tds.length;
    for (let i = 0; i < tdsLen; ++i) {
        let td = tds[i];
        const children = td.children;
        if (!children || children.length === 0) {
            continue;
        }
        const preset = getPreset(td.attribs);
        let node = children[0];
        if (node.name === 'br') {
            node = node.firstChild;
        }
        try {
            parseCell(infos, preset, node);
        } catch (e) {
            console.error(i, e, td);
        }
    }
    infos = format(infos);
    console.log(infos);
    return infos;
}

function assert(b) {
    if (!b) {
        console.error('Assert');
        throw 'Assert';
    }
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
 * @param node {{}} 第一个节点
 */
function parseCell(infos, preset, node) {
    const info = Object.assign({
        position: ''
    }, preset);

    // debugger
    {
        let n;
        if (node.type === 'text' && (n = node.next) && n.name === 'br' && (n = n.firstChild) && n.type === 'text') {
            // 过滤课程代码
            node = n;
        }
    }
    if (node.type === 'text') {
        // 校区
        info.position += node.data;
        assert(node = node.next);
        assert(node.name === 'br');
        assert(node = node.firstChild);
    }

    assert(node.name === 'a');
    assert(hasOnClick(node, 'openKckb'));
    info.name = $(node).text();

    assert(node = node.next);

    if (node.type === 'text') {
        // 课程类型
        info.name += node.data;
        assert(node = node.next);
    }

    assert(node.name === 'br');
    assert(node = node.firstChild);
    assert(node.name === 'a');
    assert(hasOnClick(node, 'openJskb'));
    info.teacher = $(node).text();

    assert(node = node.next);
    if (node.name === 'br') {
        assert(node = node.firstChild);
    }
    assert(node.type === 'text');
    info.weeks = getWeeks(node.data);

    assert(node = node.next);
    assert(node.name === 'br');

    if ((node = node.firstChild) && node.name === 'a') {
        assert(hasOnClick(node, 'openCrkb'));
        if (info.position.length !== 0) {
            info.position += '-';
        }
        info.position += $(node).text();
        assert(node = node.next);
        assert(node.name === 'br');
        node = node.firstChild;
    }

    infos.push(info);

    if (node && node.type === 'text' && node.data === ' ') {
        node = node.next
    }

    if (node) {
        assert(node.name === 'br');
        assert(node = node.firstChild);
        parseCell(infos, preset, node);
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

/*
完整格式：
课程代码<br>
校区<br>
<a onclick="openKckb()">课程名</a>课程类型（理论、实训等）<br>
<a onclick="openJskb()">老师</a><br>
周次<br>
<a onclick="openCrkb()">教室</a><br>

注意：
课程代码、校区、课程类型与教室可能不存在
*/