(function () {
    function formatTime(node) {
        return node.textContent.trim().replace(/(\d\d?):(\d\d)/, function (m, m1, m2) {
            return (m1.length === 1 ? '0' + m1 : m1) + ':' +
                (m2.length === 1 ? '0' + m2 : m2);
        })
    }
    function parseTime(time) {
        const match = time.match(/^(\d\d):(\d\d)$/);
        if (!match) {
            throw time;
        }
        return 60 * parseInt(match[1]) + parseInt(match[2]);
    }
    function inTime(s, e, t) {
        return t >= s && t <= e;
    }
    const sectionTimes = [];
    const spans = document.querySelectorAll('#kbsjlist td[class^=col] > span');
    for (const span of spans) {
        const section = parseInt(span.previousSibling.textContent.trim());
        if (isNaN(section)) {
            throw span;
        }
        const s = formatTime(span.firstChild);
        const e = formatTime(span.lastChild);
        if (s === e) {
            continue;
        }
        sectionTimes.push({
            section: section,
            startTime: s,
            endTime: e
        });
    }
    function sortSectionTimes(arr) {
        return arr.sort(function (x, y) {
            if (x.section !== y.section) {
                const xs = parseTime(x.startTime);
                const xe = parseTime(x.endTime);
                const ys = parseTime(y.startTime);
                const ye = parseTime(y.endTime);
                if (!(
                    inTime(xs, xe, ys) || inTime(xs, xe, ye) ||
                    inTime(ys, ye, xs) || inTime(ys, ye, xe)
                )) {
                    if (x.section > y.section) {
                        if (xs > ys) {
                            return 1;
                        }
                    } else {
                        if (xs < ys) {
                            return -1;
                        }
                    }
                }
            }
            throw [x, y, sectionTimes];
        });
    }
    console.log(JSON.stringify(sortSectionTimes(sectionTimes))
        .replaceAll('{', '\n    {')
        .replace(/]$/, '\n]')
    );
})();