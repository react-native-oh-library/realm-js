#pragma once

#include "RNOH/ArkTSTurboModule.h"

namespace rnoh {

class JSI_EXPORT RNRealm : public ArkTSTurboModule {
  public:
    RNRealm(const ArkTSTurboModule::Context ctx, const std::string name);
    void injectModuleIntoJSGlobal(facebook::jsi::Runtime &rt);
};

} // namespace rnoh
