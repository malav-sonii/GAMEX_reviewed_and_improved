import { spawn } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextCli = require.resolve("next/dist/bin/next")
const requestedPort = Number.parseInt(process.env.PORT ?? "3000", 10)
const port =
  Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort <= 65535
    ? requestedPort
    : 3000

const child = spawn(
  process.execPath,
  [nextCli, "dev", "--port", String(port), "--hostname", "0.0.0.0"],
  {
    env: process.env,
    stdio: "inherit",
  },
)

child.on("error", (error) => {
  console.error(
    "Unable to start the Next.js development server:",
    error.message,
  )
  process.exitCode = 1
})

child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal))
}
