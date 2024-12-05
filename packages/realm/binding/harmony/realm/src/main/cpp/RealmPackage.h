#include "RNOH/Package.h"
#include "ComponentDescriptors.h"
#include "RNRealm.h"

namespace rnoh {

class RNCRealmFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "RNRealm") {
            return std::make_shared<RNRealm>(ctx, name);
        }
        return nullptr;
    };
};

class RealmPackage : public Package{
public:
    RealmPackage(Package::Context ctx) : Package(ctx) {}
     std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
        return std::make_unique<RNCRealmFactoryDelegate>();
    }
};

}// namespace rnoh
