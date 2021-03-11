# 课表时间

可以无参数、无登录

### 请求

`/admin/api/getKbxx`

| 参数 | 描述 |
| ---- | ---- |
| xqid | 未知，默认为空 |
| userId | 用户名，一般是学号 |
| xnxq | 学期，例如：`2020-2021-2` |
| role | 身份<br>学生：`xs`<br>教师：`js` |

### 解析

在浏览器执行 [parse.js](parse.js) 里的代码
