import path from 'path';
import fsx from 'fs-extra';

export default class dbHelper {

  public static getDataFile(model: MODEL): string {

    const baseDirPath = this._getBaseDirPath();

    let filePath;

    if (model === MODEL.USER) {
      filePath = path.join(baseDirPath, 'users.json');
    } else if (model === MODEL.PROJECT) {
      filePath = path.join(baseDirPath, 'projects.json');
    } else if (model === MODEL.TESTS) {
      filePath = path.join(baseDirPath, 'tests.json');
    } else if (model === MODEL.SECRET) {
      filePath = path.join(baseDirPath, 'secret.json');
    } else if (model === MODEL.MASTERKEY) {
      filePath = path.join(baseDirPath, 'master-key.json');
    } else if (model === MODEL.APPCONFIG) {
      filePath = path.join(baseDirPath, 'config.json');
    }

    /*
    if (!fsx.existsSync(filePath)) {
      fsx.createFileSync(filePath);
      if (model === MODEL.MASTERKEY) {
        fsx.writeFileSync(filePath, JSON.stringify({key : 'nobodyownsnothing'}));
      } else if (model === MODEL.USER) {
        fsx.writeFileSync(filePath, JSON.stringify([{username : 'jdam', password: 'jdam'}]));
      } else {
        fsx.writeFileSync(filePath, '[]');
      }
    } */
    return filePath;
  }

  public static getDataFileForTestHistory(testId: number): string {
    const baseDirPath = this._getBaseDirPath();
    return path.join(baseDirPath, 'history', 'test-' + testId + '.json');
  }

  private static _getBaseDirPath(): string {
    const subDirPath = (process.env.JDAM_ENV_TEST === 'true') ? 'test' : 'prod';
    return path.join(__dirname, '..', '..', 'db', subDirPath);
  }
}

export enum MODEL {
 USER,
 PROJECT,
 TESTS,
 SECRET,
 MASTERKEY,
 APPCONFIG
}
