#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os
import os.path
import sys
import json
import http.client

import cfg_schools
import utils


def api_upload(cookie, name, url, provider, parser) -> [dict, str]:
    conn = http.client.HTTPSConnection('open-schedule.ai.xiaomi.com')
    payload = json.dumps({
        'url': url,
        'school_name': name,
        'eas': '超星综合教学管理系统',
        'provider_html': provider,
        'parser': parser,
        'status': 0,
        'isvalid': 0,
        'html': "",
        'score': 0
    })
    header = {
        'Content-Type': 'application/json',
        'Cookie': cookie,
    }
    try:
        conn.request("POST", "/api/files", payload, header)
        with conn.getresponse() as res:
            data = res.read()
            try:
                return json.loads(data.decode(utils.ENCODING))
            except json.JSONDecoder:
                return data
    finally:
        conn.close()


def upload(cookie, name, school: dict):
    print('正在上传：' + name)
    if school is None:
        print('找不到该学校：' + name)
        return
    if 'timer' in school:
        parser = read(os.path.join(OUT_DIR, name + '.js'))
    else:
        parser = default_parser
    data = api_upload(cookie, name, school['url'], default_provider, parser)
    if not isinstance(data, dict) or data['code'] != 0:
        print('upload response err', file=sys.stderr)
        print(data, file=sys.stderr)
        return
    # print(data, file=sys.stderr)
    data = data['data']
    school['id'] = data['id']


def read(path):
    with open(path, encoding='utf-8') as f:
        data = f.read()
    return data


def __usage():
    print("""说明：
后台批量上传，快进到自测
在电脑端浏览器的开发者后台调试、测试至少完成一个学校后再使用此功能

python3 upload.py <cookie> [学校名称]

如没有「学校名称」将全部上传
在 schools.json 中设置 auto 为 false，全部上传时此学校不会上传

需要登录后 open-schedule.ai.xiaomi.com Cookie 中 serviceToken、serviceToken.sig 的值，注意要用引号包裹
""")
    exit(1)


OUT_DIR = 'out'
default_provider = read('scheduleHtmlProvider.js')
default_parser = read('scheduleHtmlParser.js')


def main():
    argv = sys.argv
    argc = len(argv)
    if argc < 2:
        __usage()
    cookie = argv[1]
    if not cookie:
        print('缺少 Cookie 参数')
        __usage()
    name = argv[2] if argc > 2 else None
    schools = cfg_schools.data
    if name is None:
        for name in schools:
            school = schools[name]
            if not school.get('auto', True):
                continue
            upload(cookie, name, school)
    else:
        upload(cookie, name, schools.get(name))
    cfg_schools.save()


if __name__ == '__main__':
    main()
