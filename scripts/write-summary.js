const fs = require('fs')

const status = process.argv[2] || ''
const duration = process.argv[3] || ''

const obj = {
  os: process.env.MATRIX_OS || '',
  node: process.env.MATRIX_NODE || '',
  mode: process.env.MODE || '',
  env: process.env.ENVIRONMENT || '',
  production: process.env.PRODUCTION || '',
  extra_flags: process.env.EXTRA_FLAGS || '',
  result: status,
  duration: duration
}

try {
  fs.writeFileSync('summary.json', JSON.stringify(obj, null, 2), 'utf8')
  console.log('Wrote summary.json')
} catch (e) {
  console.error('Failed to write summary.json:', e.message)
  process.exit(1)
}
