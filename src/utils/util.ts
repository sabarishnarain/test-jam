export default class util {

  public static getMaxId(contents: any) {
    const ids = contents.map( (c: any) => {
      return c.id;
    });

    if (ids.length > 0) {
      return Math.max(...ids);
    }
    return 0;
  }
}
