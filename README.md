# LAB3

Este repositorio contiene el laboratorio 3 — Matrix build enterprise.

Archivos relevantes:
- `/.github/workflows/matrix-ci.yml` — workflow con matrix, includes/excludes, concurrency y generación de summary.
- `/scripts/generate-summary.js` — combina artifacts JSON de cada job y genera `summary.md`.

Probar localmente (simular artifacts y generar summary):

```bash
# crear artefactos de ejemplo
mkdir -p test_artifacts
cat > test_artifacts/job1.json <<'JSON'
{ "os":"ubuntu-latest","node":"18","mode":"debug","env":"dev","result":"success","duration":2 }
JSON
cat > test_artifacts/job2.json <<'JSON'
{ "os":"windows-latest","node":"18","mode":"release","env":"staging","result":"success","duration":3 }
JSON
cat > test_artifacts/job3.json <<'JSON'
{ "os":"ubuntu-latest","node":"20","mode":"release","env":"production","result":"failure","duration":4 }
JSON

# generar resumen
node scripts/generate-summary.js test_artifacts summary.md

# ver resumen
cat summary.md
```

Capturas del summary:
- Ejecuta el workflow en GitHub (push a `main` o PR).
- Abre el run, descarga el artifact `pipeline-summary` o mira el run summary en la UI.
