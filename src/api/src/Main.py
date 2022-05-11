"""Main Code Compiling and Handling All Parts of Data"""
import json
import logging
import os
import sys

from DataErrors import *
from DataManagement import *


def compile_all_team_data(targetLocation: str) -> None:
    compiledJSON = open(targetLocation, "w")
    compiledJSON.write("[")

    for index, file in enumerate(os.listdir()):
        if file.find(".json") != -1 and file.find("-") != -1:
            with open(file, "r") as f:
                compiledJSON.write(f.read())

            if index <= len(os.listdir()) - 2:
                logging.critical(index)
                compiledJSON.write(", \n")

    compiledJSON.write("]")


if __name__ == '__main__':
    # Setup
    logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.INFO)

    # Get all configuration parameters
    args = sys.argv[1:]

    working_directory = str()
    target_json = str()
    target_csv = str()
    label_order = list()

    if len(args) == 4:
        working_directory = args[0]
        target_csv = args[1]
        label_order = args[2]

    elif len(args) == 1:
        try:
            config = json.loads(open(args[0], "r").read())
            working_directory = config["Working_Directory"]
            target_json = config["Target_JSON"]
            target_csv = config["Target_CSV"]
            label_order = config["Label_Order"]
        except FileNotFoundError:
            logging.critical(f"Config File Does Not Exist")
            exit(ExitDueToFailure("This Code will Exit"))
        except json.decoder.JSONDecodeError:
            logging.critical(f"Config File is not formatted properly")
            exit(ExitDueToFailure("This Code will Exit"))

    else:
        logging.critical(f"Incorrect Number of Arguments Passed")
        exit(ExitDueToFailure("This Code will Exit"))

    # Check if all parameters are correct
    if None in [working_directory, target_json, target_csv, label_order]:
        logging.critical(f"One of the arguments is of NoneType")
        exit(ExitDueToFailure("This Code will Exit"))

    # Set working directory
    os.chdir(working_directory)

    # Compile all Data into one JSON
    compile_all_team_data(target_json)
    logging.info("Successfully Created Compiled JSON")

    # Compile all Data into one CSV

    compositor = CSVCompositor(target_csv, label_order)
    compositor.convert_json_to_csv(json.dumps(json.loads(open(target_json, "r").read())))
    compositor.save_file()
    logging.info("Successfully Created Compiled CSV")
    logging.info("Done")
