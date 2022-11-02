import { b as _export_sfc, h as useRuntimeConfig, i as _sfc_main$m } from '../server.mjs';
import _sfc_main$1 from './ReleasesReactions.6487e480.mjs';
import { useSSRContext, defineComponent, resolveComponent, withCtx, openBlock, createBlock, Fragment, renderList, createVNode, toDisplayString, createCommentVNode } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
import './Badge.41c3e619.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Releases",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    if (!(config == null ? void 0 : config.github)) {
      throw new Error("If you want to use `Releases` component, you must specify: `owner`, `repo` and `branch` in your nuxt.config `github` key.");
    }
    const formatDateByLocale = (date) => {
      const currentLocale = "en-US";
      try {
        return new Intl.DateTimeFormat(currentLocale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(Date.parse(date));
      } catch (_) {
        return date;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GithubReleases = resolveComponent("GithubReleases");
      const _component_ContentRenderer = _sfc_main$m;
      const _component_ReleasesReactions = _sfc_main$1;
      _push(ssrRenderComponent(_component_GithubReleases, _attrs, {
        default: withCtx(({ releases }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(releases, (release) => {
              var _a;
              _push2(`<div class="release mb-6 flex flex-col-reverse border-gray-100 pb-6 dark:border-gray-800 lg:flex-row lg:border-b" data-v-3735c798${_scopeId}><div class="flex-1" data-v-3735c798${_scopeId}>`);
              _push2(ssrRenderComponent(_component_ContentRenderer, {
                value: release,
                class: "docus-content"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_ReleasesReactions, {
                class: "lg:mb-4",
                release
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="release-meta z-1 sticky -mt-8 flex w-full flex-row items-center justify-between gap-2 self-start px-8 text-right lg:w-1/4 lg:flex-col lg:items-end lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none" data-v-3735c798${_scopeId}><a${ssrRenderAttr("href", release.url)} target="_blank" data-v-3735c798${_scopeId}><h2${ssrRenderAttr("id", release.name)} class="hover:text-primary-500 u-text-gray-900 cursor-pointer text-2xl font-bold lg:text-3xl" data-v-3735c798${_scopeId}>${ssrInterpolate(release.name)}</h2></a><div class="flex flex-col gap-2 pb-4" data-v-3735c798${_scopeId}>`);
              if (release.author) {
                _push2(`<a target="_blank"${ssrRenderAttr("href", release.author.url)} class="hover:u-text-gray-900 mt-4 flex items-center justify-end gap-2 lg:mt-0" data-v-3735c798${_scopeId}><div class="flex-shrink-0" data-v-3735c798${_scopeId}><img class="h-6 w-6 rounded-full"${ssrRenderAttr("src", (_a = release.author) == null ? void 0 : _a.avatar)} alt="" data-v-3735c798${_scopeId}></div><p class="text-sm lg:text-base" data-v-3735c798${_scopeId}>@${ssrInterpolate(release.author.name)}</p></a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="text-xs lg:text-base" data-v-3735c798${_scopeId}>${ssrInterpolate(formatDateByLocale(release.date))}</p></div></div></div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(releases, (release) => {
                var _a;
                return openBlock(), createBlock("div", {
                  key: release.name,
                  class: "release mb-6 flex flex-col-reverse border-gray-100 pb-6 dark:border-gray-800 lg:flex-row lg:border-b"
                }, [
                  createVNode("div", { class: "flex-1" }, [
                    createVNode(_component_ContentRenderer, {
                      value: release,
                      class: "docus-content"
                    }, null, 8, ["value"]),
                    createVNode(_component_ReleasesReactions, {
                      class: "lg:mb-4",
                      release
                    }, null, 8, ["release"])
                  ]),
                  createVNode("div", { class: "release-meta z-1 sticky -mt-8 flex w-full flex-row items-center justify-between gap-2 self-start px-8 text-right lg:w-1/4 lg:flex-col lg:items-end lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none" }, [
                    createVNode("a", {
                      href: release.url,
                      target: "_blank"
                    }, [
                      createVNode("h2", {
                        id: release.name,
                        class: "hover:text-primary-500 u-text-gray-900 cursor-pointer text-2xl font-bold lg:text-3xl"
                      }, toDisplayString(release.name), 9, ["id"])
                    ], 8, ["href"]),
                    createVNode("div", { class: "flex flex-col gap-2 pb-4" }, [
                      release.author ? (openBlock(), createBlock("a", {
                        key: 0,
                        target: "_blank",
                        href: release.author.url,
                        class: "hover:u-text-gray-900 mt-4 flex items-center justify-end gap-2 lg:mt-0"
                      }, [
                        createVNode("div", { class: "flex-shrink-0" }, [
                          createVNode("img", {
                            class: "h-6 w-6 rounded-full",
                            src: (_a = release.author) == null ? void 0 : _a.avatar,
                            alt: ""
                          }, null, 8, ["src"])
                        ]),
                        createVNode("p", { class: "text-sm lg:text-base" }, "@" + toDisplayString(release.author.name), 1)
                      ], 8, ["href"])) : createCommentVNode("", true),
                      createVNode("p", { class: "text-xs lg:text-base" }, toDisplayString(formatDateByLocale(release.date)), 1)
                    ])
                  ])
                ]);
              }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/github/Releases.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Releases = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3735c798"]]);

export { Releases as default };
//# sourceMappingURL=Releases.f8bbe863.mjs.map
