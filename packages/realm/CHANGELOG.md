# Changelog
## 鸿蒙化Log

### v12.14.3-rc.1

- pre-release version 12.14.3-rc.1


* feat: add OpenHarmony support for realm

## ReleaseLog

### Realm JavaScript v12.14.2

#### Fixed

- Fix setting `List` values from themselves (either through assignment or the `Realm#create` method). Before this fix, the list would be emptied before being iterated, resulting in elements being removed from the list. ([#6977](https://github.com/realm/realm-js/pull/6977), since v12.12.0)

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).

### Realm JavaScript v12.14.1

#### Fixed

- Closing and opening a realm before a token refresh is completed, would result in two sync sessions both try to start synchronizing the realm when the refreshes do complete, leading to a crash with a MultipleSyncAgents exception. ([realm/realm-core#8064](https://github.com/realm/realm-core/issues/8064))
- Migrating primary key to a new type without migration function would cause an assertion to fail. ([realm/realm-core#8045](https://github.com/realm/realm-core/issues/8045), since Realm JS v10.0.0)
- Committing a subscription set prematurely released a read lock, which may have caused a BadVersion exception with an error like `Unable to lock version XX as it does not exist or has been cleaned up` while changing subscriptions. ([realm/realm-core##8068](https://github.com/realm/realm-core/pull/8068), since Realm JS v12.13.0)

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).

#### Internal

- Upgraded Realm Core from v14.13.1 to v14.13.5.

### Realm JavaScript v12.14.0

#### Enhancements

- Added `excludeFromIcloudBackup` option to the `Realm` constructor to exclude the realm files from iCloud backup. ([#4139](https://github.com/realm/realm-js/issues/4139) and [#6927](https://github.com/realm/realm-js/pull/6927))

  Thanks [@danibonilha](https://github.com/danibonilha) for [your PR](https://github.com/realm/realm-js/pull/6922) and time crafting the testing guide for the iCloud backup exclusion feature.

#### Fixed

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).

#### Internal

- Refactored Android filesystem platform helpers. ([#5296](https://github.com/realm/realm-js/issues/5296) and [realm/realm-js-private#507](https://github.com/realm/realm-js-private/issues/507))

### Realm JavaScript v12.13.2

#### Fixed

- Fixed build error on React Native Android when used with React Native 0.76, due to the merge of dynamic libraries. ([#6908](https://github.com/realm/realm-js/issues/6908) since React Native v0.76.0).
- Filtering notifications with backlink columns as last element could sometimes give wrong results ([realm/realm-core#7530](https://github.com/realm/realm-core/issues/7530), since Realm JS v10.6.2-beta.1)
- Fix crash during client app shutdown when Logger log level is set higher than Info. ([realm/realm-core#7969](https://github.com/realm/realm-core/issues/7969), since Realm JS v12.3.1)
- If File::rw_lock() fails to open a file the exception message does not contain the filename ([realm/realm-core#7999](https://github.com/realm/realm-core/issues/7999), since Realm JS v6.1.0)
- Fallback to hashed filename will fail if length of basename is between 240 and 250 ([realm/realm-core#8007](https://github.com/realm/realm-core/issues/8007), since Realm JS v10.0.0)
- Having a query with a number of predicates ORed together may result in a crash on some platforms (strict weak ordering check failing on iphone) ([realm/realm-core#8028](https://github.com/realm/realm-core/issues/8028), since Realm JS v12.8.0)
- The events library would attempt to upload backup files created as part of file format upgrades, causing backup copies of those backups to be made, looping until the maximum file name size was reached ([realm/realm-core#8040](https://github.com/realm/realm-core/issues/8040), since Realm JS v10.18.0).

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).

#### Internal

- Upgraded Realm Core from v14.12.0 to v14.13.1.

### Realm JavaScript v12.13.1

#### Fixed

- Fixed a build error on React Native iOS and Android from a change in the `CallInvoker`'s `invokeAsync` call signature. ([#6851](https://github.com/realm/realm-js/pull/6851) since v12.12.0 in combination with React Native >= v0.75.0).

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).