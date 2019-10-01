import path from 'path';
import fsx from 'fs-extra';
import {env} from '../server/env';

export default class dbHelper {

  /**
   * Set default contents to  config files.
   *
   * Will leave the file untouched if already exists.
   * @param model
   * @param defaultContents
   */
  public static setDefaultContent(model: MODEL, defaultContents: any) {
    const dataFile = this.getDataFilePath(model);

    if (!fsx.existsSync(dataFile)) {
      fsx.ensureFile(dataFile, () => {
        fsx.writeFile(dataFile, JSON.stringify(defaultContents), () => {
          // do nothing
        });
      });
    }

  }

  public static getContents(model: MODEL): any {
    const dataFile = this.getDataFilePath(model);
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
    return path.join(__dirname, '..', '..', 'db', env.subDir);
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
