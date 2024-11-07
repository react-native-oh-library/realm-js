import type { common } from "@kit.AbilityKit";
import type { TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import { TurboModule } from "@rnoh/react-native-openharmony/ts";
import { fileIo as fs } from '@kit.CoreFileKit';

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
}