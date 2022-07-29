import * as path from "path";
import * as proc from "child_process";
import { ShellExecution, Task, TaskScope, Uri } from "vscode";
import { getInterpreterDetails } from "./python";
import { getWorkspaceFolder } from "./vscodeapi";

interface NoxTask {
    name: string;
    description: string;
    source: string;
}
interface NoxTasks {
    error: string[];
    tasks: NoxTask[];
}

const SCRIPT_PATH = path.join(
    path.dirname(__dirname),
    "bundled",
    "get_tasks.py"
);

export async function getNoxTasks(): Promise<Task[]> {
    const python = await getInterpreterDetails();
    if (!python.path || python.path.length === 0) {
        return Promise.resolve([]);
    }
    const command = python.path[0];
    const args = [...python.path.slice(1), SCRIPT_PATH];
    const workspace = getWorkspaceFolder(Uri.file(command));
    const noxRun = proc.spawn(command, args, { cwd: workspace?.uri.fsPath });

    const promise = new Promise<Task[]>((resolve, reject) => {
        noxRun.stdout.on("data", (data) => {
            const noxTasks: NoxTasks = JSON.parse(data);
            if (
                noxTasks.error &&
                noxTasks.error.length &&
                noxTasks.error.length > 0
            ) {
                noxTasks.error.forEach((err) => console.log(err));
            }
            resolve(
                noxTasks.tasks.map(
                    (t) =>
                        new Task(
                            {
                                type: "nox",
                                task: t.name,
                                command: command,
                                args: ["-m", "nox", "--session", t.name],
                                detail: t.description,
                                label: `nox: ${t.name}`,
                            },
                            TaskScope.Workspace,
                            t.name,
                            "nox",
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
            reject(err);
        });
    });
    return promise;
}
