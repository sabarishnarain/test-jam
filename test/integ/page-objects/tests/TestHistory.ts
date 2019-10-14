export default class TestHistory {
  
  private status: string;
  private build: string; 
  private dateString: string;
  private index: number;

  constructor(index: number, status: string, build: string, dateString: string ) {
      this.index = index;
      this.status = status;
      this.build = build;
      this.dateString = dateString;
  }

  public getStatus() {
    return this.status;
  }

  public getBuild() {
    return this.build;
  }

  public getDate() {
      return this.dateString;
  }
}