#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os
import os.path
import sys
import json
import http.client

import utils


def api_upload(cookie, name, url, provider, parser) -> dict:
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
    conn.request("POST", "/api/files", payload, header)
    res = conn.getresponse()
    data = res.read()
    return json.loads(data.decode('utf-8'))


def upload(cookie, name, school: dict):
    print('正在上传：' + name)
    if school is None:
        print('找不到该学校：' + name)
        return
    if 'section-times' in school:
        parser = read(os.path.join(OUT_DIR, name + '.js'))
    else:
        parser = default_parser
    data = api_upload(cookie, name, school['url'], default_provider, parser)
    if data['code'] != 0:
        print('upload response err', file=sys.stderr)
        print(data, file=sys.stderr)
        return
    data = data['data']
    school['id'] = data['id']


def read(path):
    with open(path, encoding='utf-8') as f:
        data = f.read()
    return data


def usage():
    print("""后台批量上传

python3 upload.py <cookie> [学校名称]

需要登录后 open-schedule.ai.xiaomi.com Cookie 中 serviceToken、serviceToken.sig 的值，注意要用引号包裹
""")
    exit(1)


OUT_DIR = 'out'
default_provider = read('scheduleHtmlProvider.js')
default_parser = read('scheduleHtmlParser.js')


def main():
    argv = sys.argv
    argc = len(argv)
    if not argc > 1:
        usage()
    cookie = argv[1]
    if not cookie:
        usage()
    name = argv[2] if argc > 2 else None
    schools = utils.load_schools()
    if name is None:
        for name in schools:
            school = schools[name]
            if not school.get('auto', True):
                continue
            upload(cookie, name, school)
    else:
        upload(cookie, name, schools.get(name))
    utils.save_schools(schools)


if __name__ == '__main__':
    main()
