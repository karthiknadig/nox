// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Disposable } from "vscode";
import {
    Arguments,
    ILogging,
    LoggingLevelSettingType,
    LogLevel,
} from "./types";

let loggers: ILogging[] = [];
export function registerLogger(logger: ILogging): Disposable {
    loggers.push(logger);
    return {
        dispose: () => {
            loggers = loggers.filter((l) => l !== logger);
        },
    };
}

const logLevelMap: Map<string | undefined, LogLevel> = new Map([
    ["error", LogLevel.error],
    ["warn", LogLevel.warn],
    ["info", LogLevel.info],
    ["debug", LogLevel.debug],
    ["none", LogLevel.off],
    ["off", LogLevel.off],
    [undefined, LogLevel.error],
]);

let globalLoggingLevel: LogLevel;
export function setLoggingLevel(level?: LoggingLevelSettingType): void {
    globalLoggingLevel = logLevelMap.get(level) ?? LogLevel.error;
}

export function traceLog(...args: Arguments): void {
    loggers.forEach((l) => l.traceLog(...args));
}

export function traceError(...args: Arguments): void {
    if (globalLoggingLevel >= LogLevel.error) {
        loggers.forEach((l) => l.traceError(...args));
    }
}

export function traceWarn(...args: Arguments): void {
    if (globalLoggingLevel >= LogLevel.warn) {
        loggers.forEach((l) => l.traceWarn(...args));
    }
}

export function traceInfo(...args: Arguments): void {
    if (globalLoggingLevel >= LogLevel.info) {
        loggers.forEach((l) => l.traceInfo(...args));
    }
}

export function traceVerbose(...args: Arguments): void {
    if (globalLoggingLevel >= LogLevel.debug) {
        loggers.forEach((l) => l.traceVerbose(...args));
    }
}
