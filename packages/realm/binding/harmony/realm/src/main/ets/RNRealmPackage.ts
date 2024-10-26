

import { RNPackage, TurboModulesFactory } from "@rnoh/react-native-openharmony/ts";
import type { TurboModule, TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import { RNRealmModule } from "./RNRealmModule";

class RNRealmModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === RNRealmModule.NAME) {
      return new RNRealmModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === RNRealmModule.NAME;
  }
}

export class RNRealmPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNRealmModulesFactory(ctx);
  }
}