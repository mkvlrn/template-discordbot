/** biome-ignore-all lint/suspicious/noConsole: cli */

import process from "node:process";

export interface Cli {
  action: "register" | "unregister";
  scope: string;
}

export function handleOptions(): Cli {
  const action = process.argv.at(2);
  const scope = process.argv.at(3);

  if (action === undefined || scope === undefined) {
    console.error("missing action or scope");
    process.exit(1);
  }

  if (!["register", "unregister"].includes(action)) {
    console.error("invalid action: must be 'register' or 'unregister'");
    process.exit(1);
  }

  // biome-ignore lint/performance/useTopLevelRegex: simple enough regex
  if (scope !== "global" && !/\d+/.test(scope)) {
    console.error("invalid scope: must be 'global' or a server ID");
    process.exit(1);
  }

  return {
    action: action as "register" | "unregister",
    scope,
  };
}
