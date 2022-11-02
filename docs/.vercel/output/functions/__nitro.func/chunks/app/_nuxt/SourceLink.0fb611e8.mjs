import __nuxt_component_0 from './ProseP.ea1207fc.mjs';
import { f as __nuxt_component_0$3, a as _sfc_main$k } from '../server.mjs';
import { defineComponent, resolveComponent, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "SourceLink",
  __ssrInlineRender: true,
  props: {
    source: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProseP = __nuxt_component_0;
      const _component_GithubLink = resolveComponent("GithubLink");
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      _push(ssrRenderComponent(_component_ProseP, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_GithubLink, {
              source: __props.source,
              edit: false
            }, {
              default: withCtx((data, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    href: data == null ? void 0 : data.url,
                    target: "_blank",
                    rel: "noopener",
                    class: "hover:text-primary-500 flex items-center gap-1 text-sm font-semibold"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "fa-brands:github",
                          class: "mr-1 h-5 w-5"
                        }, null, _parent4, _scopeId3));
                        _push4(`<span${_scopeId3}>Show Source</span>`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: "fa-brands:github",
                            class: "mr-1 h-5 w-5"
                          }),
                          createVNode("span", null, "Show Source")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      href: data == null ? void 0 : data.url,
                      target: "_blank",
                      rel: "noopener",
                      class: "hover:text-primary-500 flex items-center gap-1 text-sm font-semibold"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: "fa-brands:github",
                          class: "mr-1 h-5 w-5"
                        }),
                        createVNode("span", null, "Show Source")
                      ]),
                      _: 2
                    }, 1032, ["href"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_GithubLink, {
                source: __props.source,
                edit: false
              }, {
                default: withCtx((data) => [
                  createVNode(_component_NuxtLink, {
                    href: data == null ? void 0 : data.url,
                    target: "_blank",
                    rel: "noopener",
                    class: "hover:text-primary-500 flex items-center gap-1 text-sm font-semibold"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Icon, {
                        name: "fa-brands:github",
                        class: "mr-1 h-5 w-5"
                      }),
                      createVNode("span", null, "Show Source")
                    ]),
                    _: 2
                  }, 1032, ["href"])
                ]),
                _: 1
              }, 8, ["source"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/SourceLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=SourceLink.0fb611e8.mjs.map
