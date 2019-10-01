import path from 'path';
import fsx from 'fs-extra';

export default class dbHelper {

  public static getContents(model: MODEL, defaultContents?: any): any {
    const dataFile = this.getDataFilePath(model);

    if (!fsx.pathExistsSync(dataFile)) {
      const contents = defaultContents || [];
      fsx.ensureFileSync(dataFile);
      // Write default contents in file and return
      fsx.writeFileSync(dataFile, JSON.stringify(contents));
    }
    return JSON.parse(fsx.readFileSync(dataFile, 'utf-8'));

  }

  /**
   * Save contents to file. Creates new file if not exists.
   * @param model
   * @param contents
   */
  public static saveContents(model: MODEL, contents: any) {
    const dataFile = this.getDataFilePath(model);
    fsx.ensureFileSync(dataFile);
    fsx.writeFileSync(dataFile, JSON.stringify(contents));
    return contents;
  }

  public static getDataFileForTestHistory(testId: number): string {
    const baseDirPath = this._getBaseDirPath();
    return path.join(baseDirPath, 'history', 'test-' + testId + '.json');
  }

  private static getDataFilePath(model: MODEL): string {

    const baseDirPath = this._getBaseDirPath();

    let filePath;

    if (model === MODEL.USER) {
      filePath = path.join(baseDirPath, 'users.json');
    } else if (model === MODEL.PROJECT) {
      filePath = path.join(baseDirPath, 'projects.json');
    } else if (model === MODEL.TEST) {
      filePath = path.join(baseDirPath, 'tests.json');
    } else if (model === MODEL.SECRET) {
      filePath = path.join(baseDirPath, 'secret.json');
    } else if (model === MODEL.MASTERKEY) {
      filePath = path.join(baseDirPath, 'master-key.json');
    } else if (model === MODEL.APPCONFIG) {
      filePath = path.join(baseDirPath, 'config.json');
    }
    return filePath;
  }

  private static _getBaseDirPath(): string {
    const subDirPath = (process.env.JDAM_ENV_PROD === 'true') ? 'prod' : 'test';
    return path.join(__dirname, '..', '..', 'db', subDirPath);
  }
}

export enum MODEL {
 USER,
 PROJECT,
 TEST,
 SECRET,
 MASTERKEY,
 APPCONFIG
}
