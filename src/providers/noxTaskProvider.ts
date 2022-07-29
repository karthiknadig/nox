import { CancellationToken, ProviderResult, Task, TaskProvider } from "vscode";
import { getNoxTasks } from "./pythonUtils";

export class NoxTaskProvider implements TaskProvider {
    provideTasks(token: CancellationToken): ProviderResult<Task[]> {
        return getNoxTasks();
    }
    resolveTask(task: Task, token: CancellationToken): ProviderResult<Task> {
        return Promise.resolve(task);
    }
}
