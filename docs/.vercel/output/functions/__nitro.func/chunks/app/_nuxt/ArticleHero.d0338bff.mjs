import { u as useContent } from '../server.mjs';
import { defineComponent, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import 'ohmyfetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'ufo';
import 'h3';
import 'defu';
import 'vue-router';
import 'scule';
import 'property-information';
import 'html-tags';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import 'ohash';
import 'cookie-es';
import 'pinceau/runtime';
import '../../nitro/vercel.mjs';
import 'node-fetch-native/polyfill';
import 'unenv/runtime/fetch/index';
import 'unstorage';
import 'unstorage/drivers/overlay';
import 'unstorage/drivers/memory';
import 'radix3';
import 'pathe';
import 'unified';
import 'mdast-util-to-string';
import 'micromark/lib/preprocess.js';
import 'micromark/lib/postprocess.js';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'remark-emoji';
import 'rehype-slug';
import 'remark-squeeze-paragraphs';
import 'rehype-external-links';
import 'remark-gfm';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'remark-mdc';
import 'remark-parse';
import 'remark-rehype';
import 'mdast-util-to-hast';
import 'detab';
import 'unist-builder';
import 'mdurl';
import 'slugify';
import 'unist-util-position';
import 'unist-util-visit';
import 'shiki-es';
import 'unenv/runtime/npm/consola';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ArticleHero",
  __ssrInlineRender: true,
  setup(__props) {
    const { page } = useContent();
    const formatDateByLocale = (locale, d) => {
      return new Date(d).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      if (unref(page)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 lg:py-16" }, _attrs))}><div class="flex flex-col items-center justify-center max-w-4xl px-4 mx-auto text-center gap-y-8 sm:px-6 lg:px-8">`);
        if ((_a = unref(page)) == null ? void 0 : _a.date) {
          _push(`<div class="font-semibold text-gray-400"><time>${ssrInterpolate(formatDateByLocale("en", unref(page).date))}</time> - ${ssrInterpolate(unref(page).category)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_b = unref(page)) == null ? void 0 : _b.title) {
          _push(`<h1 class="text-5xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(page).title)}</h1>`);
        } else {
          _push(`<!---->`);
        }
        if ((_c = unref(page)) == null ? void 0 : _c.description) {
          _push(`<p class="max-w-5xl font-medium text-gray-700 dark:text-gray-200">${ssrInterpolate(unref(page).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if ((_e = (_d = unref(page)) == null ? void 0 : _d.authors) == null ? void 0 : _e.length) {
          _push(`<ul class="flex flex-wrap items-center justify-center gap-4"><!--[-->`);
          ssrRenderList(unref(page).authors, (author) => {
            _push(`<li class="group"><a${ssrRenderAttr("href", author.link)} alt="twitter account" class="flex p-2 transition-colors duration-300 rounded-md gap-x-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"><div class="w-12 h-12 rounded-full"><img${ssrRenderAttr("src", author.avatarUrl)}${ssrRenderAttr("alt", author.name)} class="border-2 border-gray-500 rounded-full"></div><div class="flex flex-col items-start justify-center"><span class="text-gray-900 dark:text-white">${ssrInterpolate(author.name)}</span><span class="text-sm text-gray-400">${ssrInterpolate(`@${author.link.split("/").pop()}`)}</span></div></a></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/ArticleHero.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ArticleHero.d0338bff.mjs.map
