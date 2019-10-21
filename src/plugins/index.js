// @flow
import { Plugin } from "../plugin";

let pluginIndex = {};

import FallbackSearchPlugin from "./fallback";
pluginIndex["FallbackSearchPlugin"] = FallbackSearchPlugin;

export default pluginIndex;
