const timeout = 5000;

export function waitForElements(selectors: string[]) {
  for (const sel of selectors) {
    $(sel).waitForDisplayed();
  }
}

export function waitForElement(selector: string, msg?: string) {
  $(selector).waitForDisplayed(timeout, false, msg);
}

export  function waitForAddTest() {
  waitForElements(['#title', '#description']);
}

export function waitForProjects() {
  waitForElements(['//h3[normalize-space()="Projects"]', '#pname']);
}
