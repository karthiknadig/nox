// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as proc from "child_process";
import {
    CancellationToken,
    ShellExecution,
    Task,
    TaskScope,
    Uri,
} from "vscode";
import { getInterpreterDetails } from "./python";
import { getWorkspaceFolder } from "./vscodeapi";
import { traceError, traceLog } from "./logging";
import { NOX_TASK_TYPE, SCRIPT_PATH } from "./constants";

interface NoxTask {
    name: string;
    description: string;
    source: string;
}
interface NoxTasks {
    error: string[];
    tasks: NoxTask[];
}

export async function getNoxTasks(token: CancellationToken): Promise<Task[]> {
    const python = await getInterpreterDetails();
    if (!python.path || python.path.length === 0) {
        return Promise.resolve([]);
    }
    const command = python.path[0];
    const args = [...python.path.slice(1), SCRIPT_PATH];
    const workspace = getWorkspaceFolder(Uri.file(command));
    const noxRun = proc.spawn(command, args, { cwd: workspace?.uri.fsPath });

    const promise = new Promise<Task[]>((resolve, reject) => {
        token.onCancellationRequested(() => {
            noxRun.kill();
            reject("Nox task provider cancelled");
        });

        noxRun.stdout.on("data", (data) => {
            const noxTasks: NoxTasks = JSON.parse(data);
            if (
                noxTasks.error &&
                noxTasks.error.length &&
                noxTasks.error.length > 0
            ) {
                noxTasks.error.forEach((err) => traceError(err));
            }
            resolve(
                noxTasks.tasks.map(
                    (t) =>
                        new Task(
                            {
                                type: NOX_TASK_TYPE,
                                task: t.name,
                                command: command,
                                args: ["-m", "nox", "--session", t.name],
                                detail: t.description,
                                label: `${NOX_TASK_TYPE}: ${t.name}`,
                            },
                            TaskScope.Workspace,
                            t.name,
                            NOX_TASK_TYPE,
                            new ShellExecution(
                                `${command} -m nox --session ${t.name}`,
                                {
                                    cwd: workspace?.uri.fsPath,
                                }
                            )
                        )
                )
            );
        });
        noxRun.on("error", (err) => {
            traceError(err);
            reject(err);
        });
    });
    return promise;
}
