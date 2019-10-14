export default class OtherTest {
  
    private id: string;
    private title: string; 
    private index: number;
  
    constructor(index: number, id: string, title: string ) {
        this.index = index;
        this.id = id;
        this.title = title;
    }
  
    public getTitle() {
      return this.title;
    }
  
    public getId() {
      return this.id;
    }
  
  }