#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os


def replace(text):
    return TEXT.replace(TAG, SPACE + 'sectionTimes: ' + text.strip().replace('\n', SPACE))


SPACE = '\n' + 8 * ' '
TAG = SPACE + '// sectionTimes: []'
DIR = 'section-times'
OUT = 'out'

i = open('scheduleHtmlParser.js', encoding='utf-8')
TEXT = i.read()
i.close()

if not os.path.exists(OUT):
    os.mkdir(OUT)

for name in os.listdir(DIR):
    if name == 'parse.js' or name == 'README.md':
        continue
    path = os.path.join(DIR, name)
    if not os.path.isfile(path):
        continue
    name = name[:name.rindex('.')]
    with open(path, encoding='utf-8') as i:
        out = os.path.join(OUT, name + '.js')
        print(out)
        with open(out, 'w', encoding='utf-8') as o:
            o.write(replace(i.read()))
