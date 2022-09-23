function getTotalWeek(infos) {
    let max = 1;
    for (const info of infos) {
        for (const week of info.weeks) {
            max = Math.max(max, week);
        }
    }
    return max;
}

function scheduleTimer({
  parserRes
} = {}) {
    const obj = {};
    if (parserRes) {
        obj.totalWeek = getTotalWeek(parserRes);
    }

    const _obj = null;

    // noinspection PointlessBooleanExpressionJS
    if (_obj) {
        Object.assign(obj, _obj);
    }
    return obj;
}
