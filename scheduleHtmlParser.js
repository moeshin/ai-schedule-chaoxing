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

function getWeeks(info, str) {
    const weeks = [];
    try {
        const match = str.match(/^(\d+)(?:-(\d+))?周$/);
        if (match[2] === undefined) {
            return [match[1]];
            return;
        }
        const end = parseInt(match[2]) + 1;
        for (let i = parseInt(match[1]); i < end; ++i) {
            weeks.push(i);
        }
    } catch {}
    return weeks;
}

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

function hasOnClick(node, fun) {
    const attrs = node.attribs;
    return attrs && attrs.onclick.trim().startsWith(fun + '(');
}

function parseCell(infos, preset, node) {
    const info = Object.assign({}, preset);
    let child;
    if (!(
        (node = node.firstChild) &&
        node.name === 'a' &&
        hasOnClick(node, 'openKckb') &&
        (child = node.firstChild) &&
        child.type === 'text' &&
        typeof (info.name = child.data) === 'string' &&
        (node = node.next) &&
        node.type === 'text' &&
        (info.name += node.data) &&
        (node = node.next) &&
        node.name === 'br' &&
        (node = node.firstChild) &&
        node.name === 'a' &&
        hasOnClick(node, 'openJskb') &&
        (child = node.firstChild) &&
        child.type === 'text' &&
        typeof (info.teacher = child.data) === 'string' &&
        (node = node.next) &&
        node.name === 'br' &&
        (node = node.firstChild) &&
        node.type === 'text' &&
        (info.weeks = getWeeks(info, node.data)) &&
        (node = node.next) &&
        node.name === 'br' &&
        (node = node.firstChild) &&
        node.name === 'a' &&
        hasOnClick(node, 'openCrkb')
    )) {
       return;
    }
    if ((child = node.firstChild) && child.type === 'text') {
        info.position = child.data;
    }
    infos.push(info);
    if ((node = node.next) && node.name === 'br' && (child = node.lastChild) && child.name == 'br') {
        parseCell(infos, preset, child);
    }
}

function scheduleHtmlParser(html) {
    const infos = [];
    const tds = $('tbody td.cell');
    const tdsLen = tds.length;
    for (let i = 0; i < tdsLen; ++i) {
        const td = tds[i];
        const children = td.children;
        if (!children || children.length == 0) {
            continue;
        }
        const preset = getPreset(td.attribs);
        parseCell(infos, preset, children[0]);
    }
    console.log(infos);
    return { courseInfos: infos };
}
