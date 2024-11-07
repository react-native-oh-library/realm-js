#include "VarCache.h"

VarCache* VarCache::instance_ = nullptr;  

VarCache* VarCache::Singleton() {
    if (instance_ == nullptr) {
        instance_ = new VarCache();
    }

    return instance_;
}

void VarCache::Release() {
    if (VarCache::instance_ != nullptr) {
        delete VarCache::instance_;
        VarCache::instance_ = nullptr;
    }
}

rnoh::ArkTSTurboModule::Context VarCache::GetContext() {
    return ctx_;
}

void VarCache::SetContext(rnoh::ArkTSTurboModule::Context _ctx) {
    ctx_ = _ctx;
}