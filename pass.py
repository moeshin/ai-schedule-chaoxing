#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import sys
import json
import http.client

import cfg_schools


def api_pass(tid, uid=0, did='00000000000000000000000000000000'):
    conn = http.client.HTTPSConnection('open-schedule.ai.xiaomi.com')
    payload = json.dumps({
        'tb_id': tid,
        'type': 1,
        'userId': uid,
        'deviceId': did
    })
    header = {
        'Content-Type': 'application/json'
    }
    try:
        conn.request("POST", "/api/feedback", payload, header)
    finally:
        conn.close()


def __pass(name, tid):
    print('通过自测：%s %d' % (name, tid))
    api_pass(tid)


def __usage(code=1):
    print("""说明：
批量过自测，快进到审核
在电脑端浏览器的开发者后台调试、测试至少完成一个学校后再使用此功能

全部
python3 pass.py -a

在 schools.json 中设置 auto 为 false，全部上传时此学校不会上传

指定学校：
python3 pass.py <学校名称>

""")
    exit(code)


def main():
    argv = sys.argv
    argc = len(argv)
    if argc < 2:
        __usage()
    name = argv[1]
    if name == '-h' or name == '--help':
        __usage(0)
    schools = cfg_schools.data
    if name == '-a' or name == '--all':
        for name in schools:
            school = schools[name]
            if not school.get('auto', True):
                continue
            __pass(name, school['id'])
    else:
        school = schools.get(name)
        if school is None:
            return
        __pass(name, school['id'])


if __name__ == '__main__':
    main()
