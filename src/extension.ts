// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";
import { NOX_DISPLAY_NAME, NOX_TASK_TYPE } from "./common/constants";
import { registerLogger } from "./common/logging";
import { NoxTaskProvider } from "./common/noxTaskProvider";
import { initializePython } from "./common/python";
import { createOutputChannel } from "./common/vscodeapi";

export function activate(context: vscode.ExtensionContext) {
    const logger = createOutputChannel(NOX_DISPLAY_NAME);
    context.subscriptions.push(
        logger,
        registerLogger(logger),
        vscode.tasks.registerTaskProvider(NOX_TASK_TYPE, new NoxTaskProvider())
    );

    setImmediate(async () => {
        await initializePython(context.subscriptions);
    });
}

export function deactivate() {}
