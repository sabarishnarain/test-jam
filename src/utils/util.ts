import dbHelper, { MODEL } from '../helpers/dbHelper';
import fsx from 'fs-extra';

const appConfig: any = JSON.parse(fsx.readFileSync(dbHelper.getDataFile(MODEL.APPCONFIG), 'utf-8'));

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

  public static isSecretRequired(): boolean {
    return appConfig && appConfig.authentication.requireSecret === true;
  }

}
