#include "RNOH/ArkTSTurboModule.h"

class VarCache {
  public:
    static VarCache* Singleton();
    static void Release();
    
    rnoh::ArkTSTurboModule::Context GetContext();
    void SetContext(rnoh::ArkTSTurboModule::Context ctx);

  private:
    static VarCache* instance_;
    rnoh::ArkTSTurboModule::Context ctx_;
    VarCache() {}  
};