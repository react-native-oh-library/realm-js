////////////////////////////////////////////////////////////////////////////
//
// Copyright 2016 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

#include <string>
#include <stdlib.h>
#include <stdarg.h>
#include <unistd.h>
#include <cstdio>

#include "platform.hpp"
#include <glog/logging.h>

#include <ReactCommon/TurboModule.h>
#include "RNOH/ArkTSTurboModule.h"
#include "VarCache.h"
#include "RNOH/RNInstance.h"

#define REALM_FILE_FILTER ".realm"
#define REALM_FILE_FILTER_LEN 6

static inline bool is_realm_file(const char* str)
{
    size_t lenstr = strlen(str);
    if (REALM_FILE_FILTER_LEN > lenstr)
        return false;
    return strncmp(str + lenstr - REALM_FILE_FILTER_LEN, REALM_FILE_FILTER, REALM_FILE_FILTER_LEN) == 0;
}

static std::string s_default_realm_directory;

namespace realm {

void JsPlatformHelpers::set_default_realm_file_directory(std::string dir)
{
    s_default_realm_directory = dir;
}

std::string JsPlatformHelpers::default_realm_file_directory()
{
    return s_default_realm_directory;
}

void JsPlatformHelpers::ensure_directory_exists_for_file(const std::string& file) {}

void JsPlatformHelpers::copy_bundled_realm_files()
{
    auto rnInstancePtr = VarCache::Singleton()->GetContext().instance.lock();
    if (rnInstancePtr != nullptr) {
        auto turboModule = rnInstancePtr->getTurboModule("RNRealm");
        auto arkTsTurboModule = std::dynamic_pointer_cast<rnoh::ArkTSTurboModule>(turboModule);
        arkTsTurboModule->callSync("copyBundledRealmFiles", {""});
    }
}

void JsPlatformHelpers::remove_realm_files_from_directory(const std::string& directory)
{
    std::string path = s_default_realm_directory + "/*.realm " + s_default_realm_directory + "/*.realm.lock";
    auto rnInstancePtr = VarCache::Singleton()->GetContext().instance.lock();
    if (rnInstancePtr != nullptr) {
        auto turboModule = rnInstancePtr->getTurboModule("RNRealm");
        auto arkTsTurboModule = std::dynamic_pointer_cast<rnoh::ArkTSTurboModule>(turboModule);
        arkTsTurboModule->callSync("removeFile", {path});
    }
}

void JsPlatformHelpers::remove_directory(const std::string& path)
{
    auto rnInstancePtr = VarCache::Singleton()->GetContext().instance.lock();
    if (rnInstancePtr != nullptr) {
        auto turboModule = rnInstancePtr->getTurboModule("RNRealm");
        auto arkTsTurboModule = std::dynamic_pointer_cast<rnoh::ArkTSTurboModule>(turboModule);
        arkTsTurboModule->callSync("removeDirectory", {path});
    }
}

void JsPlatformHelpers::remove_file(const std::string& path)
{
    auto rnInstancePtr = VarCache::Singleton()->GetContext().instance.lock();
    if (rnInstancePtr != nullptr) {
        auto turboModule = rnInstancePtr->getTurboModule("RNRealm");
        auto arkTsTurboModule = std::dynamic_pointer_cast<rnoh::ArkTSTurboModule>(turboModule);
        arkTsTurboModule->callSync("removeFile", {path});
    }
}

void JsPlatformHelpers::print(const char* fmt, ...)
{
    va_list vl;
    va_start(vl, fmt);
    fprintf(stderr, "%s: ", "RealmJS");
    vfprintf(stderr, fmt, vl);
    fprintf(stderr, "\n");
    va_end(vl);
}

std::string JsPlatformHelpers::get_cpu_arch()
{
#if defined(__arm__)
    return "armeabi-v7a";
#elif defined(__aarch64__)
    return "arm64-v8a";
#elif defined(__i386__)
    return "x86";
#elif defined(__x86_64__)
    return "x86_64";
#else
    return "unknown";
#endif
}

} // namespace realm
