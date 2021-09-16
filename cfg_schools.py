import utils

__NAME = 'schools.json'

data: dict[str, dict] = utils.read_json(__NAME)


def save():
    utils.write_json(__NAME, data)
