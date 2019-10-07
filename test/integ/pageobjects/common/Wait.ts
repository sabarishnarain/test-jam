const timeout = 5000;

export function waitForElements(selectors: string[]) {
    for (const s of selectors) {
        $(s).waitForDisplayed(timeout);
    }
}

export function waitForElement(selector: string, msg?: string) {
    $(selector).waitForDisplayed(timeout, false, msg);
}