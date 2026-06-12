import {
  AnyThreadTurboModuleFactory,
  AnyThreadTurboModuleContext,
  AnyThreadTurboModule
} from '@rnoh/react-native-openharmony/ts';
import { RNRealmModule } from "./RNRealmModule";
import { RNOHPackage } from '@rnoh/react-native-openharmony'

class RNRealmModulesFactory extends AnyThreadTurboModuleFactory {
  createTurboModule(name: string): AnyThreadTurboModule | null {
    if (name === RNRealmModule.NAME) {
      return new RNRealmModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === RNRealmModule.NAME;
  }
}

export class RNRealmPackage extends RNOHPackage {
  createAnyThreadTurboModuleFactory(ctx: AnyThreadTurboModuleContext): AnyThreadTurboModuleFactory  {
    return new RNRealmModulesFactory(ctx);
  }
}