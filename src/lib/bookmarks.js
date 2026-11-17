export const STORAGE_KEY = 'mona-bookmarks';

const SLUG_PATTERN = /^mona-[0-9A-Za-z]{6}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Enter a URL.');
  }

  const input = value.trim();

  if (/^(?!https?:\/\/)[a-z][a-z\d+.-]*:\/\//i.test(input)) {
    throw new TypeError('Only HTTP and HTTPS URLs are supported.');
  }

  const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input.replace(/^\/\//, '')}`);

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new TypeError('Enter a valid HTTP or HTTPS URL.');
  }

  return url.href;
}

export function loadBookmarks(serialized) {
  if (typeof serialized !== 'string' || !serialized.trim()) {
    return [];
  }

  let value;
  try {
    value = JSON.parse(serialized);
  } catch {
    return [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((bookmark) => {
    if (
      !bookmark ||
      typeof bookmark !== 'object' ||
      Array.isArray(bookmark) ||
      typeof bookmark.url !== 'string' ||
      typeof bookmark.slug !== 'string' ||
      !SLUG_PATTERN.test(bookmark.slug)
    ) {
      return [];
    }

    try {
      return [{ url: normalizeUrl(bookmark.url), slug: bookmark.slug }];
    } catch {
      return [];
    }
  });
}

export function formatBookmark({ url, slug }) {
  return `${url} :: ${slug}`;
}

export function generateSlug(existingSlugs = []) {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const randomValues = new Uint32Array(6);
  const used = new Set(existingSlugs);

  let slug;
  do {
    crypto.getRandomValues(randomValues);
    slug = `mona-${Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join('')}`;
  } while (used.has(slug));

  return slug;
}
