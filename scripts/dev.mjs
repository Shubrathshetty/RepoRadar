import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

function parsePort(argv) {
  let port;
  const passthrough = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--port" || arg === "-p") {
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        port = next;
        i += 1;
        continue;
      }
    }

    if (arg.startsWith("--port=")) {
      port = arg.slice("--port=".length);
      continue;
    }

    passthrough.push(arg);
  }

  const fallback = process.env.PORT || "3000";
  const selected = port || fallback;
  const normalized = /^\d+$/.test(selected) ? selected : "3000";

  return { port: normalized, passthrough };
}

const { port, passthrough } = parsePort(process.argv.slice(2));
process.env.NEXT_DIST_DIR = `.next-dev-${port}`;

const nextCliPath = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [nextCliPath, "dev", "-p", port, ...passthrough], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start next dev:", error);
  process.exit(1);
});
