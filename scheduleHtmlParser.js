function setWeeks(info, $teacher) {
    const weeks = [];
    try {
        const match = $teacher[0].next.children[0].data.match(/^(\d+)(?:-(\d+))?周$/);
        if (match[2] === undefined) {
            info.weeks = [match[1]];
            return;
        }
        const end = parseInt(match[2]) + 1;
        for (let i = parseInt(match[1]); i < end; ++i) {
            weeks.push(i);
        }
    } catch {}
    info.weeks = weeks;
}

function setSections(info, attrs) {
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
    info.day = parseInt(match[1]);
    info.sections = sections;
}

function scheduleHtmlParser(html) {
    const infos = [];
    const tds = $('tbody td.cell');
    const tdsLen = tds.length;
    for (let i = 0; i < tdsLen; ++i) {
        const td = tds[i];
        if (!td.children || td.children.length == 0) {
            continue;
        }
        const $td = $(td);
        const id = td.attribs.id;

        const $name = $td.find('a[onclick^=openKckb]');
        let = name = $name.text();
        const nameNext = $name[0].next;
        if (nameNext.type = 'text') {
            name += nameNext.data;
        }

        const $teacher = $td.find('a[onclick^=openJskb]');
        const info = {
            name: name,
            teacher: $teacher.text()
        };
        setWeeks(info, $teacher);
        setSections(info, td.attribs);
        const position = $td.find('a[onclick^=openCrkb]').text();
        if (position) {
            info.position = position;
        }
        infos.push(info);
    }
    return { courseInfos: infos };
}
