import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.js';

test('normalizes URLs with or without https to the same value', () => {
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com/');
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  for (const storedValue of [
    null,
    '',
    'not-json',
    JSON.stringify({ url: 'https://www.example.com', slug: 'mona-abcdef' }),
    JSON.stringify(['https://www.example.com']),
  ]) {
    assert.doesNotThrow(() => loadBookmarks(storedValue));
    assert.deepEqual(loadBookmarks(storedValue), []);
  }
});

test('drops malformed records from saved bookmark arrays', () => {
  assert.deepEqual(
    loadBookmarks(
      JSON.stringify([
        { url: 'example.com', slug: 'mona-abcdef' },
        { url: 'javascript:alert(1)', slug: 'invalid' },
        { url: 'https://example.com', slug: 123 },
      ]),
    ),
    [{ url: 'https://example.com/', slug: 'mona-abcdef' }],
  );
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com/', slug: 'mona-7fk2ab' }),
    'https://www.example.com/ :: mona-7fk2ab',
  );
});
