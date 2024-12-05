cmake_minimum_required(VERSION 3.13)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_VERBOSE_MAKEFILE on)
set(LOG_VERBOSITY_LEVEL 1)

project(rnoh_realm)
file(GLOB rnoh_realm_SRC CONFIGURE_DEPENDS *.cpp)

if(DEFINED PACKAGE_FIND_FILE)
    include(${PACKAGE_FIND_FILE})
endif()

set(REAML_CORE_SRC_DIR "${NODE_MODULES}/@react-native-oh-tpl/realm")
set(BINDING_FILES "${REAML_CORE_SRC_DIR}/binding")
set(BINDING_JSI_FILES "${REAML_CORE_SRC_DIR}/binding/jsi")
set(BINDGEN_FILES "${REAML_CORE_SRC_DIR}/bindgen/src")
set(REALM_CORE_FILES "${REAML_CORE_SRC_DIR}/bindgen/vendor/realm-core/bindgen/src")
set(REALM_CORE_PATH "${REAML_CORE_SRC_DIR}/prebuilds/harmony/realm-core/${OHOS_ARCH}")
set(OPENSSL_PATH "${REAML_CORE_SRC_DIR}/prebuilds/harmony/openssl_1_1_1w/${OHOS_ARCH}")
set(ZLIB_PATH "${REAML_CORE_SRC_DIR}/prebuilds/harmony/zlib/${OHOS_ARCH}")

file(GLOB BINDING_JSI_CPP_FILES "${REAML_CORE_SRC_DIR}/binding/jsi/*.cpp")

include_directories(${BINDING_FILES}
                    ${BINDING_FILES}/include)
include_directories(${BINDING_JSI_FILES}
                    ${BINDING_JSI_FILES}/include)
include_directories(${BINDGEN_FILES}
                    ${BINDGEN_FILES}/include)
include_directories(${REALM_CORE_FILES}
                    ${REALM_CORE_FILES}/include)
include_directories(${rnoh_realm_SRC}
                    ${rnoh_realm_SRC}/include)

add_library(rnoh_realm SHARED
    ${rnoh_realm_SRC}
    RNRealm.cpp
    platform.cpp
    ${REAML_CORE_SRC_DIR}/binding/jsi/jsi_init.cpp
    ${REAML_CORE_SRC_DIR}/binding/jsi/react_scheduler.cpp
    )

target_compile_definitions(rnoh_realm PRIVATE
    REALM_ENABLE_SYNC=1
    REALM_HAVE_EPOLL=1
    REALM_APP_SERVICES=1
)

set(CMAKE_INTERPROCEDURAL_OPTIMIZATION OFF)
set(CMAKE_CXX_FLAGS_RELEASE "-DNDEBUG -Oz")

target_link_options(rnoh_realm PUBLIC -fvisibility=hidden)

target_include_directories(rnoh_realm PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${BINDING_FILES}
    ${BINDING_JSI_FILES}
    ${BINDGEN_FILES}
    ${REALM_CORE_FILES}
    )

target_link_libraries(rnoh_realm PRIVATE ${REALM_CORE_PATH}/lib/librealm.a)
target_link_libraries(rnoh_realm PRIVATE ${REALM_CORE_PATH}/lib/librealm-object-store.a)
target_link_libraries(rnoh_realm PRIVATE ${REALM_CORE_PATH}/lib/librealm-parser.a)
target_link_libraries(rnoh_realm PRIVATE ${REALM_CORE_PATH}/lib/librealm-sync.a)
target_link_libraries(rnoh_realm PRIVATE ${OPENSSL_PATH}/lib/libssl.so.1.1)
target_link_libraries(rnoh_realm PRIVATE ${OPENSSL_PATH}/lib/libcrypto.so.1.1)
target_link_libraries(rnoh_realm PRIVATE ${ZLIB_PATH}/lib/libz.so.1)

target_include_directories(rnoh_realm PRIVATE ${ZLIB_PATH}/lib/include)
target_include_directories(rnoh_realm PRIVATE ${REALM_CORE_PATH}/include)
target_include_directories(rnoh_realm PRIVATE ${OPENSSL_PATH}/include)

target_link_libraries(rnoh_realm PUBLIC rnoh)
