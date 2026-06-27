import type { common } from "@kit.AbilityKit";
import { AnyThreadTurboModule, AnyThreadTurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { fileIo as fs } from '@kit.CoreFileKit';
import { resourceManager } from '@kit.LocalizationKit'
import { BusinessError } from '@kit.BasicServicesKit';

export class RNRealmModule extends AnyThreadTurboModule {
  static NAME = "RNRealm" as const;
  protected context: common.UIAbilityContext;

  constructor(ctx: AnyThreadTurboModuleContext) {
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
      const err = e as BusinessError;
      if (err.code === 13900002) {
        return;
      }
      console.error('realm RNRealmModule removeFile err:', path, e);
    }
  }

  removeDirectory(path: string): void {
    this.removeDirectoryRecursive(path);
  }

  private removeDirectoryRecursive(path: string): void {
    let names: string[];
    try {
      names = fs.listFileSync(path);
    } catch (e) {
      const err = e as BusinessError;
      if (err.code === 13900002) {
        return;
      }
      console.error('realm removeDirectory listFile err:', path, e);
      return;
    }

    for (const name of names) {
      const childPath = path + '/' + name;
      try {
        const stat = fs.statSync(childPath);
        if (stat.isDirectory()) {
          this.removeDirectoryRecursive(childPath);
        } else {
          fs.unlinkSync(childPath);
        }
      } catch (e) {
        console.error('realm removeDirectoryRecursive entry err:', childPath, e);
      }
    }

    try {
      fs.rmdirSync(path);
    } catch (e) {
      console.error('realm removeDirectory rmdir err:', path, e);
    }
  }

  removeRealmFilesFromDirectory(directory: string): void {
    const realmExtensions: string[] = [
      '.realm', '.realm.lock', '.realm.note',
      '.realm.log', '.realm.log_a', '.realm.log_b'
    ];
    const managementExtension = '.realm.management';

    let names: string[];
    try {
      names = fs.listFileSync(directory);
    } catch (e) {
      const err = e as BusinessError;
      // 目录不存在视为无文件可删，与上游行为一致。
      if (err.code === 13900002) {
        return;
      }
      // 鸿蒙 C++ 经 callSync 调用，ArkTS 异常无法传回 realm-core（见 removeFile 注释），
      // 故记录日志而不抛出。
      console.error('realm removeRealmFilesFromDirectory listFile err:', directory, e);
      return;
    }

    for (const name of names) {
      const fullPath = directory + '/' + name;
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        console.error('realm removeRealmFilesFromDirectory stat err:', fullPath, e);
        continue;
      }

      if (stat.isDirectory()) {
        if (fullPath.endsWith(managementExtension)) {
          this.removeDirectoryRecursive(fullPath);
        }
      } else {
        if (realmExtensions.some(ext => fullPath.endsWith(ext))) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            const err = e as BusinessError;
            if (err.code !== 13900002) {
              console.error('realm removeRealmFilesFromDirectory unlink err:', fullPath, e);
            }
          }
        }
      }
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