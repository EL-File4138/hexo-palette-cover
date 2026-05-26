'use strict';

const { getConfig } = require('./lib/config');
const { buildCover, getIdentifier, shouldInject } = require('./lib/cover');
const { renderSvg } = require('./lib/svg');

function injectCover(data) {
  const config = getConfig(this.config && this.config.palette_cover);
  if (!config.enable || !shouldInject(data, config)) return data;

  return applyCover(data, config);
}

function injectTemplateLocals(locals) {
  const config = getConfig(this.config && this.config.palette_cover);
  if (!config.enable || !locals) return locals;

  injectPostCollection(locals.posts, config);
  if (locals.page) injectPostCollection(locals.page.posts, config);
  if (locals.site) injectPostCollection(locals.site.posts, config);
  return locals;
}

function applyCover(post, config) {
  const cover = buildCover(post, config);
  post.index_img = cover.url;
  post.banner_img = cover.url;
  return post;
}

function injectPostCollection(posts, config) {
  if (!posts) return;

  const list = typeof posts.toArray === 'function' ? posts.toArray() : Array.from(posts);
  list.forEach((post) => {
    if (shouldInject(post, config)) applyCover(post, config);
  });
}

function generateCovers(locals) {
  const config = getConfig(this.config && this.config.palette_cover);
  if (!config.enable || !locals || !locals.posts) return [];

  const posts = typeof locals.posts.toArray === 'function'
    ? locals.posts.toArray()
    : Array.from(locals.posts);

  const seen = new Set();
  const routes = [];

  posts.forEach((post) => {
    if (!shouldGenerate(post, config)) return;

    const cover = buildCover(post, config);
    if (seen.has(cover.path)) return;
    seen.add(cover.path);

    routes.push({
      path: cover.path,
      data: renderSvg({
        identifier: getIdentifier(post),
        hash: cover.hash,
        config
      })
    });
  });

  return routes;
}

function shouldGenerate(post, config) {
  if (shouldInject(post, config)) return true;
  if (!post) return false;

  const cover = buildCover(post, config);
  return post.index_img === cover.url || post.banner_img === cover.url;
}

hexo.extend.filter.register(
  'before_post_render',
  injectCover,
  getConfig(hexo.config && hexo.config.palette_cover).priority
);

hexo.extend.filter.register(
  'template_locals',
  injectTemplateLocals,
  getConfig(hexo.config && hexo.config.palette_cover).priority
);

hexo.extend.generator.register('palette_cover', generateCovers);

module.exports = {
  applyCover,
  injectCover,
  injectTemplateLocals,
  generateCovers
};
