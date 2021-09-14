import json
import typing

ENCODING = 'utf-8'
schools_file = 'schools.json'


def open_text(file: str, mode: str = 'r', encoding=ENCODING) -> typing.TextIO:
    return open(file, mode, encoding=encoding)


def read_text(file: str) -> str:
    with open_text(file) as f:
        return f.read()


def write_text(file: str, text: str):
    with open_text(file, 'w') as f:
        f.write(text)


def read_json(file: str) -> [dict, list]:
    with open_text(file) as f:
        return json.load(f)


def write_json(file: str, obj: [dict, list]):
    with open_text(file, 'w') as f:
        return json.dump(obj, f, indent=2, ensure_ascii=False)


def load_schools() -> dict[str, dict]:
    return read_json(schools_file)


def save_schools(schools: dict):
    write_json(schools_file, schools)
