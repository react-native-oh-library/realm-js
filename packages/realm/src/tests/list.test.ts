////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
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

import { Realm } from "../Realm";

import type { RealmContext } from "./utils";
import { closeRealm, generateTempRealmPath } from "./utils";

describe("List", () => {
  beforeEach(function (this: RealmContext) {
    this.realm = new Realm({
      path: generateTempRealmPath(),
      inMemory: true,
      schema: [
        { name: "Person", properties: { name: "string", age: "int", pets: "Pet[]" } },
        { name: "Pet", properties: { category: "string" } },
      ],
    });
  });

  afterEach(closeRealm);

  it("supports managed object links when creating objects", function (this: RealmContext) {
    this.realm.write(() => {
      const cat = this.realm.create("Pet", { category: "Cat" });
      this.realm.create("Person", {
        name: "Alice",
        age: 32,
        pets: [cat],
      });
    });
  });

  it("supports unmanaged plain object when creating objects", function (this: RealmContext) {
    this.realm.write(() => {
      this.realm.create("Person", {
        name: "Alice",
        age: 32,
        pets: [
          {
            category: "Dog",
          },
        ],
      });
    });
  });
});
