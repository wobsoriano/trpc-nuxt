import { C as ContentSlot, _ as __nuxt_component_1$3 } from '../server.mjs';
import _sfc_main$1 from './Terminal.bf4fd044.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
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
import './index.4e223d73.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlockHero",
  __ssrInlineRender: true,
  props: {
    cta: {
      type: Array,
      required: false
    },
    secondary: {
      type: Array,
      required: false
    },
    snippet: {
      type: String,
      required: false
    },
    video: {
      type: Array,
      required: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentSlot = ContentSlot;
      const _component_ButtonLink = __nuxt_component_1$3;
      const _component_Terminal = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 sm:py-24 lg:py-32" }, _attrs))}><div class="grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2">`);
      if (_ctx.$slots.top) {
        _push(`<p class="mb-2 text-center lg:text-left">`);
        _push(ssrRenderComponent(_component_ContentSlot, {
          use: _ctx.$slots.top,
          unwrap: "p"
        }, null, _parent));
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.title) {
        _push(`<h1 class="text-4xl font-extrabold tracking-tight text-center u-text-gray-900 sm:text-5xl lg:text-left lg:text-6xl">`);
        _push(ssrRenderComponent(_component_ContentSlot, {
          use: _ctx.$slots.title,
          unwrap: "p"
        }, null, _parent));
        _push(`</h1>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.description) {
        _push(`<p class="max-w-3xl mt-4 text-lg text-center u-text-gray-500 lg:text-left">`);
        _push(ssrRenderComponent(_component_ContentSlot, {
          use: _ctx.$slots.description,
          unwrap: "p"
        }, null, _parent));
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.extra) {
        _push(`<div class="mt-6">`);
        _push(ssrRenderComponent(_component_ContentSlot, {
          use: _ctx.$slots.extra,
          unwrap: "p"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col items-center justify-center gap-4 mt-6 sm:mt-10 sm:flex-row sm:gap-6 lg:justify-start">`);
      if (!_ctx.$slots.actions) {
        _push(`<!--[-->`);
        if (__props.cta) {
          _push(ssrRenderComponent(_component_ButtonLink, {
            class: "!mb-0",
            bold: "",
            size: "large",
            href: __props.cta[1]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.cta[0])}`);
              } else {
                return [
                  createTextVNode(toDisplayString(__props.cta[0]), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.secondary) {
          _push(`<a${ssrRenderAttr("href", __props.secondary[1])} class="py-px font-medium u-text-gray-500 hover:u-text-gray-700">${ssrInterpolate(__props.secondary[0])}</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_ContentSlot, {
          use: _ctx.$slots.actions,
          unwrap: "p"
        }, null, _parent));
      }
      _push(`</div></div>`);
      ssrRenderSlot(_ctx.$slots, "right", {}, () => {
        if (__props.snippet) {
          _push(ssrRenderComponent(_component_Terminal, { content: __props.snippet }, null, _parent));
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/BlockHero.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=BlockHero.c3ca91c5.mjs.map
