import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

// No third-party packages, credential files, environment dumps or raw npm logs.
const cwd = fileURLToPath(new URL("../", import.meta.url));
const run = (command, args, timeout = 5000) => spawnSync(command, args, {
  cwd, encoding: "utf8", timeout, maxBuffer: 256 * 1024,
});
const config = (key) => {
  const result = run("npm", ["config", "get", key]);
  return result.status === 0 ? result.stdout.trim() : "unknown";
};
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
console.log(`Node ${process.version}; ${process.platform}/${process.arch}; expected Node ${pkg.engines.node}`);
const npm = run("npm", ["--version"]);
console.log(`npm ${/^\d+\.\d+\.\d+$/.test(npm.stdout?.trim()) ? npm.stdout.trim() : "unavailable"}; expected ${pkg.packageManager}`);
if (process.versions.node.split(".")[0] !== "22") console.log("WARN: use nvm install && nvm use in the repository.");

const lockPath = new URL("../package-lock.json", import.meta.url);
if (!existsSync(lockPath)) {
  console.log("WARN: package-lock.json missing; update your checkout before npm ci.");
} else {
  try {
    const lock = JSON.parse(readFileSync(lockPath));
    const root = lock.packages?.[""];
    const groups = ["dependencies", "devDependencies", "optionalDependencies"];
    const matches = groups.every((group) => {
      const actual = root?.[group] ?? {};
      const expected = pkg[group] ?? {};
      return Object.keys(actual).length === Object.keys(expected).length &&
        Object.entries(expected).every(([name, version]) => actual[name] === version);
    });
    console.log(`Lockfile v${lock.lockfileVersion}; ${Object.keys(lock.packages ?? {}).length - 1} entries (includes optional platforms); direct dependencies ${matches ? "match" : "DO NOT MATCH"}.`);
    console.log("npm ci performs the full lockfile validation; this check only compares direct dependencies.");
  } catch {
    console.log("WARN: package-lock.json cannot be parsed.");
  }
}
const others = ["pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "npm-shrinkwrap.json"]
  .filter((name) => existsSync(new URL(`../${name}`, import.meta.url)));
console.log(`Other lockfiles: ${others.join(", ") || "none"}`);
console.log(`Root install hooks: ${["preinstall", "install", "postinstall", "prepare"].filter((key) => pkg.scripts?.[key]).join(", ") || "none"}`);

const registry = config("registry");
try {
  const url = new URL(registry);
  console.log(`Registry: ${url.protocol}//${url.hostname} (credentials/path omitted)`);
} catch { console.log("Registry: unavailable or invalid"); }
for (const key of ["prefer-offline", "strict-ssl", "ignore-scripts", "audit"]) {
  const value = config(key);
  console.log(`${key}: ${["true", "false"].includes(value) ? value : "unknown"}`);
}
console.log(`omit=dev: ${config("omit").split(/\s+/).includes("dev")}; builds need devDependencies.`);
const cache = config("cache");
if (process.platform === "linux") {
  for (const [label, path] of [["Project", cwd], ["npm cache", cache]]) {
    if (!existsSync(path)) { console.log(`${label}: directory not present yet`); continue; }
    const fs = run("findmnt", ["--noheadings", "--output", "FSTYPE", "--target", path]);
    console.log(`${label} filesystem: ${fs.status === 0 ? fs.stdout.trim() : "unknown (findmnt unavailable)"}`);
    const disk = run("df", ["-Pk", path]);
    const fields = disk.stdout?.trim().split("\n").at(-1)?.split(/\s+/);
    if (disk.status === 0 && /^\d+$/.test(fields?.[3])) {
      console.log(`${label} free space: ${(Number(fields[3]) / 1024 / 1024).toFixed(1)} GiB`);
    }
  }
}

if (process.argv.includes("--network")) {
  const start = performance.now();
  const ping = run("npm", ["ping", "--fetch-retries=0", "--fetch-timeout=15000", "--loglevel=error"], 20000);
  console.log(`Configured registry ping: ${ping.status === 0 ? "OK" : "FAILED"} in ${((performance.now() - start) / 1000).toFixed(2)}s`);
  if (ping.status !== 0) {
    const code = (ping.stderr ?? "").match(/\b(EAI_AGAIN|ENOTFOUND|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EACCES|ENOSPC|EROFS|E401|E403|CERT_HAS_EXPIRED|UNABLE_TO_VERIFY_LEAF_SIGNATURE)\b/);
    console.log(`Failure: ${code?.[1] ?? (ping.error?.code === "ETIMEDOUT" ? "timeout" : "check registry/proxy/TLS; raw output omitted")}`);
  }
  const probe = run("curl", ["--disable", "--silent", "--show-error", "--output", "/dev/null", "--connect-timeout", "5", "--max-time", "15", "--write-out", "HTTP %{http_code}; DNS %{time_namelookup}s; TCP %{time_connect}s; TLS %{time_appconnect}s; first byte %{time_starttransfer}s; total %{time_total}s", "https://registry.npmjs.org/next/latest"], 20000);
  console.log(`Public npm HTTPS probe: ${probe.status === 0 ? probe.stdout : "FAILED (curl unavailable or network/TLS problem)"}`);
  console.log("A fast ping does not prove large package downloads are fast. Compare npm ci timing logs too.");
} else {
  console.log("For bounded network checks: npm run diagnose:install -- --network");
}
console.log("Next steps: docs/INSTALL.md. No Firebase credentials are needed for installation or this report.");
