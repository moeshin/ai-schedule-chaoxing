# 课表时间

### 请求

`http://jw.lmu.cn/admin/api/getKbxx`

| 参数 | 描述 |
| ---- | ---- |
| xqid | 未知，默认为空 |
| userId | 用户名，一般是学号 |
| xnxq | 学期，例如：`2020-2021-2` |
| role | 身份<br>学生：`xs`<br>教师：`js` |

### 解析

```javascript
(function () {
    function getTime(node) {
        return node.textContent.trim().replace(/(\d+):(\d+)/, function (m, m1, m2) {
            return (m1.length === 1 ? '0' + m1 : m1) + ':' +
                (m2.length === 1 ? '0' + m2 : m2);
        })
    }
    const sectionTimes = [];
    const spans = document.querySelectorAll('#kbsjlist td[class^=col] > span');
    for (const span of spans) {
        const match = span.parentElement.className.match(/^col(\d+)$/);
        if (!match) {
            throw new Error();
        }
        sectionTimes.push({
            section: parseInt(match[1]),
            startTime: getTime(span.firstChild),
            endTime: getTime(span.lastChild)
        });
    }
    console.log(JSON.stringify(sectionTimes)
        .replaceAll('{', '\n    {')
        .replace(/\]$/, '\n]')
    );
})();
```
