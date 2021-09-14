#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import utils

README_NAME = 'README.md'
TAG_ADAPTED_TABLE_START = '\n<!-- Adapted Table Start -->\n'
TAG_ADAPTED_TABLE_END = '\n<!-- Adapted Table End -->\n'


def create_adapted_table():
    schools = utils.load_schools()
    table = '| 使用人数 | 学校 | 系统链接 |\n' \
            '| ---- | ---- | ---- |\n'
    for name in schools:
        school = schools[name]
        school['name'] = name
        table += ('| ![%(name)s]('
                  'https://img.shields.io/badge/dynamic/json?label=&style=flat-square&query=$.usedNum&url='
                  'https%%3A%%2F%%2Fopen-schedule.ai.xiaomi.com%%2Fapi%%2Fcoder%%3Ftb_id%%3D%(id)d)'
                  ' | %(name)s | %(url)s |\n' % school)
    return table


def main():
    readme = utils.read_text(README_NAME)
    start = readme.index(TAG_ADAPTED_TABLE_START) + len(TAG_ADAPTED_TABLE_START)
    end = readme.index(TAG_ADAPTED_TABLE_END)
    with utils.open_text(README_NAME, 'w') as f:
        f.write(readme[:start])
        f.write('\n')
        f.write(create_adapted_table())
        f.write(readme[end:])


if __name__ == '__main__':
    main()
