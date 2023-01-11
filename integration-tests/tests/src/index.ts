////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
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

console.log("Loading Realm Integration Tests");

import { flags } from "realm";

// TODO: Refactor tests to disable this
flags.ALLOW_VALUES_ARRAYS = true;

/**
 * Use the `longTimeout` context variable to override this.
 */
const DEFAULT_LONG_TIMEOUT = 30 * 1000; // 30s

import "./setup-globals";

afterEach(() => {
  // Trigger garbage collection after every test, if exposed by the environment.
  if (typeof global.gc === "function") {
    global.gc();
  }
});

import "./utils/import-app.test.ts";
import "./utils/chai-plugin.test.ts";

describe("Test Harness", function (this: Mocha.Suite) {
  /**
   * @see [typings.d.ts](./typings.d.ts) for documentation.
   */
  function longTimeout(this: Mocha.Context | Mocha.Suite) {
    this.timeout(environment.longTimeout || DEFAULT_LONG_TIMEOUT); // 30 seconds
  }

  // Patching the Suite and Context with a longTimeout method
  // We cannot simply `import { Suite, Context } from "mocha"` here,
  // since Mocha Remote client brings its own classes
  const Suite = this.constructor as typeof Mocha.Suite;
  const Context = this.ctx.constructor as typeof Mocha.Context;
  Suite.prototype.longTimeout = longTimeout;
  Context.prototype.longTimeout = longTimeout;

  // Test importing an app
  require("./utils/import-app.test");
  require("./utils/chai-plugin.test");
});

import "./tests";
import "./performance-tests";
