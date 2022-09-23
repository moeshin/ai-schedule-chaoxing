#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""
更新 README

已适配列表
"""
import utils
import cfg_schools

README_NAME = 'README.md'
TAG_ADAPTED_TABLE_START = '\n<!-- Adapted Table Start -->\n'
TAG_ADAPTED_TABLE_END = '\n<!-- Adapted Table End -->\n'


def create_adapted_table():
    schools = cfg_schools.data
    table = '| 使用人数 | 学校 | 系统链接 |\n' \
            '| ---- | ---- | ---- |\n'
    for name in schools:
        school = schools[name]
        school['name'] = name
        table += ('| ![%(name)s]('
                  'https://img.shields.io/badge/dynamic/json?label=&style=flat-square&query=$.count&url='
                  'https%%3A%%2F%%2Fapi.moeshin.com%%2Fai-schedule-usage-count%%2F%%3Fsid%%3D%(sid)d%%26pid%%3D%(pid)d)'
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
