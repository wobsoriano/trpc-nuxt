import { u as useContent, g as useDocus, a as _sfc_main$k, f as __nuxt_component_0$3 } from '../server.mjs';
import { defineComponent, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "PageContributors",
  __ssrInlineRender: true,
  setup(__props) {
    const { page } = useContent();
    const docus = useDocus();
    const root = computed(() => {
      var _a;
      return ((_a = docus.value.github) == null ? void 0 : _a.root) || "/";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_GithubFileContributors = resolveComponent("GithubFileContributors");
      const _component_Icon = _sfc_main$k;
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(ssrRenderComponent(_component_GithubFileContributors, mergeProps({
        source: unref(root) + ((_a = unref(page)) == null ? void 0 : _a._file)
      }, _attrs), {
        default: withCtx(({ contributors, pending }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><span class="flex items-center inline-block gap-2 text-sm grow-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-outline:user-group",
              class: "w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Contributors</span></span>`);
            if (contributors == null ? void 0 : contributors.length) {
              _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(contributors, (contributor) => {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  key: contributor.login,
                  alt: contributor.name,
                  title: `@${contributor.login} on GitHub`,
                  to: `https://github.com/${contributor.login}`
                }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<img${ssrRenderAttr("src", contributor.avatar_url)} class="inline-block w-6 h-6 transition-colors rounded-full u-ring-gray-200 hover:ring-primary-500 ring-2"${_scopeId2}>`);
                    } else {
                      return [
                        createVNode("img", {
                          src: contributor.avatar_url,
                          class: "inline-block w-6 h-6 transition-colors rounded-full u-ring-gray-200 hover:ring-primary-500 ring-2"
                        }, null, 8, ["src"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else if (pending) {
              _push2(`<span class="block w-6 h-6 opacity-0"${_scopeId}>\xA0</span>`);
            } else if (!pending && !(contributors == null ? void 0 : contributors.length)) {
              _push2(`<span class="block u-text-gray-500"${_scopeId}>No contributors.</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-4" }, [
                createVNode("span", { class: "flex items-center inline-block gap-2 text-sm grow-0" }, [
                  createVNode(_component_Icon, {
                    name: "heroicons-outline:user-group",
                    class: "w-5 h-5"
                  }),
                  createVNode("span", null, "Contributors")
                ]),
                (contributors == null ? void 0 : contributors.length) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-wrap gap-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(contributors, (contributor) => {
                    return openBlock(), createBlock(_component_NuxtLink, {
                      key: contributor.login,
                      alt: contributor.name,
                      title: `@${contributor.login} on GitHub`,
                      to: `https://github.com/${contributor.login}`
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: contributor.avatar_url,
                          class: "inline-block w-6 h-6 transition-colors rounded-full u-ring-gray-200 hover:ring-primary-500 ring-2"
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                    }, 1032, ["alt", "title", "to"]);
                  }), 128))
                ])) : pending ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "block w-6 h-6 opacity-0"
                }, "\xA0")) : !pending && !(contributors == null ? void 0 : contributors.length) ? (openBlock(), createBlock("span", {
                  key: 2,
                  class: "block u-text-gray-500"
                }, "No contributors.")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/github/PageContributors.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=PageContributors.5b836a40.mjs.map
