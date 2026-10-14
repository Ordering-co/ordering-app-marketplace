import test from 'node:test'
import assert from 'node:assert/strict'
import { parseLocalOptions } from './ios-local.mjs'

test('local simulator requires explicit opt-in and rejects unsafe invocation options', () => {
  assert.throws(() => parseLocalOptions(['--project', 'my_project']), /explicit/)
  assert.throws(() => parseLocalOptions(['--without-firebase', '--release']), /Unsupported/)
  assert.throws(() => parseLocalOptions(['--without-firebase', '--without-firebase']), /Unsupported/)
  assert.throws(() => parseLocalOptions(['--without-firebase', '--port', '80']), /Invalid/)
  assert.throws(() => parseLocalOptions(['--without-firebase', '--port', '70000']), /Invalid/)
})

test('local preview carries only explicit public selection and local runtime flags', () => {
  assert.deepEqual(parseLocalOptions(['--without-firebase', '--project', 'chosen', '--franchise-slug', 'selected', '--port', '8123', '--prepare-only']), {
    'without-firebase': true, project: 'chosen', 'franchise-slug': 'selected', port: '8123', 'prepare-only': true
  })
  assert.throws(() => parseLocalOptions(['--without-firebase', '--api-key', 'never']), /Unsupported/)
})

test('public destination changes require a deliberate confirmation flag', () => {
  assert.equal(parseLocalOptions(['--without-firebase', '--confirm-project-change'])['confirm-project-change'], true)
  assert.equal(parseLocalOptions(['--without-firebase'])['confirm-project-change'], undefined)
})
