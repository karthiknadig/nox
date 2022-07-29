// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export function getTimeForLogging(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}
