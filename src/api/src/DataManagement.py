import ast
import csv
from typing import TextIO

class DataHandler(object):
    def __init__(self, location: str, openType: str) -> None:
        try:
            self.location = location
            self.openType = openType
            self.file = open(location, openType)
        except FileNotFoundError:
            raise FileNotFoundError(f"File {location} does not exist")

    def _close(self) -> None:
        self.file.flush()
        self.file.close()

    def _save_file(self, fileText) -> None:
        output = open(self.location, "w")
        output.write(fileText)
        output.flush()
        output.close()

    def _open_new_file(self, location: str, openType: str) -> None:

        try:
            self.location = location
            self.openType = openType
            self.file = open(location, openType)
        except FileNotFoundError:
            raise FileNotFoundError(f"File {location} does NOT exist")

    def _get_file(self) -> TextIO:
        return self.file


class CSVHandler(DataHandler):
    def __init__(self, location: str, toRead: bool) -> None:
        self.toRead = toRead
        super().__init__(location, "r" if toRead else "w")
        self.csv = csv.reader(self.file) if toRead else csv.writer(self.file)

    def write_row(self, row: list) -> None:
        self.csv.writerow(row)

    def get_file(self):
        return self.csv

    def save_file(self) -> None:
        super()._close()


class CSVCompositor(CSVHandler):

    def __init__(self, location: str, headers: list) -> None:
        super().__init__(location, False)
        self.csv.writerow(headers)
        self.lines = 0

    def convert_json_to_csv(self, json: str) -> None:
        json = ast.literal_eval(json)
        for data in json:
            self.csv.writerow(list(data.values()))

    def save_file(self) -> None:
        super().save_file()
