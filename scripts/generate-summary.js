const fs = require('fs')
const path = require('path')

const artifactsDir = process.argv[2] || 'artifacts'
const outFile = process.argv[3] || 'summary.md'

function readJsonFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir)
  const results = []
  for (const f of files) {
    const fp = path.join(dir, f)
    const stat = fs.statSync(fp)
    if (stat.isDirectory()) {
      // descend
      results.push(...readJsonFiles(fp))
    } else if (f.endsWith('.json') || f.toLowerCase().includes('summary')) {
      try {
        const content = fs.readFileSync(fp, 'utf8')
        const parsed = JSON.parse(content)
        results.push(parsed)
      } catch (e) {
        // ignore parse errors
      }
    }
  }
  return results
}

const items = readJsonFiles(artifactsDir)
const total = items.length
const success = items.filter(i => i.result && i.result.toLowerCase() === 'success').length
const failed = items.filter(i => i.result && i.result.toLowerCase() !== 'success').length
const totalDuration = items.reduce((s,i)=>s + (Number(i.duration) || 0), 0)
const avgDuration = total ? Math.round(totalDuration / total) : 0

let md = `# Pipeline Matrix Summary\n\n`
md += `- **Jobs ejecutados**: ${total}\n`
md += `- **Éxitos**: ${success} — **Fallos**: ${failed}\n`
md += `- **Duración total estimada (s)**: ${totalDuration} — **Duración media (s)**: ${avgDuration}\n\n`

md += `**Detalles por job**\n\n`
md += `| OS | Node | Mode | Env | Resultado | Duración (s) | Producción | Extras |\n`
md += `|---|---:|---|---|---|---:|---|---|\n`
for (const it of items) {
  const os = it.os || (it.matrix && it.matrix.os) || ''
  const node = it.node || (it.matrix && it.matrix.node) || ''
  const mode = it.mode || (it.matrix && it.matrix.mode) || ''
  const env = it.env || (it.matrix && it.matrix.env) || ''
  const result = it.result || ''
  const duration = it.duration || ''
  const production = it.production || ''
  const extras = it.extra_flags || ''
  md += `| ${os} | ${node} | ${mode} | ${env} | ${result} | ${duration} | ${production} | ${extras} |\n`
}

try {
  fs.writeFileSync(outFile, md, 'utf8')
  console.log(`Wrote ${outFile}`)
} catch (e) {
  console.error('Failed to write summary:', e.message)
  process.exitCode = 2
}
