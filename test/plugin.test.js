'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

function loadPlugin(config) {
  const registrations = {
    filters: {},
    generators: {}
  };

  global.hexo = {
    config: { palette_cover: config },
    extend: {
      filter: {
        register(name, fn, priority) {
          registrations.filters[name] = { fn, priority };
        }
      },
      generator: {
        register(name, fn) {
          registrations.generators[name] = fn;
        }
      }
    }
  };

  delete require.cache[require.resolve('../index')];
  const plugin = require('../index');
  delete global.hexo;
  return { plugin, registrations };
}

test('injectCover sets index_img and banner_img to same generated URL', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const data = plugin.injectCover.call(context, { layout: 'post', slug: 'hello-world' });

  assert.equal(data.index_img, data.banner_img);
  assert.match(data.index_img, /^\/palette-cover\/hello-world-[a-f0-9]{10}\.svg$/);
});

test('injectCover preserves manual covers by default', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const data = plugin.injectCover.call(context, {
    layout: 'post',
    slug: 'hello-world',
    index_img: '/img/manual.png'
  });

  assert.equal(data.index_img, '/img/manual.png');
  assert.equal(data.banner_img, undefined);
});

test('injectCover overrides manual covers when configured', () => {
  const { plugin } = loadPlugin({ override: true });
  const context = { config: { palette_cover: { override: true } } };
  const data = plugin.injectCover.call(context, {
    layout: 'post',
    slug: 'hello-world',
    index_img: '/img/manual.png'
  });

  assert.equal(data.index_img, data.banner_img);
  assert.notEqual(data.index_img, '/img/manual.png');
});

test('generateCovers returns svg routes for eligible posts', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const routes = plugin.generateCovers.call(context, {
    posts: {
      toArray() {
        return [
          { slug: 'first' },
          { slug: 'second', index_img: '/img/manual.png' }
        ];
      }
    }
  });

  assert.equal(routes.length, 1);
  assert.match(routes[0].path, /^palette-cover\/first-[a-f0-9]{10}\.svg$/);
  assert.match(routes[0].data, /^<svg /);
});

test('generateCovers returns routes for posts already injected in template locals', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const post = plugin.injectCover.call(context, { layout: 'post', slug: 'already-injected' });
  const routes = plugin.generateCovers.call(context, {
    posts: {
      toArray() {
        return [post];
      }
    }
  });

  assert.equal(routes.length, 1);
  assert.match(routes[0].path, /^palette-cover\/already-injected-[a-f0-9]{10}\.svg$/);
});

test('injectCover ignores non-post pages even with override enabled', () => {
  const { plugin } = loadPlugin({ override: true });
  const context = { config: { palette_cover: { override: true } } };
  const data = plugin.injectCover.call(context, {
    layout: 'page',
    slug: 'about'
  });

  assert.equal(data.index_img, undefined);
  assert.equal(data.banner_img, undefined);
});

test('injectCover ignores pages without post metadata', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const data = plugin.injectCover.call(context, {
    slug: 'about',
    source: 'about/index.md'
  });

  assert.equal(data.index_img, undefined);
  assert.equal(data.banner_img, undefined);
});

test('injectCover accepts _posts source when layout is absent', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const data = plugin.injectCover.call(context, {
    slug: 'source-post',
    source: '_posts/source-post.md'
  });

  assert.equal(data.index_img, data.banner_img);
  assert.match(data.index_img, /^\/palette-cover\/source-post-[a-f0-9]{10}\.svg$/);
});

test('injectTemplateLocals injects index list posts', () => {
  const { plugin } = loadPlugin();
  const context = { config: {} };
  const post = { slug: 'index-visible' };
  const locals = plugin.injectTemplateLocals.call(context, {
    posts: {
      toArray() {
        return [post];
      }
    }
  });

  assert.equal(locals.posts.toArray()[0].index_img, locals.posts.toArray()[0].banner_img);
  assert.match(locals.posts.toArray()[0].index_img, /^\/palette-cover\/index-visible-[a-f0-9]{10}\.svg$/);
});

test('plugin registers expected Hexo extensions', () => {
  const { registrations } = loadPlugin({ priority: 2 });

  assert.equal(registrations.filters.before_post_render.priority, 2);
  assert.equal(registrations.filters.template_locals.priority, 2);
  assert.equal(typeof registrations.generators.palette_cover, 'function');
});
