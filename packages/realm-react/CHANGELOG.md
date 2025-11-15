# Changelog
## 鸿蒙化Log

### v0.11.1-rc.1

- pre-release version 0.11.1-rc.1


* feat: add OpenHarmony support for realm-react

## ReleaseLog

### Realm React v0.11.0

#### Enhancements

- Add more additional overload to `useQuery` to allow the [react-hooks/exhaustive-deps](https://www.npmjs.com/package/eslint-plugin-react-hooks) eslint rule to work ([#6819](https://github.com/realm/realm-js/pull/6819))

#### Fixed

- None

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).

### Realm React v0.10.1

#### Fixed

- Fixing the `RealmProvider` component when context is created without passing neither a `Realm` instance nor a `Realm.Configuration` to avoid unnecessary recreation of the provider, which was causing "Cannot access realm that has been closed" errors. ([#6842](https://github.com/realm/realm-js/issues/6842), since v0.8.0)

#### Compatibility

- React Native >= v0.71.4
- Realm Studio v15.0.0.
- File format: generates Realms with format v24 (reads and upgrades file format v10).