import TestHistory from "./TestHistory";

export default class TestHistoryList {
  
  private historyList: TestHistory[];
  
  constructor(historyList: TestHistory[]) {
      this.historyList = historyList;
  }
  public getAll() {
    return this.historyList;
  }

  public get(index: number) {
    return this.historyList [index];
  }

  public getRecent() {
    return this.get(0);
  }

  public getCount() {
      return this.getAll().length;
  }
}