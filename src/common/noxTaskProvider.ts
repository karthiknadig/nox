// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CancellationToken, ProviderResult, Task, TaskProvider } from "vscode";
import { getNoxTasks } from "./pythonUtils";

export class NoxTaskProvider implements TaskProvider {
    provideTasks(token: CancellationToken): ProviderResult<Task[]> {
        return getNoxTasks(token);
    }
    resolveTask(task: Task, token: CancellationToken): ProviderResult<Task> {
        return Promise.resolve(task);
    }
}
