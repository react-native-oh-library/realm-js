////////////////////////////////////////////////////////////////////////////
//
// Copyright 2024 Realm Inc.
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

/* eslint-disable no-console */
/* eslint-env node */

const { env } = process;

import assert from "node:assert";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { Option, program } from "@commander-js/extra-typings";

import { REALM_CORE_PATH, SUPPORTED_CONFIGURATIONS } from "./common";

export { program };

const configurationOption = new Option("--configuration <name>", "Build configuration")
  .makeOptionMandatory()
  .choices(SUPPORTED_CONFIGURATIONS)
  .default("Release" as const);

function actionWrapper<Args extends unknown[]>(action: (...args: Args) => Promise<void> | void) {
  return async (...args: Args) => {
    try {
      await action(...args);
    } catch (err) {
      process.exitCode = 1;
      if (err instanceof Error) {
        console.error(`ERROR: ${err.stack}`);
        if (err.cause instanceof Error) {
          console.error(`CAUSE: ${err.cause.message}`);
        }
      } else {
        throw err;
      }
    }
  };
}

function group<ReturnType>(title: string, callback: () => ReturnType) {
  try {
    if (env.GITHUB_ACTIONS === "true") {
      console.log(`::group::${title}`);
    }
    return callback();
  } finally {
    if (env.GITHUB_ACTIONS === "true") {
      console.log("::endgroup::");
    } else {
      console.log();
    }
  }
}

program.name("build-realm");

if (require.main === module) {
  program.parse();
}
