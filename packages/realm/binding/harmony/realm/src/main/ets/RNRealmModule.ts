import type { common } from "@kit.AbilityKit";
import type { TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import { TurboModule } from "@rnoh/react-native-openharmony/ts";

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
}