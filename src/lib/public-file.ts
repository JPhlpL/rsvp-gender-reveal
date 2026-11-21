import "server-only";

import fs from "node:fs";
import path from "node:path";

/** True when `/public<publicPath>` exists, e.g. a baby photo the couple added later. */
export function publicFileExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}
