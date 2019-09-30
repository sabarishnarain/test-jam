import path from 'path';
import dbHelper, { MODEL } from './dbHelper';
const fsSecretJSON = dbHelper.getDataFile(MODEL.SECRET);
const fsMasterKeyJSON = dbHelper.getDataFile(MODEL.MASTERKEY);

import fs from 'fs';
import uuidv1 from 'uuid/v1';

export default class securityKeyHelper {

  public static getMasterKey(): string {
    const master = JSON.parse(fs.readFileSync(fsMasterKeyJSON, 'utf-8'));
    if (!master) {
      throw new Error('Master key is empty. Please set one to continue.');
    }
    return master.key;
  }

  public static isValidSecret(key: string): boolean {
    const s = this.getSecrets();
    console.log(s);

    let found: boolean = false;

    for ( const f of s) {
      console.log('Key is ', f);
      if (f === key) {
        found = true ;
        break;
      }
    }

    return found;
  }

  public static createSecret(): string {
    const secrets: string[] = this.getSecrets();
    const newSecret = uuidv1();
    secrets.push(newSecret);
    fs.writeFileSync(fsSecretJSON, JSON.stringify(secrets));
    return newSecret;
  }

  public static removeSecret(key: string) {
    const secrets = this.getSecrets();
    const newSecrets: [] = secrets.filter( (s: string) => s !== key);
    fs.writeFileSync(fsSecretJSON, JSON.stringify(newSecrets));
}

public static getSecrets(): any {
  return JSON.parse(fs.readFileSync(fsSecretJSON, 'utf-8'));
}

}
