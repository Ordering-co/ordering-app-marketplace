import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configure, validateManifest } from './core.mjs'

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const manifest = JSON.parse(await fs.readFile(path.join(repository, 'scripts/onboarding/product.json'), 'utf8'))
const source = JSON.parse(await fs.readFile(path.join(repository, 'src/config.json'), 'utf8'))

test('the product manifest targets the actual native source configuration', () => {
  validateManifest(manifest)
  assert.equal(manifest.configFile, 'src/config.json')
  assert.deepEqual(manifest.projectPaths, [{ path: ['project'], required: true }])
  assert.equal(typeof source.project, 'string')
  if (manifest.additionalSelection) assert.equal(manifest.additionalSelection.required, true)
})

test('native product setup preserves IDs, socket settings, flags and every unrelated field', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'ordering-native-config-'))
  try {
    await fs.mkdir(path.join(temporary, 'src'))
    const original = { ...source, customDeveloperField: { keep: true } }
    await fs.writeFile(path.join(temporary, 'src/config.json'), JSON.stringify(original))
    const project = 'native_test_project'
    const request = async url => ({ ok: true, status: 200, json: async () => url.includes('/franchises?')
      ? { error: false, result: [{ id: 34, slug: 'explicit_franchise', enabled: true }], pagination: { total: 1 } }
      : { error: false, result: { code: project } } })
    const result = await configure(temporary, manifest, { project, confirmProjectChange: true, ...(manifest.additionalSelection ? { franchiseSlug: 'explicit_franchise' } : {}) }, request)
    assert.equal(result.changed, true)
    const configured = JSON.parse(await fs.readFile(path.join(temporary, 'src/config.json'), 'utf8'))
    assert.deepEqual(configured, { ...original, project, ...(manifest.additionalSelection ? { franchiseSlug: manifest.additionalSelection.persist === 'id' ? 34 : 'explicit_franchise' } : {}) })
    assert.equal(typeof source.project, 'string')
  } finally { await fs.rm(temporary, { recursive: true, force: true }) }
})
