#include "RNRealm.h"

#include <glog/logging.h>
#include <cxxreact/Instance.h>
#include <hermes/inspector/RuntimeAdapter.h>
#include <hermes/hermes.h>

#include "jsi_init.h"
#include "react_scheduler.h"
#include "platform.hpp"

namespace rnoh {
using namespace facebook;

jsi::Value getFilesDir(facebook::jsi::Runtime &rt, react::TurboModule &turboModule,
                              const facebook::jsi::Value *args, size_t count) {    
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getFilesDir", args, count);
}

jsi::Value injectModuleIntoJSGlobal(facebook::jsi::Runtime &rt, react::TurboModule &turboModule,
                              const facebook::jsi::Value *args, size_t count) {          
    auto self = static_cast<RNRealm *>(&turboModule);      
    self->injectModuleIntoJSGlobal(rt);
    return facebook::jsi::Value::undefined();
}

RNRealm::RNRealm(const ArkTSTurboModule::Context ctx, const std::string name) : ArkTSTurboModule(ctx, name) {

    methodMap_ = {
        methodMap_ = {
            {"injectModuleIntoJSGlobal", {0, rnoh::injectModuleIntoJSGlobal}},
            {"getFilesDir", {0, rnoh::getFilesDir}}
        }
    };
}

void rnoh::RNRealm::injectModuleIntoJSGlobal(facebook::jsi::Runtime &rt) {        
    folly::dynamic result = callSync("getFilesDir", {});
    auto path = result["values"].asString();
    realm::JsPlatformHelpers::set_default_realm_file_directory(path);   
    auto jsInvoker = m_ctx.jsInvoker;
    
    if (jsInvoker) {
        realm::js::react_scheduler::create_scheduler(jsInvoker);
    }

    auto runtime = reinterpret_cast<jsi::Runtime*>(&rt);
    if (runtime) {
        auto exports = jsi::Object(*runtime);
        realm_jsi_init(*runtime, exports);
        // Store this as a global for JavaScript to read
        runtime->global().setProperty(*runtime, "__injectedRealmBinding", exports);
    }    
}
} // namespace rnoh
