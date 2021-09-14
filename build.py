#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os

import utils

SPACE = '\n' + 8 * ' '
TAG = SPACE + '// sectionTimes: []\n'
SRC_DIR = 'section-times'
OUT_DIR = 'out'

if not os.path.exists(OUT_DIR):
    os.mkdir(OUT_DIR)

TEXT = utils.read_text('scheduleHtmlParser.js')
INDEX = TEXT.index(TAG)
TEXT_START = TEXT[:INDEX]
TEXT_END = TEXT[INDEX + len(TAG) - 1:]

schools = utils.load_schools()
for name in schools:
    school = schools[name]
    ext_name = school.get(SRC_DIR)
    if ext_name is None:
        continue
    print(name)
    src_name = name + '.' + ext_name
    src_path = os.path.join(SRC_DIR, src_name)
    out_path = os.path.join(OUT_DIR, name + '.js')
    text = utils.read_text(src_path)
    text = text.strip().replace('\n', SPACE)
    text = SPACE + 'sectionTimes: ' + text
    with utils.open_text(out_path, 'w') as f:
        f.write(TEXT_START)
        f.write(text)
        f.write(TEXT_END)
