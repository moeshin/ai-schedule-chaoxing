#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os
import sys

import utils
import cfg_schools

SPACE = '\n' + 8 * ' '
TAG = SPACE + '// sectionTimes: []\n'
SRC_DIR = 'section-times'
OUT_DIR = 'out'

DEFAULT = utils.read_text('scheduleHtmlParser.js')
__TAG_INDEX = DEFAULT.index(TAG)
TAG_BEFORE = DEFAULT[:__TAG_INDEX]
TAG_AFTER = DEFAULT[__TAG_INDEX + len(TAG) - 1:]


def build(name) -> [str, None]:
    school = cfg_schools.data[name]
    ext_name = school.get('section-times')
    if ext_name is None:
        return None
    src_path = os.path.join(SRC_DIR, name + '.' + ext_name)
    text = utils.read_text(src_path)
    text = text.strip().replace('\n', SPACE)
    text = SPACE + 'sectionTimes: ' + text
    return TAG_BEFORE + text + TAG_AFTER


def __usage(code=1):
    print("""说明：
构建 scheduleHtmlParser.js
文件保存到 out 文件夹，并以学校名称命名
只有在 schools.json 设置 section-times 属性才会构建

构建全部：
python3 scheduleHtmlParser.py -a

指定学校：
python3 scheduleHtmlParser.py <学校名称>
""")
    exit(code)


def __output(name, text):
    out_path = os.path.join(OUT_DIR, name + '.js')
    print(out_path)
    utils.write_text(out_path, text)


def main():
    argv = sys.argv
    argc = len(argv)
    if argc < 2:
        __usage()
    name = argv[1]
    if name == '-h' or name == '--help':
        __usage(0)
    if not os.path.exists(OUT_DIR):
        os.mkdir(OUT_DIR)
    if name == '-a' or name == '--all':
        for name in cfg_schools.data:
            text = build(name)
            if text is None:
                continue
            __output(name, text)
    else:
        if name not in cfg_schools.data:
            print('找不到该学校：' + name)
        text = build(name)
        if text is None:
            print('没有 section-times 属性')
            return
        __output(name, text)


if __name__ == '__main__':
    main()
