import dbHelper, { MODEL } from './dbHelper';
import uuidv1 from 'uuid/v1';

export default class securityKeyHelper {

  public static getMasterKey(): string {
    let master;
    try {
      master = dbHelper.getContents(MODEL.MASTERKEY, { key: 'nobodyownsnothing' });
    } catch (err) {
      console.error(err);
      return undefined;
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
    dbHelper.saveContents(MODEL.SECRET, secrets);
    return newSecret;
  }

  public static removeSecret(key: string) {
    const secrets = this.getSecrets();
    const newSecrets: [] = secrets.filter( (s: string) => s !== key);
    dbHelper.saveContents(MODEL.SECRET, newSecrets);
}

public static getSecrets(): any {
  return dbHelper.getContents(MODEL.SECRET);
}

}
