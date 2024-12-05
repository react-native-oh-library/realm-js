import type { common } from "@kit.AbilityKit";
import type { TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import { TurboModule } from "@rnoh/react-native-openharmony/ts";
import { fileIo as fs } from '@kit.CoreFileKit';
import { resourceManager } from '@kit.LocalizationKit'
import { BusinessError } from '@kit.BasicServicesKit';

export class RNRealmModule extends TurboModule {
  static NAME = "RNRealm" as const;
  protected context: common.UIAbilityContext;

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    this.context = ctx?.uiAbilityContext;
  }

  getFilesDir(): object {
    const path = this.context.filesDir;
    return { values: path };
  }

  removeFile(path: string): void {
    try {
      fs.unlinkSync(path);
    } catch (e) {
      console.error('realm RNRealmModule removeFile err:', e);
    }
  }

  removeDirectory(path: string): void {
    try {
      fs.rmdirSync(path);
    } catch (e) {
      console.error('realm RNRealmModule removeDirectory err:', e);
    }
  }

  copyBundledRealmFiles(): void {
    const resourceMgr : resourceManager.ResourceManager = this.context.resourceManager;
    let arr: Array<string> = resourceMgr.getRawFileListSync("");
    let defaultRealmDirectory: string = this.context.filesDir;

    if (arr && arr.length > 0) {
      for (let name of arr) {
        let destFileName = defaultRealmDirectory + '/' + name;
        let isFile = this.isFile(name);
        if (isFile) {
          this.copyFile(resourceMgr, name, destFileName);
        } else if (this.isDirectory(name)) {
          this.mkDirAndCopy(resourceMgr, name, destFileName);
        }
      }
    }
  }

  private copyFile(resourceMgr : resourceManager.ResourceManager, name: string, destFileName: string) {
    if (!fs.accessSync(destFileName, 0)) {
      let out: fs.File = fs.openSync(destFileName, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
      resourceMgr.getRawFileContent(name).then((fileData : Uint8Array) => {
        const buffer = fileData.buffer.slice(0);
        fs.writeSync(out.fd, buffer);
      }).catch((err : BusinessError) => {
        console.error("realm copyBundledRealmFiles Failed to get RawFileContent err:", err)
      });
    }
  }

  private mkDirAndCopy(resourceMgr : resourceManager.ResourceManager, name: string, destFileName: string){
    try {
      fs.mkdirSync(destFileName);
    } catch (e) {
      console.error('realm mkDirAndCopy err:', e)
    }
    
    let arr: Array<string> = resourceMgr.getRawFileListSync(name);
    if (arr && arr.length > 0) {
      for (let name1 of arr) {
        let childDestFileName = destFileName +'/' +name1;
        let childPath = name +'/' + name1;
        let isFile = this.isFile(childPath);
        if (isFile) {
          this.copyFile(resourceMgr, childPath, childDestFileName);
        } else if (this.isDirectory(childPath)) {
          this.mkDirAndCopy(resourceMgr, childPath, childDestFileName);
        }
      }
    }
  }

  private isFile(path: string): boolean {
    const resourceMgr : resourceManager.ResourceManager = this.context.resourceManager;
    try {
      resourceMgr.getRawFileContentSync(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  private isDirectory(path: string): boolean {
    const resourceMgr : resourceManager.ResourceManager = this.context.resourceManager;
    try {
      let files: Array<string> = resourceMgr.getRawFileListSync(path);
      return files && files.length > 0;
    } catch (e) {
      return false;
    }
  }
}