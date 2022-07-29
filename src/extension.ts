import * as vscode from "vscode";
import { NoxTaskProvider } from "./providers/noxTaskProvider";
import { initializePython } from "./providers/python";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.tasks.registerTaskProvider("nox", new NoxTaskProvider())
    );

    setImmediate(async () => {
        await initializePython(context.subscriptions);
    });
}

export function deactivate() {}
