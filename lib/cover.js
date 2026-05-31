'use strict';

const { hashValue } = require('./hash');

function getIdentifier(post) {
  return firstString(post && post.slug)
    || firstString(post && post.path)
    || firstString(post && post.title)
    || firstString(post && post.source)
    || 'post';
}

function firstString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function shouldInject(post, config) {
  if (!post) return false;
  if (config.override) return true;
  return !hasValue(post.index_img) && !hasValue(post.banner_img);
}

function isPostLike(post) {
  if (!post) return false;

  if (hasValue(post.layout)) return post.layout === 'post';
  if (hasValue(post.source)) return /^_posts\//.test(String(post.source).replace(/\\/g, '/'));

  return false;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function buildCover(post, config) {
  const identifier = getIdentifier(post);
  const fullHash = hashValue(identifier);
  const slug = slugify(identifier);
  const shortHash = fullHash.slice(0, 10);
  const path = `${config.route}/${slug}-${shortHash}.svg`;

  return {
    hash: fullHash,
    path,
    url: `/${path}`
  };
}

function slugify(value) {
  const slug = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'post';
}

module.exports = {
  buildCover,
  getIdentifier,
  isPostLike,
  shouldInject,
  slugify
};
