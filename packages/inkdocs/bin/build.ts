#!/usr/bin/env node
import { getOptions } from "../lib/get-options";
import { build } from "../builder";

build(await getOptions());
