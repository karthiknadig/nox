# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.


import json
import subprocess
import sys
import traceback
from typing import Dict

SESSION_SOURCE_START = "Sessions defined in "


def parse_tasks(content: str) -> Dict[str, str]:
    source = None
    tasks = []
    for line in content.splitlines():
        if line.startswith(SESSION_SOURCE_START):
            source = line[len(SESSION_SOURCE_START) : -1]
        elif line.startswith(("* ", "- ")):
            name, desc = line[2:].split("->", 1)
            tasks.append(
                {"name": name.strip(), "description": desc.strip(), "source": source}
            )
    return tasks


if __name__ == "__main__":
    result = subprocess.run(
        [sys.executable, "-m", "nox", "--list"],
        encoding="utf-8",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )

    output = {"error": []}
    if result.stderr:
        output["error"] += [result.stderr]

    try:
        tasks = parse_tasks(result.stdout)
        output["tasks"] = tasks
    except Exception:
        output["error"] += traceback.format_exc()

    print(json.dumps(output))
