// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from "path";

export const NOX_DISPLAY_NAME = "Nox";
export const NOX_TASK_TYPE = "nox";
export const SCRIPT_PATH = path.join(
    path.dirname(__dirname),
    "bundled",
    "get_tasks.py"
);
