const fs = require('fs')

const start = Date.now()
console.log('Runner OS:', process.env.RUNNER_OS || process.platform)
console.log('Node:', process.version)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

;(async () => {
  await sleep(1000)
  const MODE = process.env.MODE || ''
  const ENVIRONMENT = process.env.ENVIRONMENT || ''

  const duration = Math.round((Date.now() - start) / 1000)
  // Write duration to GITHUB_OUTPUT if available (GitHub Actions file path)
  const outPath = process.env.GITHUB_OUTPUT
  if (outPath) {
    try {
      fs.appendFileSync(outPath, `duration=${duration}\n`)
    } catch (e) {
      // best-effort
      console.error('Failed to write GITHUB_OUTPUT:', e.message)
    }
  }

  if (ENVIRONMENT === 'production' && MODE === 'debug') {
    console.error('Invalid production debug combo')
    process.exit(1)
  }

  console.log('Simulated work completed. duration=', duration)
  process.exit(0)
})()
