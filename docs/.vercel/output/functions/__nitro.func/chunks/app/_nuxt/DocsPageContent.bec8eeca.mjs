import { b as _export_sfc, h as useRuntimeConfig, u as useContent, g as useDocus, j as useRoute, r as useRouter, m as useState, p as _sfc_main$c, f as __nuxt_component_0$3, a as _sfc_main$k, s as _sfc_main$e, t as _sfc_main$3$1, o as useContentHelpers } from '../server.mjs';
import { useSSRContext, defineComponent, unref, withCtx, createVNode, mergeProps, toDisplayString, watch, computed, ref, createTextVNode, openBlock, createBlock, createCommentVNode, renderSlot, Fragment } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import __nuxt_component_3 from './ProseCodeInline.b9cff2ce.mjs';
import _sfc_main$6 from './PageEditLink.5dbc9a15.mjs';
import _sfc_main$7 from './PageContributors.5b836a40.mjs';
import __nuxt_component_5 from './ProseHr.05be3620.mjs';
import { upperFirst } from 'scule';
import 'ohmyfetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'ufo';
import 'h3';
import 'defu';
import 'vue-router';
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

const useCurrentNavigation = () => {
  const { navPageFromPath, navDirFromPath, navKeyFromPath } = useContentHelpers();
  const { navigation, page } = useContent();
  const docus = useDocus();
  const route = useRoute();
  const asideConfig = computed(() => {
    return navKeyFromPath(route.path, "aside", navigation.value || []);
  });
  const level = computed(() => {
    var _a, _b, _c;
    if (typeof ((_a = asideConfig.value) == null ? void 0 : _a.level) !== "undefined") {
      return (_b = asideConfig.value) == null ? void 0 : _b.level;
    }
    return ((_c = docus.value.aside) == null ? void 0 : _c.level) || 0;
  });
  const filtered = computed(() => {
    var _a;
    return ((_a = docus.value.aside) == null ? void 0 : _a.exclude) || [];
  });
  const tree = computed(() => {
    var _a, _b, _c;
    let nav = navigation.value || [];
    let _path = route.path;
    if ((_a = asideConfig.value) == null ? void 0 : _a.root) {
      _path = (_b = asideConfig.value) == null ? void 0 : _b.root;
      nav = navDirFromPath(_path, nav);
    }
    if (level.value) {
      const path = _path.split("/");
      const leveledPath = path.splice(0, 1 + level.value).join("/");
      nav = navDirFromPath(leveledPath, nav) || [];
      if (!Array.isArray(nav)) {
        nav = [nav];
      }
    }
    if (nav.length === 0) {
      nav = navPageFromPath(((_c = page.value) == null ? void 0 : _c._path) || "/", navigation.value || []);
      if (!nav) {
        return [];
      }
      if (!Array.isArray(nav)) {
        nav = [nav];
      }
    }
    return nav.filter((item) => {
      if (filtered.value.includes(item._path)) {
        return false;
      }
      return true;
    });
  });
  return { tree, asideConfig };
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DocsAside",
  __ssrInlineRender: true,
  setup(__props) {
    const { tree } = useCurrentNavigation();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_DocsAsideTree = _sfc_main$c;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      _push(`<nav${ssrRenderAttrs(_attrs)}>`);
      if (((_a = unref(tree)) == null ? void 0 : _a.length) > 0) {
        _push(ssrRenderComponent(_component_DocsAsideTree, { links: unref(tree) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "flex items-center text-sm cursor-pointer u-text-gray-500 hover:u-text-gray-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "heroicons-outline:arrow-left",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`<span class="ml-2"${_scopeId}>Go back</span>`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "heroicons-outline:arrow-left",
                  class: "w-4 h-4"
                }),
                createVNode("span", { class: "ml-2" }, "Go back")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsAside.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const DocsAside = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DocsPageBottom",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { page } = useContent();
    const docus = useDocus();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_PageEditLink = _sfc_main$6;
      const _component_PageContributors = _sfc_main$7;
      if (unref(page)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col-reverse justify-between gap-4 mt-8 text-sm u-text-gray-500 md:flex-row" }, _attrs))}><div class="flex flex-col flex-1 w-full gap-4 md:w-1/2">`);
        if (((_a = unref(config)) == null ? void 0 : _a.github) && ((_c = (_b = unref(docus)) == null ? void 0 : _b.github) == null ? void 0 : _c.edit)) {
          _push(ssrRenderComponent(_component_PageEditLink, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(page).mtime) {
          _push(`<span class="flex items-center">Updated on: ${ssrInterpolate(new Intl.DateTimeFormat("en-US").format(Date.parse(unref(page).mtime)))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex-1 w-full md:w-1/2">`);
        if (((_d = unref(config)) == null ? void 0 : _d.github) && ((_f = (_e = unref(docus)) == null ? void 0 : _e.github) == null ? void 0 : _f.contributors)) {
          _push(ssrRenderComponent(_component_PageContributors, null, null, _parent));
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsPageBottom.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const DocsPageBottom = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DocsPrevNext",
  __ssrInlineRender: true,
  setup(__props) {
    const { prev, next, navigation } = useContent();
    const { navDirFromPath } = useContentHelpers();
    const directory = (link) => {
      const nav = navDirFromPath(link._path, navigation.value || []);
      if (nav && nav[0]) {
        return nav[0]._path;
      } else {
        const dirs = link.split("/");
        const directory2 = dirs.length > 1 ? dirs[dirs.length - 2] : "";
        return directory2.split("-").map(upperFirst).join(" ");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      if (unref(prev) || unref(next)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center" }, _attrs))}>`);
        if (unref(prev)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(prev)._path,
            class: "relative min-w-0 p-3 border rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-500 u-border-gray-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="h-4 mb-1 text-xs font-medium text-right truncate u-text-gray-500"${_scopeId}>${ssrInterpolate(directory(unref(prev)._path))}</p><p class="flex items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "heroicons-outline:arrow-sm-left",
                  class: "flex-shrink-0 w-5 h-5"
                }, null, _parent2, _scopeId));
                _push2(`<span class="flex-1 font-medium leading-5 text-right truncate"${_scopeId}>${ssrInterpolate(unref(prev).title)}</span></p>`);
              } else {
                return [
                  createVNode("p", { class: "h-4 mb-1 text-xs font-medium text-right truncate u-text-gray-500" }, toDisplayString(directory(unref(prev)._path)), 1),
                  createVNode("p", { class: "flex items-center gap-3" }, [
                    createVNode(_component_Icon, {
                      name: "heroicons-outline:arrow-sm-left",
                      class: "flex-shrink-0 w-5 h-5"
                    }),
                    createVNode("span", { class: "flex-1 font-medium leading-5 text-right truncate" }, toDisplayString(unref(prev).title), 1)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<span></span>`);
        }
        if (unref(next)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(next)._path,
            class: "relative min-w-0 p-3 border rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-500 u-border-gray-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="h-4 mb-1 text-xs font-medium truncate u-text-gray-500"${_scopeId}>${ssrInterpolate(directory(unref(next)._path))}</p><p class="flex items-center gap-3"${_scopeId}><span class="flex-1 font-medium leading-5 truncate"${_scopeId}>${ssrInterpolate(unref(next).title)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "heroicons-outline:arrow-sm-right",
                  class: "flex-shrink-0 w-5 h-5"
                }, null, _parent2, _scopeId));
                _push2(`</p>`);
              } else {
                return [
                  createVNode("p", { class: "h-4 mb-1 text-xs font-medium truncate u-text-gray-500" }, toDisplayString(directory(unref(next)._path)), 1),
                  createVNode("p", { class: "flex items-center gap-3" }, [
                    createVNode("span", { class: "flex-1 font-medium leading-5 truncate" }, toDisplayString(unref(next).title), 1),
                    createVNode(_component_Icon, {
                      name: "heroicons-outline:arrow-sm-right",
                      class: "flex-shrink-0 w-5 h-5"
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsPrevNext.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DocsPrevNext = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const useScrollspy = () => {
  const observer = ref();
  const visibleHeadings = ref([]);
  const activeHeadings = ref([]);
  const updateHeadings = (headings) => headings.forEach((heading) => {
    observer.value.observe(heading);
  });
  watch(visibleHeadings, (val, oldVal) => {
    if (val.length === 0) {
      activeHeadings.value = oldVal;
    } else {
      activeHeadings.value = val;
    }
  });
  return {
    visibleHeadings,
    activeHeadings,
    updateHeadings
  };
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DocsTocLinks",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  emits: ["move"],
  setup(__props, { emit }) {
    const route = useRoute();
    useRouter();
    const { activeHeadings, updateHeadings } = useScrollspy();
    watch(
      () => route.path,
      () => {
      },
      {
        immediate: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DocsTocLinks = _sfc_main$2;
      _push(`<ul${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(__props.links, (link) => {
        _push(`<li class="${ssrRenderClass([[{ "pl-3": link.depth === 3, "pl-6": link.depth === 4 }], "min-w-0 group"])}"><a${ssrRenderAttr("href", `#${link.id}`)} class="${ssrRenderClass([[unref(activeHeadings).includes(link.id) ? "text-primary-500" : "u-text-gray-500 hover:u-text-gray-900"], "block py-1 text-sm truncate lg:pr-3"])}">${ssrInterpolate(link.text)}</a>`);
        if (link.children) {
          _push(ssrRenderComponent(_component_DocsTocLinks, {
            links: link.children
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsTocLinks.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DocsTocLinks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DocsToc",
  __ssrInlineRender: true,
  emits: ["move"],
  setup(__props, { emit }) {
    const { toc } = useContent();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_DocsTocLinks = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col space-y-1 sm:space-y-2" }, _attrs))}>`);
      if ((_b = (_a = unref(toc)) == null ? void 0 : _a.links) == null ? void 0 : _b.length) {
        _push(`<!--[--><div class="items-center hidden overflow-hidden text-sm font-semibold lg:flex"><span>Table of Contents</span></div>`);
        _push(ssrRenderComponent(_component_DocsTocLinks, {
          links: unref(toc).links,
          onMove: ($event) => emit("move")
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsToc.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DocsToc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DocsPageContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { page, navigation } = useContent();
    const route = useRoute();
    const fallbackValue = (value, fallback = true) => {
      var _a;
      if (typeof ((_a = page.value) == null ? void 0 : _a[value]) !== "undefined") {
        return page.value[value];
      }
      return fallback;
    };
    const hasBody = computed(() => {
      var _a, _b, _c;
      return !page.value || ((_c = (_b = (_a = page.value) == null ? void 0 : _a.body) == null ? void 0 : _b.children) == null ? void 0 : _c.length) > 0;
    });
    const hasToc = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_a = page.value) == null ? void 0 : _a.toc) !== false && ((_e = (_d = (_c = (_b = page.value) == null ? void 0 : _b.body) == null ? void 0 : _c.toc) == null ? void 0 : _d.links) == null ? void 0 : _e.length) >= 2;
    });
    const hasAside = computed(() => {
      var _a, _b;
      return ((_a = page.value) == null ? void 0 : _a.aside) !== false && ((_b = navigation.value) == null ? void 0 : _b.length) > 1;
    });
    const bottom = computed(() => fallbackValue("bottom", true));
    const isOpen = ref(false);
    const asideNav = ref(null);
    const getParentPath = () => route.path.split("/").slice(0, 2).join("/");
    useState("asideScroll", () => {
      var _a;
      return {
        parentPath: getParentPath(),
        scrollTop: ((_a = asideNav.value) == null ? void 0 : _a.scrollTop) || 0
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppContainer = _sfc_main$e;
      const _component_DocsAside = _sfc_main$5;
      const _component_Alert = _sfc_main$3$1;
      const _component_ProseCodeInline = __nuxt_component_3;
      const _component_DocsPageBottom = _sfc_main$4;
      const _component_ProseHr = __nuxt_component_5;
      const _component_DocsPrevNext = _sfc_main$3;
      const _component_Icon = _sfc_main$k;
      const _component_DocsToc = _sfc_main$1;
      _push(ssrRenderComponent(_component_AppContainer, mergeProps({
        padded: "",
        class: "relative flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(hasAside)) {
              _push2(`<aside class="lg:top-header hidden overflow-y-auto overflow-x-hidden pb-8 lg:sticky lg:col-span-2 lg:block lg:max-h-[calc(100vh-var(--header-height))] lg:self-start lg:pt-8" data-v-b001d96c${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DocsAside, null, null, _parent2, _scopeId));
              _push2(`</aside>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<article class="${ssrRenderClass([{
              "lg:col-span-12": !unref(hasAside) && !unref(hasToc),
              "lg:col-span-10": (!unref(hasToc) || !unref(hasAside)) && !(!unref(hasAside) && !unref(hasToc)),
              "lg:col-span-8": unref(hasToc) && unref(hasAside),
              "pt-12 lg:pt-8": unref(hasToc)
            }, "relative flex flex-col flex-1 pt-8 pb-8 lg:mt-0 page-body"])}" data-v-b001d96c${_scopeId}>`);
            if (unref(hasBody)) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(_component_Alert, {
                type: "info",
                class: "!mt-0"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Start writing in `);
                    _push3(ssrRenderComponent(_component_ProseCodeInline, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`content/${ssrInterpolate(unref(page)._file)}`);
                        } else {
                          return [
                            createTextVNode("content/" + toDisplayString(unref(page)._file), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(` to see this page taking shape. `);
                  } else {
                    return [
                      createTextVNode(" Start writing in "),
                      createVNode(_component_ProseCodeInline, null, {
                        default: withCtx(() => [
                          createTextVNode("content/" + toDisplayString(unref(page)._file), 1)
                        ]),
                        _: 1
                      }),
                      createTextVNode(" to see this page taking shape. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            if (unref(hasBody) && unref(page) && unref(bottom)) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_DocsPageBottom, null, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_ProseHr, null, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_DocsPrevNext, null, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</article>`);
            if (unref(hasToc)) {
              _push2(`<div class="${ssrRenderClass([{
                "flex items-center lg:block": !isOpen.value
              }, "sticky flex items-center px-4 -mx-4 -mt-8 toc top-header lg:max-h-page sm:-mx-6 sm:px-6 lg:col-span-2 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none overflow-y-auto overflow-x-hidden"])}" data-v-b001d96c${_scopeId}><div class="w-full cursor-pointer sm:cursor-auto" data-v-b001d96c${_scopeId}><button class="flex items-center gap-1 py-3 lg:hidden" data-v-b001d96c${_scopeId}><span class="text-xs font-semibold" data-v-b001d96c${_scopeId}>Table of Contents</span>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "heroicons-outline:chevron-right",
                class: ["w-4 h-4 transition-transform duration-100 transform", [isOpen.value ? "rotate-90" : "rotate-0"]]
              }, null, _parent2, _scopeId));
              _push2(`</button>`);
              _push2(ssrRenderComponent(_component_DocsToc, {
                class: ["mb-4 lg:mt-0", [isOpen.value ? "lg:block" : "hidden lg:block"]],
                onMove: ($event) => isOpen.value = false
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(hasAside) ? (openBlock(), createBlock("aside", {
                key: 0,
                ref_key: "asideNav",
                ref: asideNav,
                class: "lg:top-header hidden overflow-y-auto overflow-x-hidden pb-8 lg:sticky lg:col-span-2 lg:block lg:max-h-[calc(100vh-var(--header-height))] lg:self-start lg:pt-8"
              }, [
                createVNode(_component_DocsAside)
              ], 512)) : createCommentVNode("", true),
              createVNode("article", {
                class: ["relative flex flex-col flex-1 pt-8 pb-8 lg:mt-0 page-body", {
                  "lg:col-span-12": !unref(hasAside) && !unref(hasToc),
                  "lg:col-span-10": (!unref(hasToc) || !unref(hasAside)) && !(!unref(hasAside) && !unref(hasToc)),
                  "lg:col-span-8": unref(hasToc) && unref(hasAside),
                  "pt-12 lg:pt-8": unref(hasToc)
                }]
              }, [
                unref(hasBody) ? renderSlot(_ctx.$slots, "default", { key: 0 }, void 0, true) : (openBlock(), createBlock(_component_Alert, {
                  key: 1,
                  type: "info",
                  class: "!mt-0"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Start writing in "),
                    createVNode(_component_ProseCodeInline, null, {
                      default: withCtx(() => [
                        createTextVNode("content/" + toDisplayString(unref(page)._file), 1)
                      ]),
                      _: 1
                    }),
                    createTextVNode(" to see this page taking shape. ")
                  ]),
                  _: 1
                })),
                unref(hasBody) && unref(page) && unref(bottom) ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                  createVNode(_component_DocsPageBottom),
                  createVNode(_component_ProseHr),
                  createVNode(_component_DocsPrevNext)
                ], 64)) : createCommentVNode("", true)
              ], 2),
              unref(hasToc) ? (openBlock(), createBlock("div", {
                key: 1,
                class: [{
                  "flex items-center lg:block": !isOpen.value
                }, "sticky flex items-center px-4 -mx-4 -mt-8 toc top-header lg:max-h-page sm:-mx-6 sm:px-6 lg:col-span-2 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none overflow-y-auto overflow-x-hidden"]
              }, [
                createVNode("div", {
                  class: "w-full cursor-pointer sm:cursor-auto",
                  onClick: ($event) => isOpen.value = !isOpen.value
                }, [
                  createVNode("button", { class: "flex items-center gap-1 py-3 lg:hidden" }, [
                    createVNode("span", { class: "text-xs font-semibold" }, "Table of Contents"),
                    createVNode(_component_Icon, {
                      name: "heroicons-outline:chevron-right",
                      class: ["w-4 h-4 transition-transform duration-100 transform", [isOpen.value ? "rotate-90" : "rotate-0"]]
                    }, null, 8, ["class"])
                  ]),
                  createVNode(_component_DocsToc, {
                    class: ["mb-4 lg:mt-0", [isOpen.value ? "lg:block" : "hidden lg:block"]],
                    onMove: ($event) => isOpen.value = false
                  }, null, 8, ["class", "onMove"])
                ], 8, ["onClick"])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsPageContent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b001d96c"]]);
const DocsPageContent = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0
}, Symbol.toStringTag, { value: "Module" }));

export { DocsAside as D, __nuxt_component_0 as _, DocsPageBottom as a, DocsPrevNext as b, DocsTocLinks as c, DocsToc as d, DocsPageContent as e };
//# sourceMappingURL=DocsPageContent.bec8eeca.mjs.map
