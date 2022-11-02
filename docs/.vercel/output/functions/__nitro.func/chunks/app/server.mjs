import { getCurrentInstance, toRef, isRef, inject, ref, defineAsyncComponent, version, defineComponent, h, computed, unref, Text, resolveComponent, useSSRContext, watch, useSlots, withAsyncContext, mergeProps, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, createCommentVNode, toDisplayString, createElementBlock, Suspense, Transition, provide, reactive, createTextVNode, shallowRef, createElementVNode, Fragment as Fragment$1, renderList, createApp, onErrorCaptured, nextTick, watchEffect } from 'vue';
import { $fetch as $fetch$1 } from 'ohmyfetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import destr from 'destr';
import { withoutTrailingSlash, withLeadingSlash, joinURL, hasProtocol, withBase, isEqual as isEqual$1, parseURL } from 'ufo';
import { appendHeader, createError as createError$1, sendRedirect } from 'h3';
import { defuFn } from 'defu';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter } from 'vue-router';
import { pascalCase } from 'scule';
import { find, html } from 'property-information';
import htmlTags from 'html-tags';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrRenderSuspense } from 'vue/server-renderer';
import { Icon as Icon$1 } from '@iconify/vue/dist/offline';
import { loadIcon } from '@iconify/vue';
import { hash, isEqual } from 'ohash';
import { parse, serialize } from 'cookie-es';
import { plugin } from 'pinceau/runtime';
import { a as useRuntimeConfig$1 } from '../nitro/vercel.mjs';
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

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin2, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin2 of plugins2) {
    await applyPlugin(nuxtApp, plugin2);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin2) => {
    if (typeof plugin2 !== "function") {
      return null;
    }
    if (plugin2.length > 1) {
      return (nuxtApp) => plugin2(nuxtApp, nuxtApp.provide);
    }
    return plugin2;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin2) {
  plugin2[NuxtPluginIndicator] = true;
  return plugin2;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const addRouteMiddleware = (name, middleware, options = {}) => {
  const nuxtApp = useNuxtApp();
  if (options.global || typeof name === "function") {
    nuxtApp._middleware.global.push(typeof name === "function" ? name : middleware);
  } else {
    nuxtApp._middleware.named[name] = middleware;
  }
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie = ref((_b = cookies[name]) != null ? _b : (_a = opts.default) == null ? void 0 : _a.call(opts));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, { ...opts, maxAge: -1 });
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName2 = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName2,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0$3 = defineNuxtLink({ componentName: "NuxtLink" });
const nuxtLink = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defineNuxtLink,
  default: __nuxt_component_0$3
}, Symbol.toStringTag, { value: "Module" }));
const cfg0 = defineAppConfig({
  docus: {
    title: "tRPC Nuxt"
  }
});
const cfg1 = defineAppConfig({
  docus: {
    title: "Docus",
    description: "The best place to start your documentation.",
    image: "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png",
    socials: {},
    github: true,
    aside: {
      level: 1,
      exclude: []
    },
    header: {
      title: "",
      logo: false,
      showLinksIcons: false,
      exclude: []
    },
    footer: {
      credits: {
        icon: "IconDocus",
        text: "Powered by Docus",
        href: "https://docus.dev"
      },
      icons: []
    }
  }
});
const inlineConfig = {};
const __appConfig = defuFn(cfg0, cfg1, inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = reactive(__appConfig);
  }
  return nuxtApp._appConfig;
}
function useHead(meta2) {
  useNuxtApp()._useHead(meta2);
}
const components = {
  Alert: defineAsyncComponent(() => Promise.resolve().then(() => Alert).then((c) => c.default || c)),
  ArticleHero: defineAsyncComponent(() => import('./_nuxt/ArticleHero.d0338bff.mjs').then((c) => c.default || c)),
  Badge: defineAsyncComponent(() => import('./_nuxt/Badge.41c3e619.mjs').then((c) => c.default || c)),
  BlockHero: defineAsyncComponent(() => import('./_nuxt/BlockHero.c3ca91c5.mjs').then((c) => c.default || c)),
  ButtonLink: defineAsyncComponent(() => Promise.resolve().then(() => ButtonLink).then((c) => c.default || c)),
  Callout: defineAsyncComponent(() => import('./_nuxt/Callout.c93b06db.mjs').then((c) => c.default || c)),
  Card: defineAsyncComponent(() => import('./_nuxt/Card.f155bd2e.mjs').then((c) => c.default || c)),
  CardGrid: defineAsyncComponent(() => import('./_nuxt/CardGrid.0548d8ab.mjs').then((c) => c.default || c)),
  CodeBlock: defineAsyncComponent(() => import('./_nuxt/CodeBlock.d0ef9a56.mjs').then((c) => c.default || c)),
  CodeGroup: defineAsyncComponent(() => import('./_nuxt/CodeGroup.2acee5a4.mjs').then((c) => c.default || c)),
  CopyButton: defineAsyncComponent(() => import('./_nuxt/CopyButton.b242571a.mjs').then((c) => c.default || c)),
  Icon: defineAsyncComponent(() => Promise.resolve().then(() => Icon).then((c) => c.default || c)),
  List: defineAsyncComponent(() => import('./_nuxt/List.4a15dbda.mjs').then((c) => c.default || c)),
  NuxtImg: defineAsyncComponent(() => import('./_nuxt/NuxtImg.b4209846.mjs').then((c) => c.default || c)),
  Props: defineAsyncComponent(() => import('./_nuxt/Props.eb3d5771.mjs').then((c) => c.default || c)),
  Sandbox: defineAsyncComponent(() => import('./_nuxt/Sandbox.1872a032.mjs').then((c) => c.default || c)),
  SourceLink: defineAsyncComponent(() => import('./_nuxt/SourceLink.0fb611e8.mjs').then((c) => c.default || c)),
  TabsHeader: defineAsyncComponent(() => import('./_nuxt/TabsHeader.c36e1d75.mjs').then((c) => c.default || c)),
  Terminal: defineAsyncComponent(() => import('./_nuxt/Terminal.bf4fd044.mjs').then((c) => c.default || c)),
  VideoPlayer: defineAsyncComponent(() => import('./_nuxt/VideoPlayer.9be17634.mjs').then((c) => c.default || c)),
  ProseA: defineAsyncComponent(() => import('./_nuxt/ProseA.9445f0fb.mjs').then((c) => c.default || c)),
  ProseBlockquote: defineAsyncComponent(() => import('./_nuxt/ProseBlockquote.86696073.mjs').then((c) => c.default || c)),
  ProseCode: defineAsyncComponent(() => import('./_nuxt/ProseCode.f6f344e7.mjs').then((c) => c.default || c)),
  ProseCodeInline: defineAsyncComponent(() => import('./_nuxt/ProseCodeInline.b9cff2ce.mjs').then((c) => c.default || c)),
  ProseEm: defineAsyncComponent(() => import('./_nuxt/ProseEm.7b18d023.mjs').then((c) => c.default || c)),
  ProseH1: defineAsyncComponent(() => import('./_nuxt/ProseH1.e36097c2.mjs').then((c) => c.default || c)),
  ProseH2: defineAsyncComponent(() => import('./_nuxt/ProseH2.a59a63af.mjs').then((c) => c.default || c)),
  ProseH3: defineAsyncComponent(() => import('./_nuxt/ProseH3.7b8aa399.mjs').then((c) => c.default || c)),
  ProseH4: defineAsyncComponent(() => import('./_nuxt/ProseH4.55acb712.mjs').then((c) => c.default || c)),
  ProseHr: defineAsyncComponent(() => import('./_nuxt/ProseHr.05be3620.mjs').then((c) => c.default || c)),
  ProseImg: defineAsyncComponent(() => import('./_nuxt/ProseImg.fa45f54a.mjs').then((c) => c.default || c)),
  ProseLi: defineAsyncComponent(() => import('./_nuxt/ProseLi.a9e055a3.mjs').then((c) => c.default || c)),
  ProseOl: defineAsyncComponent(() => import('./_nuxt/ProseOl.5e234cff.mjs').then((c) => c.default || c)),
  ProseP: defineAsyncComponent(() => import('./_nuxt/ProseP.ea1207fc.mjs').then((c) => c.default || c)),
  ProseStrong: defineAsyncComponent(() => import('./_nuxt/ProseStrong.f9c10a1b.mjs').then((c) => c.default || c)),
  ProseTable: defineAsyncComponent(() => import('./_nuxt/ProseTable.3ea7dd7f.mjs').then((c) => c.default || c)),
  ProseTbody: defineAsyncComponent(() => import('./_nuxt/ProseTbody.82952be8.mjs').then((c) => c.default || c)),
  ProseTd: defineAsyncComponent(() => import('./_nuxt/ProseTd.2488f163.mjs').then((c) => c.default || c)),
  ProseTh: defineAsyncComponent(() => import('./_nuxt/ProseTh.52bbadec.mjs').then((c) => c.default || c)),
  ProseThead: defineAsyncComponent(() => import('./_nuxt/ProseThead.2114e7bd.mjs').then((c) => c.default || c)),
  ProseTr: defineAsyncComponent(() => import('./_nuxt/ProseTr.44ef8373.mjs').then((c) => c.default || c)),
  ProseUl: defineAsyncComponent(() => import('./_nuxt/ProseUl.9d282d73.mjs').then((c) => c.default || c)),
  PageContributors: defineAsyncComponent(() => import('./_nuxt/PageContributors.5b836a40.mjs').then((c) => c.default || c)),
  PageEditLink: defineAsyncComponent(() => import('./_nuxt/PageEditLink.5dbc9a15.mjs').then((c) => c.default || c)),
  Releases: defineAsyncComponent(() => import('./_nuxt/Releases.f8bbe863.mjs').then((c) => c.default || c)),
  ReleasesReactions: defineAsyncComponent(() => import('./_nuxt/ReleasesReactions.6487e480.mjs').then((c) => c.default || c)),
  IconCodeSandBox: defineAsyncComponent(() => import('./_nuxt/IconCodeSandBox.5a8596cc.mjs').then((c) => c.default || c)),
  IconDocus: defineAsyncComponent(() => import('./_nuxt/IconDocus.52e94c6e.mjs').then((c) => c.default || c)),
  IconNuxt: defineAsyncComponent(() => import('./_nuxt/IconNuxt.af013054.mjs').then((c) => c.default || c)),
  IconNuxtContent: defineAsyncComponent(() => import('./_nuxt/IconNuxtContent.5fd49a0b.mjs').then((c) => c.default || c)),
  IconNuxtLabs: defineAsyncComponent(() => import('./_nuxt/IconNuxtLabs.9cb330fe.mjs').then((c) => c.default || c)),
  IconStackBlitz: defineAsyncComponent(() => import('./_nuxt/IconStackBlitz.db7033b5.mjs').then((c) => c.default || c)),
  IconVueTelescope: defineAsyncComponent(() => import('./_nuxt/IconVueTelescope.a7660049.mjs').then((c) => c.default || c)),
  ContentDoc: defineAsyncComponent(() => import('./_nuxt/ContentDoc.03f14928.mjs').then((c) => c.default || c)),
  ContentList: defineAsyncComponent(() => import('./_nuxt/ContentList.7a4e8e80.mjs').then((c) => c.default || c)),
  ContentNavigation: defineAsyncComponent(() => import('./_nuxt/ContentNavigation.a9bae4da.mjs').then((c) => c.default || c)),
  ContentQuery: defineAsyncComponent(() => import('./_nuxt/ContentQuery.4005f85d.mjs').then((c) => c.default || c)),
  ContentRenderer: defineAsyncComponent(() => Promise.resolve().then(() => ContentRenderer).then((c) => c.default || c)),
  ContentRendererMarkdown: defineAsyncComponent(() => Promise.resolve().then(() => ContentRendererMarkdown).then((c) => c.default || c)),
  ContentSlot: defineAsyncComponent(() => Promise.resolve().then(() => ContentSlot$1).then((c) => c.default || c)),
  DocumentDrivenEmpty: defineAsyncComponent(() => Promise.resolve().then(() => DocumentDrivenEmpty).then((c) => c.default || c)),
  Markdown: defineAsyncComponent(() => import('./_nuxt/Markdown.5816b7b6.mjs').then((c) => c.default || c)),
  ProseH5: defineAsyncComponent(() => import('./_nuxt/ProseH5.2121ffb0.mjs').then((c) => c.default || c)),
  ProseH6: defineAsyncComponent(() => import('./_nuxt/ProseH6.e1e9dfa9.mjs').then((c) => c.default || c))
};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
var PROVIDE_KEY = "usehead";
var HEAD_COUNT_KEY = "head:count";
var HEAD_ATTRS_KEY = "data-head-attrs";
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var BODY_TAG_ATTR_NAME = "data-meta-body";
var propsToString = (props) => {
  const handledAttributes = [];
  for (const [key, value] of Object.entries(props)) {
    if (value === false || value == null)
      continue;
    let attribute = key;
    if (value !== true)
      attribute += `="${String(value).replace(/"/g, "&quot;")}"`;
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? ` ${handledAttributes.join(" ")}` : "";
};
var tagToString = (tag) => {
  const attrs = propsToString(tag.props);
  const openTag = `<${tag.tag}${attrs}>`;
  return SELF_CLOSING_TAGS.includes(tag.tag) ? openTag : `${openTag}${tag.children || ""}</${tag.tag}>`;
};
var resolveHeadEntries = (entries, force) => {
  return entries.map((e) => {
    if (e.input && (force || !e.resolved))
      e.input = resolveUnrefHeadInput(e.input);
    return e;
  });
};
var renderHeadToString = async (head) => {
  var _a, _b;
  const headHtml = [];
  const bodyHtml = [];
  let titleHtml = "";
  const attrs = { htmlAttrs: {}, bodyAttrs: {} };
  const resolvedEntries = resolveHeadEntries(head.headEntries);
  for (const h2 in head.hooks["resolved:entries"])
    await head.hooks["resolved:entries"][h2](resolvedEntries);
  const headTags = resolveHeadEntriesToTags(resolvedEntries);
  for (const h2 in head.hooks["resolved:tags"])
    await head.hooks["resolved:tags"][h2](headTags);
  for (const tag of headTags) {
    if ((_a = tag.options) == null ? void 0 : _a.beforeTagRender)
      tag.options.beforeTagRender(tag);
    if (tag.tag === "title")
      titleHtml = tagToString(tag);
    else if (tag.tag === "htmlAttrs" || tag.tag === "bodyAttrs")
      attrs[tag.tag] = { ...attrs[tag.tag], ...tag.props };
    else if ((_b = tag.options) == null ? void 0 : _b.body)
      bodyHtml.push(tagToString(tag));
    else
      headHtml.push(tagToString(tag));
  }
  headHtml.push(`<meta name="${HEAD_COUNT_KEY}" content="${headHtml.length}">`);
  return {
    get headTags() {
      return titleHtml + headHtml.join("");
    },
    get htmlAttrs() {
      return propsToString({
        ...attrs.htmlAttrs,
        [HEAD_ATTRS_KEY]: Object.keys(attrs.htmlAttrs).join(",")
      });
    },
    get bodyAttrs() {
      return propsToString({
        ...attrs.bodyAttrs,
        [HEAD_ATTRS_KEY]: Object.keys(attrs.bodyAttrs).join(",")
      });
    },
    get bodyTags() {
      return bodyHtml.join("");
    }
  };
};
var sortTags = (aTag, bTag) => {
  const tagWeight = (tag) => {
    var _a;
    if ((_a = tag.options) == null ? void 0 : _a.renderPriority)
      return tag.options.renderPriority;
    switch (tag.tag) {
      case "base":
        return -1;
      case "meta":
        if (tag.props.charset)
          return -2;
        if (tag.props["http-equiv"] === "content-security-policy")
          return 0;
        return 10;
      default:
        return 10;
    }
  };
  return tagWeight(aTag) - tagWeight(bTag);
};
var tagDedupeKey = (tag) => {
  const { props, tag: tagName, options } = tag;
  if (["base", "title", "titleTemplate", "bodyAttrs", "htmlAttrs"].includes(tagName))
    return tagName;
  if (tagName === "link" && props.rel === "canonical")
    return "canonical";
  if (props.charset)
    return "charset";
  if (options == null ? void 0 : options.key)
    return `${tagName}:${options.key}`;
  const name = ["id"];
  if (tagName === "meta")
    name.push(...["name", "property", "http-equiv"]);
  for (const n of name) {
    if (typeof props[n] !== "undefined") {
      return `${tagName}:${n}:${props[n]}`;
    }
  }
  return tag.runtime.position;
};
function resolveUnrefHeadInput(ref2) {
  const root = resolveUnref(ref2);
  if (!ref2 || !root) {
    return root;
  }
  if (Array.isArray(root)) {
    return root.map(resolveUnrefHeadInput);
  }
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([key, value]) => {
        if (key === "titleTemplate")
          return [key, unref(value)];
        return [
          key,
          resolveUnrefHeadInput(value)
        ];
      })
    );
  }
  return root;
}
var resolveTag = (name, input, e) => {
  var _a;
  input = { ...input };
  const tag = {
    tag: name,
    props: {},
    runtime: {
      entryId: e.id
    },
    options: {
      ...e.options
    }
  };
  ["hid", "vmid", "key"].forEach((key) => {
    if (input[key]) {
      tag.options.key = input[key];
      delete input[key];
    }
  });
  ["children", "innerHTML", "textContent"].forEach((key) => {
    if (typeof input[key] !== "undefined") {
      tag.children = input[key];
      delete input[key];
    }
  });
  ["body", "renderPriority"].forEach((key) => {
    if (typeof input[key] !== "undefined") {
      tag.options[key] = input[key];
      delete input[key];
    }
  });
  if ((_a = tag.options) == null ? void 0 : _a.body)
    input[BODY_TAG_ATTR_NAME] = true;
  tag.props = input;
  return tag;
};
var headInputToTags = (e) => {
  return Object.entries(e.input).filter(([, v]) => typeof v !== "undefined").map(([key, value]) => {
    return (Array.isArray(value) ? value : [value]).map((props) => {
      switch (key) {
        case "title":
        case "titleTemplate":
          return {
            tag: key,
            children: props,
            props: {},
            runtime: { entryId: e.id },
            options: e.options
          };
        case "base":
        case "meta":
        case "link":
        case "style":
        case "script":
        case "noscript":
        case "htmlAttrs":
        case "bodyAttrs":
          return resolveTag(key, props, e);
        default:
          return false;
      }
    });
  }).flat().filter((v) => !!v);
};
var renderTitleTemplate = (template, title) => {
  if (template == null)
    return title || null;
  if (typeof template === "function")
    return template(title);
  return template.replace("%s", title != null ? title : "");
};
var resolveHeadEntriesToTags = (entries) => {
  const deduping = {};
  const resolvedEntries = resolveHeadEntries(entries);
  resolvedEntries.forEach((entry2, entryIndex) => {
    const tags = headInputToTags(entry2);
    tags.forEach((tag, tagIdx) => {
      tag.runtime = tag.runtime || {};
      tag.runtime.position = entryIndex * 1e4 + tagIdx;
      deduping[tagDedupeKey(tag)] = tag;
    });
  });
  let resolvedTags = Object.values(deduping).sort((a, b) => a.runtime.position - b.runtime.position).sort(sortTags);
  const titleTemplateIdx = resolvedTags.findIndex((i) => i.tag === "titleTemplate");
  const titleIdx = resolvedTags.findIndex((i) => i.tag === "title");
  if (titleIdx !== -1 && titleTemplateIdx !== -1) {
    const newTitle = renderTitleTemplate(
      resolvedTags[titleTemplateIdx].children,
      resolvedTags[titleIdx].children
    );
    if (newTitle !== null) {
      resolvedTags[titleIdx].children = newTitle || resolvedTags[titleIdx].children;
    } else {
      resolvedTags = resolvedTags.filter((_, i) => i !== titleIdx);
    }
    resolvedTags = resolvedTags.filter((_, i) => i !== titleTemplateIdx);
  } else if (titleTemplateIdx !== -1) {
    const newTitle = renderTitleTemplate(
      resolvedTags[titleTemplateIdx].children
    );
    if (newTitle !== null) {
      resolvedTags[titleTemplateIdx].children = newTitle;
      resolvedTags[titleTemplateIdx].tag = "title";
    } else {
      resolvedTags = resolvedTags.filter((_, i) => i !== titleTemplateIdx);
    }
  }
  return resolvedTags;
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs))
        el.removeAttribute(key);
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false)
      el.removeAttribute(key);
    else
      el.setAttribute(key, value);
    keys.push(key);
  }
  if (keys.length)
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  else
    el.removeAttribute(HEAD_ATTRS_KEY);
};
var createElement = (tag, document2) => {
  var _a;
  const $el = document2.createElement(tag.tag);
  Object.entries(tag.props).forEach(([k, v]) => {
    if (v !== false) {
      $el.setAttribute(k, v === true ? "" : String(v));
    }
  });
  if (tag.children) {
    if ((_a = tag.options) == null ? void 0 : _a.safe) {
      if (tag.tag !== "script")
        $el.textContent = tag.children;
    } else {
      $el.innerHTML = tag.children;
    }
  }
  return $el;
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a, _b;
  const head = document2.head;
  const body = document2.body;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const bodyMetaElements = body.querySelectorAll(`[${BODY_TAG_ATTR_NAME}]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldHeadElements = [];
  const oldBodyElements = [];
  if (bodyMetaElements) {
    for (let i = 0; i < bodyMetaElements.length; i++) {
      if (bodyMetaElements[i] && ((_a = bodyMetaElements[i].tagName) == null ? void 0 : _a.toLowerCase()) === type)
        oldBodyElements.push(bodyMetaElements[i]);
    }
  }
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_b = j == null ? void 0 : j.tagName) == null ? void 0 : _b.toLowerCase()) === type)
        oldHeadElements.push(j);
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => {
    var _a3;
    var _a2;
    return {
      element: createElement(tag, document2),
      body: (_a3 = (_a2 = tag.options) == null ? void 0 : _a2.body) != null ? _a3 : false
    };
  });
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldHeadElements.length; i++) {
      const oldEl = oldHeadElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldHeadElements.splice(i, 1);
        return false;
      }
    }
    for (let i = 0; i < oldBodyElements.length; i++) {
      const oldEl = oldBodyElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldBodyElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldBodyElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  oldHeadElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    if (t.body)
      body.insertAdjacentElement("beforeend", t.element);
    else
      head.insertBefore(t.element, headCountEl);
  });
  headCountEl.setAttribute(
    "content",
    `${headCount - oldHeadElements.length + newElements.filter((t) => !t.body).length}`
  );
};
var updateDOM = async (head, previousTags, document2) => {
  var _a, _b;
  const tags = {};
  if (!document2)
    document2 = window.document;
  for (const k in head.hooks["before:dom"]) {
    if (await head.hooks["before:dom"][k]() === false)
      return;
  }
  const resolvedEntries = resolveHeadEntries(head.headEntries);
  for (const h2 in head.hooks["resolved:entries"])
    await head.hooks["resolved:entries"][h2](resolvedEntries);
  const headTags = resolveHeadEntriesToTags(resolvedEntries);
  for (const h2 in head.hooks["resolved:tags"])
    await head.hooks["resolved:tags"][h2](headTags);
  for (const tag of headTags) {
    switch (tag.tag) {
      case "title":
        if (typeof tag.children !== "undefined")
          document2.title = tag.children;
        break;
      case "base":
      case "meta":
      case "link":
      case "style":
      case "script":
      case "noscript":
        tags[tag.tag] = tags[tag.tag] || [];
        tags[tag.tag].push(tag);
        break;
    }
  }
  setAttrs(document2.documentElement, ((_a = headTags.find((t) => t.tag === "htmlAttrs")) == null ? void 0 : _a.props) || {});
  setAttrs(document2.body, ((_b = headTags.find((t) => t.tag === "bodyAttrs")) == null ? void 0 : _b.props) || {});
  const tagKeys = /* @__PURE__ */ new Set([...Object.keys(tags), ...previousTags]);
  for (const tag of tagKeys)
    updateElements(document2, tag, tags[tag] || []);
  previousTags.clear();
  Object.keys(tags).forEach((i) => previousTags.add(i));
};
version.startsWith("2.");
var createHead = (initHeadObject) => {
  let entries = [];
  let entryId = 0;
  const previousTags = /* @__PURE__ */ new Set();
  let domUpdateTick = null;
  const head = {
    install(app) {
      if (app.config.globalProperties)
        app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    },
    get headEntries() {
      return entries;
    },
    get headTags() {
      const resolvedEntries = resolveHeadEntries(head.headEntries);
      return resolveHeadEntriesToTags(resolvedEntries);
    },
    addHeadObjs(input, options) {
      return head.addEntry(input, options);
    },
    addEntry(input, options = {}) {
      let resolved = false;
      if (options == null ? void 0 : options.resolved) {
        resolved = true;
        delete options.resolved;
      }
      const entry2 = {
        id: entryId++,
        options,
        resolved,
        input
      };
      entries.push(entry2);
      return {
        remove() {
          entries = entries.filter((_objs) => _objs.id !== entry2.id);
        },
        update(updatedInput) {
          entries = entries.map((e) => {
            if (e.id === entry2.id)
              e.input = updatedInput;
            return e;
          });
        }
      };
    },
    async updateDOM(document2, force) {
      const doDomUpdate = () => {
        domUpdateTick = null;
        return updateDOM(head, previousTags, document2);
      };
      if (force)
        return doDomUpdate();
      return domUpdateTick = domUpdateTick || new Promise((resolve) => nextTick(() => resolve(doDomUpdate())));
    },
    addReactiveEntry(input, options = {}) {
      let entrySideEffect = null;
      const cleanUpWatch = watchEffect(() => {
        const resolvedInput = resolveUnrefHeadInput(input);
        if (entrySideEffect === null) {
          entrySideEffect = head.addEntry(
            resolvedInput,
            { ...options, resolved: true }
          );
        } else {
          entrySideEffect.update(resolvedInput);
        }
      });
      return () => {
        cleanUpWatch();
        if (entrySideEffect)
          entrySideEffect.remove();
      };
    }
  };
  if (initHeadObject)
    head.addEntry(initHeadObject);
  return head;
};
const appPageTransition = false;
const appLayoutTransition = false;
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const appKeepalive = false;
const ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_LZaLBBcRRo = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.addEntry(appHead, { resolved: true });
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = (_meta, options) => {
    {
      head.addEntry(_meta, options);
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const meta2 = await renderHeadToString(head);
      return {
        ...meta2,
        bodyScripts: meta2.bodyTags
      };
    };
  }
});
const metaMixin = {
  created() {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? () => options.head(nuxtApp) : options.head;
    useHead(source);
  }
};
const ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_head_runtime_mixin_plugin_mjs_AvvqvYYfRj = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin(metaMixin);
});
const Fragment = defineComponent({
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const layouts = {
  default: () => import('./_nuxt/default.966a9a65.mjs').then((m) => m.default || m),
  page: () => import('./_nuxt/page.fd4ff09b.mjs').then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => {
      return h(LayoutComponent, {}, context.slots);
    };
  }
});
const __nuxt_component_0$2 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout2 = computed(() => {
      var _a, _b;
      return (_b = (_a = unref(props.name)) != null ? _a : route.meta.layout) != null ? _b : "default";
    });
    return () => {
      var _a;
      const hasLayout = layout2.value && layout2.value in layouts;
      const transitionProps = (_a = route.meta.layoutTransition) != null ? _a : appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && { key: layout2.value, name: layout2.value, hasTransition: !!transitionProps }, context.slots).default()
      }).default();
    };
  }
});
const layout = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$2
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_SLOT = "default";
const rxOn = /^@|^v-on:/;
const rxBind = /^:|^v-bind:/;
const rxModel = /^v-model/;
const nativeInputs = ["select", "textarea", "input"];
const _sfc_main$n = defineComponent({
  name: "ContentRendererMarkdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    excerpt: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    },
    components: {
      type: Object,
      default: () => ({})
    }
  },
  async setup(props) {
    var _a;
    const { content: { tags = {} } } = useRuntimeConfig().public;
    await resolveContentComponents(props.value.body, {
      tags: {
        ...tags,
        ...((_a = props.value) == null ? void 0 : _a._components) || {},
        ...props.components
      }
    });
    return { tags };
  },
  render(ctx) {
    var _a;
    const { tags, tag, value, components: components2 } = ctx;
    if (!value) {
      return null;
    }
    let body = value.body || value;
    if (ctx.excerpt && value.excerpt) {
      body = value.excerpt;
    }
    const meta2 = {
      ...value,
      tags: {
        ...tags,
        ...(value == null ? void 0 : value._components) || {},
        ...components2
      }
    };
    let component = meta2.component || tag;
    if (typeof meta2.component === "object") {
      component = meta2.component.name;
    }
    component = resolveVueComponent(component);
    const children = (body.children || []).map((child) => renderNode(child, h, meta2));
    return h(
      component,
      {
        ...(_a = meta2.component) == null ? void 0 : _a.props,
        ...this.$attrs
      },
      {
        default: createSlotFunction(children)
      }
    );
  }
});
function renderNode(node, h2, documentMeta, parentScope = {}) {
  var _a;
  if (node.type === "text") {
    return h2(Text, node.value);
  }
  const originalTag = node.tag;
  const renderTag = typeof ((_a = node.props) == null ? void 0 : _a.__ignoreMap) === "undefined" && documentMeta.tags[originalTag] || originalTag;
  if (node.tag === "binding") {
    return renderBinding(node, h2, documentMeta, parentScope);
  }
  const component = resolveVueComponent(renderTag);
  if (typeof component === "object") {
    component.tag = originalTag;
  }
  const props = propsToData(node, documentMeta);
  return h2(
    component,
    props,
    renderSlots(node, h2, documentMeta, { ...parentScope, ...props })
  );
}
function renderBinding(node, h2, documentMeta, parentScope = {}) {
  var _a;
  const data = {
    ...parentScope,
    $route: () => useRoute(),
    $document: documentMeta,
    $doc: documentMeta
  };
  const splitter = /\.|\[(\d+)\]/;
  const keys = (_a = node.props) == null ? void 0 : _a.value.trim().split(splitter).filter(Boolean);
  const value = keys.reduce((data2, key) => {
    if (key in data2) {
      if (typeof data2[key] === "function") {
        return data2[key]();
      } else {
        return data2[key];
      }
    }
    return {};
  }, data);
  return h2(Text, value);
}
function renderSlots(node, h2, documentMeta, parentProps) {
  const children = node.children || [];
  const slots = children.reduce((data, node2) => {
    if (!isTemplate(node2)) {
      data[DEFAULT_SLOT].push(renderNode(node2, h2, documentMeta, parentProps));
      return data;
    }
    if (isDefaultTemplate(node2)) {
      data[DEFAULT_SLOT].push(...(node2.children || []).map((child) => renderNode(child, h2, documentMeta, parentProps)));
      return data;
    }
    const slotName = getSlotName(node2);
    data[slotName] = (node2.children || []).map((child) => renderNode(child, h2, documentMeta, parentProps));
    return data;
  }, {
    [DEFAULT_SLOT]: []
  });
  const slotEntries = Object.entries(slots).map(([name, vDom]) => [name, createSlotFunction(vDom)]);
  return Object.fromEntries(slotEntries);
}
function propsToData(node, documentMeta) {
  const { tag = "", props = {} } = node;
  return Object.keys(props).reduce(function(data, key) {
    if (key === "__ignoreMap") {
      return data;
    }
    const value = props[key];
    if (rxModel.test(key) && !nativeInputs.includes(tag)) {
      return propsToDataRxModel(key, value, data, documentMeta);
    }
    if (key === "v-bind") {
      return propsToDataVBind(key, value, data, documentMeta);
    }
    if (rxOn.test(key)) {
      return propsToDataRxOn(key, value, data, documentMeta);
    }
    if (rxBind.test(key)) {
      return propsToDataRxBind(key, value, data, documentMeta);
    }
    const { attribute } = find(html, key);
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      data[attribute] = value.join(" ");
      return data;
    }
    data[attribute] = value;
    return data;
  }, {});
}
function propsToDataRxModel(key, value, data, documentMeta) {
  const number = (d) => +d;
  const trim = (d) => d.trim();
  const noop = (d) => d;
  const mods = key.replace(rxModel, "").split(".").filter((d) => d).reduce((d, k) => {
    d[k] = true;
    return d;
  }, {});
  const field = "value";
  const event = mods.lazy ? "change" : "input";
  const processor = mods.number ? number : mods.trim ? trim : noop;
  data[field] = evalInContext(value, documentMeta);
  data.on = data.on || {};
  data.on[event] = (e) => documentMeta[value] = processor(e);
  return data;
}
function propsToDataVBind(_key, value, data, documentMeta) {
  const val = evalInContext(value, documentMeta);
  data = Object.assign(data, val);
  return data;
}
function propsToDataRxOn(key, value, data, documentMeta) {
  key = key.replace(rxOn, "");
  data.on = data.on || {};
  data.on[key] = () => evalInContext(value, documentMeta);
  return data;
}
function propsToDataRxBind(key, value, data, documentMeta) {
  key = key.replace(rxBind, "");
  data[key] = evalInContext(value, documentMeta);
  return data;
}
const resolveVueComponent = (component) => {
  if (!htmlTags.includes(component)) {
    const componentFn = resolveComponent(pascalCase(component), false);
    if (typeof componentFn === "object") {
      return componentFn;
    }
  }
  return component;
};
function evalInContext(code, context) {
  const result = code.split(".").reduce((o, k) => typeof o === "object" ? o[k] : void 0, context);
  return typeof result === "undefined" ? destr(code) : result;
}
function getSlotName(node) {
  let name = "";
  for (const propName of Object.keys(node.props || {})) {
    if (!propName.startsWith("#") && !propName.startsWith("v-slot:")) {
      continue;
    }
    name = propName.split(/[:#]/, 2)[1];
    break;
  }
  return name || DEFAULT_SLOT;
}
function createSlotFunction(nodes) {
  return nodes.length ? () => mergeTextNodes(nodes) : void 0;
}
function isDefaultTemplate(node) {
  return isTemplate(node) && getSlotName(node) === DEFAULT_SLOT;
}
function isTemplate(node) {
  return node.tag === "template";
}
function mergeTextNodes(nodes) {
  const mergedNodes = [];
  for (const node of nodes) {
    const previousNode = mergedNodes[mergedNodes.length - 1];
    if (node.type === Text && (previousNode == null ? void 0 : previousNode.type) === Text) {
      previousNode.children = previousNode.children + node.children;
    } else {
      mergedNodes.push(node);
    }
  }
  return mergedNodes;
}
async function resolveContentComponents(body, meta2) {
  const components2 = Array.from(new Set(loadComponents(body, meta2)));
  await Promise.all(components2.map(async (c) => {
    const resolvedComponent = resolveComponent(c);
    if ((resolvedComponent == null ? void 0 : resolvedComponent.__asyncLoader) && !resolvedComponent.__asyncResolved) {
      await resolvedComponent.__asyncLoader();
    }
  }));
  function loadComponents(node, documentMeta) {
    var _a;
    if (node.type === "text" || node.tag === "binding") {
      return [];
    }
    const renderTag = typeof ((_a = node.props) == null ? void 0 : _a.__ignoreMap) === "undefined" && documentMeta.tags[node.tag] || node.tag;
    const components22 = [];
    if (node.type !== "root" && !htmlTags.includes(renderTag)) {
      components22.push(renderTag);
    }
    for (const child of node.children || []) {
      components22.push(...loadComponents(child, documentMeta));
    }
    return components22;
  }
}
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+content-edge@2.2.1-27781144.409f03f/node_modules/@nuxt/content-edge/dist/runtime/components/ContentRendererMarkdown.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const ContentRendererMarkdown = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = defineComponent({
  name: "ContentRenderer",
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({})
    },
    excerpt: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props) {
    watch(
      () => props.excerpt,
      (newExcerpt) => {
        var _a, _b, _c;
        if (newExcerpt && !((_a = props.value) == null ? void 0 : _a.excerpt)) {
          console.warn(`No excerpt found for document content/${(_b = props == null ? void 0 : props.value) == null ? void 0 : _b._path}.${(_c = props == null ? void 0 : props.value) == null ? void 0 : _c._extension}!`);
          console.warn("Make sure to use <!--more--> in your content if you want to use excerpt feature.");
        }
      },
      {
        immediate: true
      }
    );
  },
  render(ctx) {
    var _a, _b;
    const slots = useSlots();
    const { value, excerpt, tag } = ctx;
    if (!value && (slots == null ? void 0 : slots.empty)) {
      return slots.empty({ value, excerpt, tag, ...this.$attrs });
    }
    if (slots == null ? void 0 : slots.default) {
      return slots.default({ value, excerpt, tag, ...this.$attrs });
    }
    if (value && (value == null ? void 0 : value._type) === "markdown" && ((_b = (_a = value == null ? void 0 : value.body) == null ? void 0 : _a.children) == null ? void 0 : _b.length)) {
      return h(
        _sfc_main$n,
        {
          value,
          excerpt,
          tag,
          ...this.$attrs
        }
      );
    }
    return h(
      "pre",
      null,
      JSON.stringify({ message: "You should use slots with <ContentRenderer>", value, excerpt, tag }, null, 2)
    );
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+content-edge@2.2.1-27781144.409f03f/node_modules/@nuxt/content-edge/dist/runtime/components/ContentRenderer.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const ContentRenderer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = defineComponent({
  name: "DocumentDrivenEmpty",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  render({ value }) {
    return h("div", void 0, [
      h("p", "Document is empty"),
      h("p", `Add content to it by opening ${value._source}/${value._file} file.`)
    ]);
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+content-edge@2.2.1-27781144.409f03f/node_modules/@nuxt/content-edge/dist/runtime/components/DocumentDrivenEmpty.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const DocumentDrivenEmpty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const nuxtApp = useNuxtApp();
    const state = useState("docus-icons", () => ({}));
    const isFetching = ref(false);
    const icon = computed(() => {
      var _a;
      return (_a = state.value) == null ? void 0 : _a[props.name];
    });
    const component = computed(() => nuxtApp.vueApp.component(props.name));
    const loadIconComponent = async () => {
      var _a;
      if (component.value) {
        return;
      }
      if (!((_a = state.value) == null ? void 0 : _a[props.name])) {
        isFetching.value = true;
        state.value[props.name] = await loadIcon(props.name).catch(() => null);
        isFetching.value = false;
      }
    };
    watch(() => props.name, loadIconComponent);
    !component.value && ([__temp, __restore] = withAsyncContext(() => loadIconComponent()), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      if (isFetching.value) {
        _push(`<span${ssrRenderAttrs(_attrs)}></span>`);
      } else if (unref(icon)) {
        _push(ssrRenderComponent(unref(Icon$1), mergeProps({ icon: unref(icon) }, _attrs), null, _parent));
      } else if (unref(component)) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(component)), _attrs, null), _parent);
      } else {
        _push(`<span${ssrRenderAttrs(_attrs)}>${ssrInterpolate(__props.name)}</span>`);
      }
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/Icon.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Icon = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$k
}, Symbol.toStringTag, { value: "Module" }));
const TEXT_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"];
function isTag(vnode, tag) {
  if (vnode.type === tag) {
    return true;
  }
  if (typeof vnode.type === "object" && vnode.type.tag === tag) {
    return true;
  }
  if (vnode.tag === tag) {
    return true;
  }
  return false;
}
function isText(vnode) {
  return isTag(vnode, "text") || typeof vnode.children === "string";
}
function nodeChildren(node) {
  if (Array.isArray(node.children) || typeof node.children === "string") {
    return node.children;
  }
  if (typeof node.children.default === "function") {
    return node.children.default();
  }
  return [];
}
function nodeTextContent(node) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join("");
  }
  if (isText(node)) {
    return node.children || node.value;
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).join("");
  }
  return "";
}
function unwrap(vnode, tags = ["p"]) {
  if (Array.isArray(vnode)) {
    return vnode.flatMap((node) => unwrap(node, tags));
  }
  let result = vnode;
  if (tags.some((tag) => tag === "*" || isTag(vnode, tag))) {
    result = nodeChildren(vnode) || vnode;
    if (!Array.isArray(result) && TEXT_TAGS.some((tag) => isTag(vnode, tag))) {
      result = [result];
    }
  }
  return result;
}
function flatUnwrap(vnodes, tags = ["p"]) {
  vnodes = Array.isArray(vnodes) ? vnodes : [vnodes];
  if (!tags.length) {
    return vnodes;
  }
  return vnodes.flatMap((vnode) => flatUnwrap(unwrap(vnode, [tags[0]]), tags.slice(1))).filter((vnode) => !(isText(vnode) && nodeTextContent(vnode).trim() === ""));
}
const withContentBase = (url) => withBase(url, "/api/" + useRuntimeConfig().public.content.base);
const useUnwrap = () => ({
  unwrap,
  flatUnwrap
});
const addPrerenderPath = (path) => {
  const event = useRequestEvent();
  event.res.setHeader(
    "x-nitro-prerender",
    [
      event.res.getHeader("x-nitro-prerender"),
      path
    ].filter(Boolean).join(",")
  );
};
const shouldUseClientDB = () => {
  useRuntimeConfig().content;
  {
    return false;
  }
};
const _sfc_main$j = defineComponent({
  name: "ContentSlot",
  functional: true,
  props: {
    use: {
      type: Function,
      default: void 0
    },
    unwrap: {
      type: [Boolean, String],
      default: false
    }
  },
  setup(props) {
    const { parent } = getCurrentInstance();
    const { between, default: fallbackSlot } = useSlots();
    const tags = computed(() => {
      if (typeof props.unwrap === "string") {
        return props.unwrap.split(" ");
      }
      return ["*"];
    });
    return {
      fallbackSlot,
      tags,
      between,
      parent
    };
  },
  render({ use, unwrap: unwrap2, fallbackSlot, between, tags, parent }) {
    var _a;
    try {
      let slot = use;
      if (typeof use === "string") {
        slot = (parent == null ? void 0 : parent.slots[use]) || ((_a = parent == null ? void 0 : parent.parent) == null ? void 0 : _a.slots[use]);
        console.warn(`Please set :use="$slots.${use}" in <ContentSlot> component to enable reactivity`);
      }
      if (!slot) {
        return fallbackSlot ? fallbackSlot() : h("div");
      }
      if (!unwrap2) {
        return [slot()];
      }
      const { flatUnwrap: flatUnwrap2 } = useUnwrap();
      const unwrapped = flatUnwrap2(slot(), tags);
      if (between) {
        return unwrapped.flatMap(
          (vnode, index) => index === 0 ? [vnode] : [between(), vnode]
        );
      }
      return unwrapped.reduce((acc, item) => {
        if (typeof item.children === "string") {
          if (typeof acc[acc.length - 1] === "string") {
            acc[acc.length - 1] += item.children;
          } else {
            acc.push(item.children);
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    } catch (e) {
      return h("div");
    }
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+content-edge@2.2.1-27781144.409f03f/node_modules/@nuxt/content-edge/dist/runtime/components/ContentSlot.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const ContentSlot = _sfc_main$j;
const ContentSlot$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContentSlot
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "ButtonLink",
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "medium"
    },
    bold: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    transparent: {
      type: Boolean,
      default: false
    },
    blank: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      const _component_ContentSlot = ContentSlot;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        class: ["button-link", [__props.size, __props.bold ? "font-semibold" : "font-medium"]],
        to: __props.href,
        target: __props.blank ? "_blank" : void 0
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.icon) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: __props.icon,
                class: "w-4 h-4 mr-2"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_ContentSlot, {
              use: _ctx.$slots.default,
              unwrap: "p ul li"
            }, null, _parent2, _scopeId));
          } else {
            return [
              __props.icon ? (openBlock(), createBlock(_component_Icon, {
                key: 0,
                name: __props.icon,
                class: "w-4 h-4 mr-2"
              }, null, 8, ["name"])) : createCommentVNode("", true),
              createVNode(_component_ContentSlot, {
                use: _ctx.$slots.default,
                unwrap: "p ul li"
              }, null, 8, ["use"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/ButtonLink.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __nuxt_component_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-df52924a"]]);
const ButtonLink = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$h = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  const _component_ButtonLink = __nuxt_component_1$3;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-1 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8" }, _attrs))}><div class="mx-auto max-w-max"><main class="sm:flex"><p class="text-4xl font-extrabold text-primary-500 sm:text-5xl"> 404 </p><div class="sm:ml-6"><div class="sm:u-border-gray-200 sm:border-l sm:pl-6"><h1 class="text-4xl font-extrabold tracking-tight u-text-gray-900 sm:text-5xl"> Not Found </h1><p class="mt-1 text-xl"> This is not the page you&#39;re looking for. </p></div><div class="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">`);
  _push(ssrRenderComponent(_component_ButtonLink, {
    href: "/",
    size: "large",
    variant: "primary"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Go back home `);
      } else {
        return [
          createTextVNode(" Go back home ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></main></div></div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/DocumentDrivenNotFound.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __nuxt_component_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$3]]);
const DocumentDrivenNotFound = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$1
}, Symbol.toStringTag, { value: "Module" }));
const useContentState = () => {
  const pages = useState("dd-pages", () => ({}));
  const surrounds = useState("dd-surrounds", () => ({}));
  const navigation = useState("dd-navigation");
  const globals = useState("dd-globals", () => ({}));
  return {
    pages,
    surrounds,
    navigation,
    globals
  };
};
const useContent = () => {
  const { navigation, pages, surrounds, globals } = useContentState();
  const _path = computed(() => withoutTrailingSlash(useRoute().path));
  const page2 = computed(() => pages.value[_path.value]);
  const surround = computed(() => surrounds.value[_path.value]);
  const toc = computed(() => {
    var _a, _b;
    return (_b = (_a = page2 == null ? void 0 : page2.value) == null ? void 0 : _a.body) == null ? void 0 : _b.toc;
  });
  const type = computed(() => {
    var _a;
    return (_a = page2.value) == null ? void 0 : _a.type;
  });
  const excerpt = computed(() => {
    var _a;
    return (_a = page2.value) == null ? void 0 : _a.excerpt;
  });
  const layout2 = computed(() => {
    var _a;
    return (_a = page2.value) == null ? void 0 : _a.layout;
  });
  const next = computed(() => {
    var _a;
    return (_a = surround.value) == null ? void 0 : _a[1];
  });
  const prev = computed(() => {
    var _a;
    return (_a = surround.value) == null ? void 0 : _a[0];
  });
  return {
    globals,
    navigation,
    surround,
    page: page2,
    excerpt,
    toc,
    type,
    layout: layout2,
    next,
    prev
  };
};
const useContentHead = (_content, to = useRoute()) => {
  const content = unref(_content);
  const refreshHead = (data = content) => {
    if (!to.path || !data) {
      return;
    }
    const head = Object.assign({}, (data == null ? void 0 : data.head) || {});
    const title = head.title || (data == null ? void 0 : data.title);
    if (title) {
      head.title = title;
    }
    head.meta = [...head.meta || []];
    const description = (head == null ? void 0 : head.description) || (data == null ? void 0 : data.description);
    if (description && head.meta.filter((m) => m.name === "description").length === 0) {
      head.meta.push({
        name: "description",
        content: description
      });
    }
    const image = (head == null ? void 0 : head.image) || (data == null ? void 0 : data.image);
    if (image && head.meta.filter((m) => m.property === "og:image").length === 0) {
      if (typeof image === "string") {
        head.meta.push({
          property: "og:image",
          content: image
        });
      }
      if (typeof image === "object") {
        const imageKeys = [
          "src",
          "secure_url",
          "type",
          "width",
          "height",
          "alt"
        ];
        for (const key of imageKeys) {
          if (key === "src" && image.src) {
            head.meta.push({
              property: "og:image",
              content: image[key]
            });
          } else if (image[key]) {
            head.meta.push({
              property: `og:image:${key}`,
              content: image[key]
            });
          }
        }
      }
    }
    {
      useHead(head);
    }
  };
  watch(() => unref(_content), refreshHead, { immediate: true });
};
const meta = void 0;
const _routes = [
  {
    name: "slug",
    path: "/:slug(.*)*",
    file: "/Users/wobsoriano/tmp/trpc-nuxt/node_modules/.pnpm/@nuxt+content-edge@2.2.1-27781144.409f03f/node_modules/@nuxt/content-edge/dist/runtime/pages/document-driven.vue",
    children: [],
    meta,
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/document-driven.948a6a20.mjs').then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior: (to, _, savedPosition) => {
    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        const top = parseFloat(getComputedStyle(el).scrollMarginTop);
        return {
          el: to.hash,
          behavior: "smooth",
          top
        };
      }
      return {
        el: to.hash,
        behavior: "smooth"
      };
    }
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
};
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (typeof result === "boolean") {
    return result;
  }
  return createError(result);
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {};
const ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_pages_runtime_router_mjs_C5BzmoDD65 = defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b, _c, _d;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = (_b = (_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) != null ? _b : createMemoryHistory(routerBase);
  const routes = (_d = (_c = routerOptions.routes) == null ? void 0 : _c.call(routerOptions, _routes)) != null ? _d : _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c2, _d2;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d2 = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d2.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    callWithNuxt(nuxtApp, showError, [error2]);
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2, _b2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating) {
      to.meta.layout = (_a2 = initialLayout.value) != null ? _a2 : to.meta.layout;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, showError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.event.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual$1(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        force: true
      });
    } catch (error2) {
      callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const get = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);
const _pick = (obj, condition) => Object.keys(obj).filter(condition).reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
const apply = (fn) => (data) => Array.isArray(data) ? data.map((item) => fn(item)) : fn(data);
const detectProperties = (keys) => {
  const prefixes = [];
  const properties = [];
  for (const key of keys) {
    if (["$", "_"].includes(key)) {
      prefixes.push(key);
    } else {
      properties.push(key);
    }
  }
  return { prefixes, properties };
};
const withoutKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => !properties.includes(key) && !prefixes.includes(key[0]));
};
const withKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => properties.includes(key) || prefixes.includes(key[0]));
};
const sortList = (data, params) => {
  const comperable = new Intl.Collator(params.$locale, {
    numeric: params.$numeric,
    caseFirst: params.$caseFirst,
    sensitivity: params.$sensitivity
  });
  const keys = Object.keys(params).filter((key) => !key.startsWith("$"));
  for (const key of keys) {
    data = data.sort((a, b) => {
      const values = [get(a, key), get(b, key)].map((value) => {
        if (value === null) {
          return void 0;
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      if (params[key] === -1) {
        values.reverse();
      }
      return comperable.compare(values[0], values[1]);
    });
  }
  return data;
};
const assertArray = (value, message = "Expected an array") => {
  if (!Array.isArray(value)) {
    throw new TypeError(message);
  }
};
const ensureArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const arrayParams = ["sort", "where", "only", "without"];
const createQuery = (fetcher, intitialParams) => {
  const queryParams = {
    ...intitialParams
  };
  for (const key of arrayParams) {
    if (queryParams[key]) {
      queryParams[key] = ensureArray(queryParams[key]);
    }
  }
  const $set = (key, fn = (v) => v) => {
    return (...values) => {
      queryParams[key] = fn(...values);
      return query;
    };
  };
  const query = {
    params: () => queryParams,
    only: $set("only", ensureArray),
    without: $set("without", ensureArray),
    where: $set("where", (q) => [...ensureArray(queryParams.where), q]),
    sort: $set("sort", (sort) => [...ensureArray(queryParams.sort), ...ensureArray(sort)]),
    limit: $set("limit", (v) => parseInt(String(v), 10)),
    skip: $set("skip", (v) => parseInt(String(v), 10)),
    find: () => fetcher(query),
    findOne: () => {
      queryParams.first = true;
      return fetcher(query);
    },
    findSurround: (surroundQuery, options) => {
      queryParams.surround = { query: surroundQuery, ...options };
      return fetcher(query);
    },
    locale: (_locale) => query.where({ _locale })
  };
  return query;
};
function jsonStringify(value) {
  return JSON.stringify(value, regExpReplacer);
}
function regExpReplacer(_key, value) {
  if (value instanceof RegExp) {
    return `--REGEX ${value.toString()}`;
  }
  return value;
}
const createQueryFetch = (path) => async (query) => {
  var _a;
  if (path) {
    if (query.params().first && (query.params().where || []).length === 0) {
      query.where({ _path: withoutTrailingSlash(path) });
    } else {
      query.where({ _path: new RegExp(`^${path.replace(/[-[\]{}()*+.,^$\s/]/g, "\\$&")}`) });
    }
  }
  if (!((_a = query.params().sort) == null ? void 0 : _a.length)) {
    query.sort({ _file: 1, $numeric: true });
  }
  const params = query.params();
  const apiPath = withContentBase(`/query/${hash(params)}.json`);
  {
    addPrerenderPath(apiPath);
  }
  if (shouldUseClientDB()) {
    const db = await import('./_nuxt/client-db.6f1ed46a.mjs').then((m) => m.useContentDatabase());
    return db.fetch(query);
  }
  const data = await $fetch(apiPath, {
    method: "GET",
    responseType: "json",
    params: {
      _params: jsonStringify(params),
      previewToken: useCookie("previewToken").value
    }
  });
  if (typeof data === "string" && data.startsWith("<!DOCTYPE html>")) {
    throw new Error("Not found");
  }
  return data;
};
function queryContent(query, ...pathParts) {
  if (typeof query === "string") {
    return createQuery(createQueryFetch(withLeadingSlash(joinURL(query, ...pathParts))));
  }
  return createQuery(createQueryFetch(), query);
}
const navBottomLink = (link) => {
  if (!link.children) {
    return link._path;
  }
  for (const child of (link == null ? void 0 : link.children) || []) {
    const result = navBottomLink(child);
    if (result) {
      return result;
    }
  }
};
const navDirFromPath = (path, tree) => {
  for (const file of tree) {
    if (file._path === path && !file._id) {
      return file.children;
    }
    if (file.children) {
      const result = navDirFromPath(path, file.children);
      if (result) {
        return result;
      }
    }
  }
};
const navPageFromPath = (path, tree) => {
  for (const file of tree) {
    if (file._path === path) {
      return file;
    }
    if (file.children) {
      const result = navPageFromPath(path, file.children);
      if (result) {
        return result;
      }
    }
  }
};
const navKeyFromPath = (path, key, tree) => {
  let value;
  const goDeep = (path2, tree2) => {
    for (const file of tree2) {
      if ((path2 == null ? void 0 : path2.startsWith(file._path)) && file[key]) {
        value = file[key];
      }
      if (file._path === path2) {
        return;
      }
      if (file.children) {
        goDeep(path2, file.children);
      }
    }
  };
  goDeep(path, tree);
  return value;
};
const useContentHelpers = () => {
  return {
    navBottomLink,
    navDirFromPath,
    navPageFromPath,
    navKeyFromPath
  };
};
const fetchContentNavigation = async (queryBuilder) => {
  let params = queryBuilder;
  if (typeof (params == null ? void 0 : params.params) === "function") {
    params = params.params();
  }
  const apiPath = withContentBase(params ? `/navigation/${hash(params)}.json` : "/navigation");
  {
    addPrerenderPath(apiPath);
  }
  if (shouldUseClientDB()) {
    const generateNavigation = await import('./_nuxt/client-db.6f1ed46a.mjs').then((m) => m.generateNavigation);
    return generateNavigation(params || {});
  }
  const data = await $fetch(apiPath, {
    method: "GET",
    responseType: "json",
    params: {
      _params: jsonStringify(params || {}),
      previewToken: useCookie("previewToken").value
    }
  });
  if (typeof data === "string" && data.startsWith("<!DOCTYPE html>")) {
    throw new Error("Not found");
  }
  return data;
};
const ___node_modules__pnpm__64nuxt_43content_edge_642_2_1_27781144_409f03f_node_modules__64nuxt_content_edge_dist_runtime_plugins_documentDriven_mjs_N1K1W9Kztw = defineNuxtPlugin((nuxt) => {
  var _a, _b;
  const { documentDriven: moduleOptions, clientDB } = (_b = (_a = useRuntimeConfig()) == null ? void 0 : _a.public) == null ? void 0 : _b.content;
  const findLayout = (to, page2, navigation, globals) => {
    var _a2;
    if (page2 && (page2 == null ? void 0 : page2.layout)) {
      return page2.layout;
    }
    if (to.matched.length && ((_a2 = to.matched[0].meta) == null ? void 0 : _a2.layout)) {
      return to.matched[0].meta.layout;
    }
    if (navigation && page2) {
      const { navKeyFromPath: navKeyFromPath2 } = useContentHelpers();
      const layoutFromNav = navKeyFromPath2(page2._path, "layout", navigation);
      if (layoutFromNav) {
        return layoutFromNav;
      }
    }
    if (moduleOptions.layoutFallbacks && globals) {
      let layoutFallback;
      for (const fallback of moduleOptions.layoutFallbacks) {
        if (globals[fallback] && globals[fallback].layout) {
          layoutFallback = globals[fallback].layout;
          break;
        }
      }
      if (layoutFallback) {
        return layoutFallback;
      }
    }
    return "default";
  };
  const refresh = async (to, force = false) => {
    const routeConfig = to.meta.documentDriven || {};
    if (to.meta.documentDriven === false) {
      return;
    }
    !force && nuxt.callHook("content:middleware:start");
    const { navigation, pages, globals, surrounds } = useContentState();
    const _path = withoutTrailingSlash(to.path);
    const promises = [];
    if (moduleOptions.navigation && routeConfig.navigation !== false) {
      const navigationQuery = () => {
        const { navigation: navigation2 } = useContentState();
        if (navigation2.value && !force) {
          return navigation2.value;
        }
        return fetchContentNavigation().then((_navigation) => {
          navigation2.value = _navigation;
          return _navigation;
        }).catch((_) => {
        });
      };
      promises.push(navigationQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.globals) {
      const globalsQuery = () => {
        const { globals: globals2 } = useContentState();
        if (typeof moduleOptions.globals === "object" && Array.isArray(moduleOptions.globals)) {
          console.log("Globals must be a list of keys with QueryBuilderParams as a value.");
          return;
        }
        return Promise.all(
          Object.entries(moduleOptions.globals).map(
            ([key, query]) => {
              if (!force && globals2.value[key]) {
                return globals2.value[key];
              }
              let type = "findOne";
              if (query == null ? void 0 : query.type) {
                type = query.type;
              }
              return queryContent(query)[type]().catch(() => {
              });
            }
          )
        ).then(
          (values) => {
            return values.reduce(
              (acc, value, index) => {
                const key = Object.keys(moduleOptions.globals)[index];
                acc[key] = value;
                return acc;
              },
              {}
            );
          }
        );
      };
      promises.push(globalsQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.page && routeConfig.page !== false) {
      let where = { _path };
      if (typeof routeConfig.page === "string") {
        where = { _path: routeConfig.page };
      }
      if (typeof routeConfig.page === "object") {
        where = routeConfig.page;
      }
      const pageQuery = () => {
        const { pages: pages2 } = useContentState();
        if (!force && pages2.value[_path] && pages2.value[_path]._path === _path) {
          return pages2.value[_path];
        }
        return queryContent().where(where).findOne().catch(() => {
        });
      };
      promises.push(pageQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.surround && routeConfig.surround !== false) {
      let surround = _path;
      if (["string", "object"].includes(typeof routeConfig.page)) {
        surround = routeConfig.page;
      }
      if (["string", "object"].includes(typeof routeConfig.surround)) {
        surround = routeConfig.surround;
      }
      const surroundQuery = () => {
        const { surrounds: surrounds2 } = useContentState();
        if (!force && surrounds2.value[_path]) {
          return surrounds2.value[_path];
        }
        return queryContent().where({
          _partial: { $not: true },
          navigation: { $not: false }
        }).without(["body"]).findSurround(surround).catch(() => {
        });
      };
      promises.push(surroundQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    return await Promise.all(promises.map((promise) => promise())).then(async ([
      _navigation,
      _globals,
      _page,
      _surround
    ]) => {
      var _a2, _b2, _c, _d;
      if (_navigation) {
        navigation.value = _navigation;
      }
      if (_globals) {
        globals.value = _globals;
      }
      if (_page == null ? void 0 : _page.redirect) {
        return _page == null ? void 0 : _page.redirect;
      }
      if ((_b2 = (_a2 = _page == null ? void 0 : _page._dir) == null ? void 0 : _a2.navigation) == null ? void 0 : _b2.redirect) {
        return (_d = (_c = _page == null ? void 0 : _page._dir) == null ? void 0 : _c.navigation) == null ? void 0 : _d.redirect;
      }
      if (_page) {
        const layoutName = findLayout(to, _page, _navigation, _globals);
        const layout2 = layouts[layoutName];
        if (layout2 && typeof layout2 === "function") {
          await layout2();
        }
        to.meta.layout = layoutName;
        _page.layout = layoutName;
        pages.value[_path] = _page;
      }
      if (_surround) {
        surrounds.value[_path] = _surround;
      }
    });
  };
  addRouteMiddleware(async (to, from) => {
    if (to.path.includes("favicon.ico")) {
      return;
    }
    const redirect = await refresh(to, false);
    if (redirect) {
      if (hasProtocol(redirect)) {
        return callWithNuxt(nuxt, navigateTo, [redirect, { external: true }]);
      } else {
        return redirect;
      }
    }
  });
  {
    delete nuxt.payload.prerenderedAt;
  }
  nuxt.hook("app:data:refresh", async () => false);
});
const ___node_modules__pnpm__64nuxt_43content_edge_642_2_1_27781144_409f03f_node_modules__64nuxt_content_edge_dist_runtime_plugins_ws_mjs_Whju5gMMZ3 = defineNuxtPlugin(() => {
  useRuntimeConfig().public;
});
const preference = "system";
const componentName = "ColorScheme";
const dataValue = "theme";
const ___node_modules__pnpm__64nuxtjs_43color_mode_643_1_8_node_modules__64nuxtjs_color_mode_dist_runtime_plugin_server_mjs_pKXMIUCV0M = defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      {
        htmlAttrs[`data-${dataValue}`] = colorMode.value;
      }
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const theme = {
  "colors.primary.50": {
    "value": "#d9f1ff",
    "original": "#d9f1ff",
    "attributes": {
      "variable": "var(--colors-primary-50)"
    }
  },
  "colors.primary.100": {
    "value": "#b3e4ff",
    "original": "#b3e4ff",
    "attributes": {
      "variable": "var(--colors-primary-100)"
    }
  },
  "colors.primary.200": {
    "value": "#8dd6ff",
    "original": "#8dd6ff",
    "attributes": {
      "variable": "var(--colors-primary-200)"
    }
  },
  "colors.primary.300": {
    "value": "#66c8ff",
    "original": "#66c8ff",
    "attributes": {
      "variable": "var(--colors-primary-300)"
    }
  },
  "colors.primary.400": {
    "value": "#40bbff",
    "original": "#40bbff",
    "attributes": {
      "variable": "var(--colors-primary-400)"
    }
  },
  "colors.primary.500": {
    "value": "#1aadff",
    "original": "#1aadff",
    "attributes": {
      "variable": "var(--colors-primary-500)"
    }
  },
  "colors.primary.600": {
    "value": "#0090e1",
    "original": "#0090e1",
    "attributes": {
      "variable": "var(--colors-primary-600)"
    }
  },
  "colors.primary.700": {
    "value": "#006ca9",
    "original": "#006ca9",
    "attributes": {
      "variable": "var(--colors-primary-700)"
    }
  },
  "colors.primary.800": {
    "value": "#004870",
    "original": "#004870",
    "attributes": {
      "variable": "var(--colors-primary-800)"
    }
  },
  "colors.primary.900": {
    "value": "#002438",
    "original": "#002438",
    "attributes": {
      "variable": "var(--colors-primary-900)"
    }
  },
  "fonts.primary": {
    "value": "Inter, sans-serif",
    "original": "Inter, sans-serif",
    "attributes": {
      "variable": "var(--fonts-primary)"
    }
  },
  "fonts.code": {
    "value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    "original": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    "attributes": {
      "variable": "var(--fonts-code)"
    }
  },
  "page.height": {
    "value": "calc(100vh - calc(calc(64px + 50px)))",
    "original": "calc(100vh - calc(calc({header.height} + {footer.height})))",
    "attributes": {
      "variable": "var(--page-height)"
    }
  },
  "page.maxWidth": {
    "value": "90rem",
    "original": "90rem",
    "attributes": {
      "variable": "var(--page-max-width)"
    }
  },
  "header.height": {
    "value": "64px",
    "original": "64px",
    "attributes": {
      "variable": "var(--header-height)"
    }
  },
  "footer.height": {
    "value": "50px",
    "original": "50px",
    "attributes": {
      "variable": "var(--footer-height)"
    }
  },
  "screens.lg": {
    "value": "1024px",
    "original": "1024px",
    "attributes": {
      "variable": "var(--screens-lg)"
    }
  },
  "title": {
    "value": "asddsasda 3s",
    "original": "asddsasda 3s",
    "attributes": {
      "variable": "var(--title)"
    }
  },
  "cover.src": {
    "value": "https://res.cloudinary.com/nuxt/image/upload/v1650870623/nuxt3-rc-social_z6qh3m.png",
    "original": "https://res.cloudinary.com/nuxt/image/upload/v1650870623/nuxt3-rc-social_z6qh3m.png",
    "attributes": {
      "variable": "var(--cover-src)"
    }
  },
  "cover.alt": {
    "value": "Nuxt 3 cover image",
    "original": "Nuxt 3 cover image",
    "attributes": {
      "variable": "var(--cover-alt)"
    }
  }
};
const theme$1 = { theme };
const _nuxt_pinceau_imports_mjs_8K3h7hEN4C = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(plugin, { theme: theme$1, colorSchemeMode: "class" });
  nuxtApp.hook("app:rendered", (app) => {
    const content = app.ssrContext.nuxt.vueApp.config.globalProperties.$pinceauSsr.get();
    app.ssrContext.event.pinceauContent = content;
  });
});
const ___node_modules__pnpm__64nuxt_themes_43docus_edge_640_1_0_2a7c428_nuxt_643_0_0_rc_12_node_modules__64nuxt_themes_docus_edge_plugins_menu_ts_CoD95XR15C = defineNuxtPlugin((ctx) => {
  const visible = ref(false);
  const open = () => visible.value = true;
  const close = () => visible.value = false;
  const toggle = () => visible.value = !visible.value;
  ctx.$router.afterEach(() => setTimeout(close, 50));
  return {
    provide: {
      menu: {
        visible,
        close,
        open,
        toggle
      }
    }
  };
});
const _plugins = [
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_LZaLBBcRRo,
  ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_head_runtime_mixin_plugin_mjs_AvvqvYYfRj,
  ___node_modules__pnpm_nuxt_643_0_0_rc_12_node_modules_nuxt_dist_pages_runtime_router_mjs_C5BzmoDD65,
  ___node_modules__pnpm__64nuxt_43content_edge_642_2_1_27781144_409f03f_node_modules__64nuxt_content_edge_dist_runtime_plugins_documentDriven_mjs_N1K1W9Kztw,
  ___node_modules__pnpm__64nuxt_43content_edge_642_2_1_27781144_409f03f_node_modules__64nuxt_content_edge_dist_runtime_plugins_ws_mjs_Whju5gMMZ3,
  ___node_modules__pnpm__64nuxtjs_43color_mode_643_1_8_node_modules__64nuxtjs_color_mode_dist_runtime_plugin_server_mjs_pKXMIUCV0M,
  _nuxt_pinceau_imports_mjs_8K3h7hEN4C,
  ___node_modules__pnpm__64nuxt_themes_43docus_edge_640_1_0_2a7c428_nuxt_643_0_0_rc_12_node_modules__64nuxt_themes_docus_edge_plugins_menu_ts_CoD95XR15C
];
const _sfc_main$g = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./_nuxt/error-component.dd9a2087.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = resolveComponent("App");
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@3.0.0-rc.12/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = {
  __name: "AppLoadingBar",
  __ssrInlineRender: true,
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    height: {
      type: Number,
      default: 3
    }
  },
  setup(__props) {
    const props = __props;
    const nuxtApp = useNuxtApp();
    const data = reactive({
      percent: 0,
      show: false,
      canSucceed: true
    });
    let _timer = null;
    let _throttle = null;
    let _cut;
    function clear() {
      _timer && clearInterval(_timer);
      _throttle && clearTimeout(_throttle);
      _timer = null;
    }
    function start() {
      if (data.show) {
        return;
      }
      clear();
      data.percent = 0;
      data.canSucceed = true;
      if (props.throttle) {
        _throttle = setTimeout(startTimer, props.throttle);
      } else {
        startTimer();
      }
    }
    function increase(num) {
      data.percent = Math.min(100, Math.floor(data.percent + num));
    }
    function finish() {
      data.percent = 100;
      hide();
    }
    function hide() {
      clear();
      setTimeout(() => {
        data.show = false;
        setTimeout(() => {
          data.percent = 0;
        }, 400);
      }, 500);
    }
    function startTimer() {
      data.show = true;
      _cut = 1e4 / Math.floor(props.duration);
      _timer = setInterval(() => {
        increase(_cut);
      }, 100);
    }
    nuxtApp.hook("content:middleware:start", start);
    nuxtApp.hook("page:start", start);
    nuxtApp.hook("page:finish", finish);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["nuxt-progress", {
          "nuxt-progress-failed": !data.canSucceed
        }],
        style: {
          width: `${data.percent}%`,
          left: data.left,
          height: `${props.height}px`,
          opacity: data.show ? 1 : 0,
          backgroundSize: `${100 / data.percent * 100}% auto`
        }
      }, _attrs))}></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/AppLoadingBar.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const AppLoadingBar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "AppContainer",
  __ssrInlineRender: true,
  props: {
    padded: {
      type: Boolean,
      default: true
    },
    fluid: {
      type: Boolean,
      default: false
    },
    constrainedClass: {
      type: String,
      default: "max-w-7xl"
    }
  },
  setup(__props) {
    const props = __props;
    const containerClass = computed(() => {
      return [
        "mx-auto w-full",
        props.padded && "px-4 sm:px-6 lg:px-8",
        !props.fluid && props.constrainedClass,
        props.fluid && "overflow-x-hidden"
      ].filter(Boolean).join(" ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(containerClass) }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/AppContainer.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const AppContainer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$e
}, Symbol.toStringTag, { value: "Module" }));
const useDocus = () => computed(() => useAppConfig().docus);
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "SocialIcons",
  __ssrInlineRender: true,
  props: {
    size: {
      type: String,
      default: "w-5 h-5"
    },
    spacing: {
      type: String,
      default: "p-0"
    }
  },
  setup(__props) {
    const socials = ["twitter", "facebook", "instagram", "youtube", "github", "medium"];
    const docus = useDocus();
    const icons = computed(() => {
      return Object.entries(docus.value.socials || {}).map(([key, value]) => {
        if (typeof value === "object") {
          return value;
        } else if (typeof value === "string" && value && socials.includes(key)) {
          return {
            href: `https://${key}.com/${value}`,
            icon: `fa-brands:${key}`,
            label: value
          };
        } else {
          return null;
        }
      }).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      _push(`<!--[-->`);
      ssrRenderList(unref(icons), (icon) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: icon.label,
          rel: "noopener noreferrer",
          title: icon.label,
          "aria-label": icon.label,
          href: icon.href,
          target: "_blank",
          class: ["u-text-gray-500 hover:u-text-gray-700", [__props.spacing]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (icon.icon) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: icon.icon,
                  class: __props.size
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                icon.icon ? (openBlock(), createBlock(_component_Icon, {
                  key: 0,
                  name: icon.icon,
                  class: __props.size
                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/SocialIcons.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const SocialIcons = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "DocsAsideTree",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: null
    },
    parent: {
      type: Object,
      default: null
    }
  },
  setup(__props) {
    var _a;
    const props = __props;
    const route = useRoute();
    const docus = useDocus();
    const collapsedMap = useState(`docus-docs-aside-collapse-map-${((_a = props.parent) == null ? void 0 : _a._path) || "/"}`, () => {
      if (props.level === 0) {
        return {};
      }
      return props.links.filter((link) => !!link.children).reduce((map, link) => {
        map[link._path] = true;
        return map;
      }, {});
    });
    const isActive = (link) => {
      return route.path === link._path;
    };
    const isCollapsed = (link) => {
      var _a2, _b;
      if (link.children) {
        if (typeof collapsedMap.value[link._path] !== "undefined") {
          return collapsedMap.value[link._path];
        }
        if (link == null ? void 0 : link.collapsed) {
          return link == null ? void 0 : link.collapsed;
        }
        if ((_a2 = docus.value.aside) == null ? void 0 : _a2.collapsed) {
          return (_b = docus.value.aside) == null ? void 0 : _b.collapsed;
        }
      }
      return false;
    };
    const hasNesting = computed(() => props.links.some((link) => link.children));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$k;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_DocsAsideTree = _sfc_main$c;
      _push(`<ul${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(__props.links, (link) => {
        var _a2, _b, _c, _d, _e;
        _push(`<li class="${ssrRenderClass({
          "ml-2": (_a2 = __props.parent) == null ? void 0 : _a2.icon,
          "pl-4": __props.level > 0 && link.children,
          "border-l": __props.level > 0 || !unref(hasNesting),
          "border-primary-400 dark:border-primary-600": isActive(link),
          "u-border-gray-100 hover:u-border-gray-300": !isActive(link)
        })}">`);
        if (link.children) {
          _push(`<button class="u-text-gray-900 group flex w-full cursor-pointer items-center justify-between py-1.5 text-sm font-semibold"><span class="flex items-center">`);
          if (((_b = link == null ? void 0 : link.navigation) == null ? void 0 : _b.icon) || link.icon) {
            _push(ssrRenderComponent(_component_Icon, {
              name: ((_c = link == null ? void 0 : link.navigation) == null ? void 0 : _c.icon) || link.icon,
              class: "w-4 h-4 mr-2"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(((_d = link == null ? void 0 : link.navigation) == null ? void 0 : _d.title) || link.title || link._path)}</span></span><span class="flex">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: isCollapsed(link) ? "lucide:chevrons-up-down" : "lucide:chevrons-down-up",
            class: "w-3 h-3 u-text-gray-400 group-hover:u-text-gray-800"
          }, null, _parent));
          _push(`</span></button>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.redirect ? link.redirect : link._path,
            class: ["flex items-center justify-between py-1.5 text-sm", {
              "pl-4": __props.level > 0 || !unref(hasNesting),
              "text-primary-500 font-medium": isActive(link),
              "u-text-gray-500 hover:u-text-gray-900": !isActive(link)
            }],
            exact: link.exact
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a3, _b2, _c2, _d2, _e2, _f;
              if (_push2) {
                _push2(`<span class="inline-flex items-center"${_scopeId}>`);
                if (((_a3 = link == null ? void 0 : link.navigation) == null ? void 0 : _a3.icon) || link.icon) {
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: ((_b2 = link == null ? void 0 : link.navigation) == null ? void 0 : _b2.icon) || link.icon,
                    class: "w-4 h-4 mr-1"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span${_scopeId}>${ssrInterpolate(((_c2 = link == null ? void 0 : link.navigation) == null ? void 0 : _c2.title) || link.title || link._path)}</span></span>`);
              } else {
                return [
                  createVNode("span", { class: "inline-flex items-center" }, [
                    ((_d2 = link == null ? void 0 : link.navigation) == null ? void 0 : _d2.icon) || link.icon ? (openBlock(), createBlock(_component_Icon, {
                      key: 0,
                      name: ((_e2 = link == null ? void 0 : link.navigation) == null ? void 0 : _e2.icon) || link.icon,
                      class: "w-4 h-4 mr-1"
                    }, null, 8, ["name"])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(((_f = link == null ? void 0 : link.navigation) == null ? void 0 : _f.title) || link.title || link._path), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        if (((_e = link.children) == null ? void 0 : _e.length) && (__props.max === null || __props.level + 1 < __props.max)) {
          _push(ssrRenderComponent(_component_DocsAsideTree, {
            style: !isCollapsed(link) ? null : { display: "none" },
            links: link.children,
            level: __props.level + 1,
            parent: link,
            max: __props.max,
            class: "py-2"
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/docs/DocsAsideTree.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const DocsAsideTree = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const useMenu = () => {
  const { $menu } = useNuxtApp();
  return $menu;
};
const __nuxt_component_0$1 = defineComponent({
  name: "ClientOnly",
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, null, fallbackStr);
    };
  }
});
const cache = /* @__PURE__ */ new WeakMap();
function createClientOnly(component) {
  if (cache.has(component)) {
    return cache.get(component);
  }
  const clone = { ...component };
  if (clone.render) {
    clone.render = (ctx, ...args) => {
      var _a;
      if (ctx.mounted$) {
        const res = component.render(ctx, ...args);
        return res.children === null || typeof res.children === "string" ? createElementVNode(res.type, res.props, res.children, res.patchFlag, res.dynamicProps, res.shapeFlag) : h(res);
      } else {
        return h("div", (_a = ctx.$attrs) != null ? _a : ctx._.attrs);
      }
    };
  } else if (clone.template) {
    clone.template = `
      <template v-if="mounted$">${component.template}</template>
      <template v-else><div></div></template>
    `;
  }
  clone.setup = (props, ctx) => {
    var _a;
    const mounted$ = ref(false);
    return Promise.resolve(((_a = component.setup) == null ? void 0 : _a.call(component, props, ctx)) || {}).then((setupState) => {
      return typeof setupState !== "function" ? { ...setupState, mounted$ } : (...args) => {
        if (mounted$.value) {
          const res = setupState(...args);
          return res.children === null || typeof res.children === "string" ? createElementVNode(res.type, res.props, res.children, res.patchFlag, res.dynamicProps, res.shapeFlag) : h(res);
        } else {
          return h("div", ctx.attrs);
        }
      };
    });
  };
  cache.set(component, clone);
  return clone;
}
const clientOnly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$1,
  createClientOnly
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {
  name: componentName,
  props: {
    placeholder: String,
    tag: {
      type: String,
      default: "span"
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ClientOnly = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_ClientOnly, mergeProps({
    placeholder: $props.placeholder,
    "placeholder-tag": $props.tag
  }, _attrs), null, _parent));
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxtjs+color-mode@3.1.8/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$2]]);
const component_vue3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0
}, Symbol.toStringTag, { value: "Module" }));
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "ColorModeSwitch",
  __ssrInlineRender: true,
  props: {
    size: {
      type: String,
      default: "w-5 h-5"
    }
  },
  setup(__props) {
    const colorMode = useColorMode();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ColorScheme = __nuxt_component_0;
      const _component_Icon = _sfc_main$k;
      _push(`<button${ssrRenderAttrs(mergeProps({
        "aria-label": "Color Mode",
        class: "inline-block u-text-gray-500 hover:u-text-gray-700"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ColorScheme, { placeholder: "..." }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(colorMode).preference === "dark") {
              _push2(ssrRenderComponent(_component_Icon, {
                class: __props.size,
                name: "uil:moon"
              }, null, _parent2, _scopeId));
            } else if (unref(colorMode).preference === "light") {
              _push2(ssrRenderComponent(_component_Icon, {
                class: __props.size,
                name: "uil:sun"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_Icon, {
                class: __props.size,
                name: "uil:desktop"
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              unref(colorMode).preference === "dark" ? (openBlock(), createBlock(_component_Icon, {
                key: 0,
                class: __props.size,
                name: "uil:moon"
              }, null, 8, ["class"])) : unref(colorMode).preference === "light" ? (openBlock(), createBlock(_component_Icon, {
                key: 1,
                class: __props.size,
                name: "uil:sun"
              }, null, 8, ["class"])) : (openBlock(), createBlock(_component_Icon, {
                key: 2,
                class: __props.size,
                name: "uil:desktop"
              }, null, 8, ["class"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/ColorModeSwitch.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const ColorModeSwitch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "NavbarDialog",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigation } = useContent();
    const docus = useDocus();
    const filtered = computed(() => {
      var _a;
      return ((_a = docus.value.header) == null ? void 0 : _a.exclude) || [];
    });
    const links = computed(() => {
      return (navigation.value || []).filter((item) => {
        if (filtered.value.includes(item._path)) {
          return false;
        }
        return true;
      });
    });
    const { visible, open, close } = useMenu();
    watch(visible, (v) => v ? open() : close());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$k;
      const _component_SocialIcons = _sfc_main$d;
      const _component_DocsAsideTree = _sfc_main$c;
      _push(`<!--[--><button class="relative z-10 u-text-gray-500 hover:u-text-gray-700 rounded-xl lg:hidden" aria-label="Menu">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons-outline:menu",
        class: "w-6 h-6 u-text-gray-500 hover:u-text-gray-700",
        "aria-hidden": "\u201Dtrue\u201D"
      }, null, _parent));
      _push(`</button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(visible)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-start overflow-y-auto bg-opacity-50 backdrop-blur dark:bg-opacity-50 lg:hidden"><div class="w-full max-w-xs min-h-full px-4 pb-12 shadow u-bg-white sm:px-6"><div class="flex items-center justify-between gap-2 border-b border-transparent h-header"><button class="relative z-10 u-text-gray-500 hover:u-text-gray-700 rounded-xl" aria-label="Menu">`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: "heroicons-outline:x",
            class: "w-6 h-6 u-text-gray-500 hover:u-text-gray-700",
            "aria-hidden": "\u201Dtrue\u201D"
          }, null, _parent));
          _push2(`</button><div class="flex items-center gap-4">`);
          _push2(ssrRenderComponent(_component_SocialIcons, null, null, _parent));
          _push2(ssrRenderComponent(_sfc_main$a, { size: "h-6 w-6" }, null, _parent));
          _push2(`</div></div>`);
          _push2(ssrRenderComponent(_component_DocsAsideTree, { links: unref(links) }, null, _parent));
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/NavbarDialog.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const NavbarDialog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: "h-6 w-auto text-black dark:text-white sm:h-8",
    viewBox: "0 0 707 169",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _attrs))}><path d="M196.387 36.674h45.549c10.55 0 19.907 1.972 28.072 5.917s14.495 9.54 18.99 16.788c4.495 7.248 6.743 15.734 6.743 25.458 0 9.724-2.248 18.21-6.743 25.458-4.495 7.247-10.825 12.843-18.99 16.788-8.165 3.945-17.522 5.917-28.072 5.917h-45.549V36.674zm44.448 74.584c8.257 0 14.862-2.34 19.816-7.018 5.045-4.679 7.568-11.146 7.568-19.403 0-8.257-2.523-14.724-7.568-19.403-4.954-4.679-11.559-7.018-19.816-7.018h-17.201v52.842h17.201zm105.432 22.98c-7.981 0-15.183-1.651-21.605-4.953-6.421-3.303-11.467-7.89-15.136-13.761-3.578-5.872-5.367-12.523-5.367-19.954 0-7.339 1.789-13.944 5.367-19.815 3.669-5.871 8.669-10.413 14.999-13.623 6.422-3.303 13.669-4.954 21.742-4.954s15.321 1.65 21.742 4.954c6.422 3.21 11.422 7.752 15 13.623 3.577 5.78 5.366 12.385 5.366 19.815 0 7.431-1.789 14.082-5.366 19.954-3.578 5.871-8.578 10.458-15 13.761-6.421 3.302-13.669 4.953-21.742 4.953zm0-20.778c4.587 0 8.348-1.56 11.284-4.679 2.936-3.211 4.403-7.614 4.403-13.21 0-5.505-1.467-9.817-4.403-12.936-2.936-3.119-6.697-4.678-11.284-4.678-4.587 0-8.348 1.56-11.284 4.678-2.936 3.12-4.403 7.431-4.403 12.935 0 5.597 1.467 10 4.403 13.211 2.936 3.119 6.697 4.679 11.284 4.679zm92.338 20.778c-8.257 0-15.642-1.651-22.155-4.953-6.514-3.303-11.605-7.89-15.275-13.761-3.578-5.872-5.367-12.523-5.367-19.954 0-7.43 1.789-14.036 5.367-19.815 3.67-5.871 8.761-10.413 15.275-13.623 6.513-3.303 13.898-4.954 22.155-4.954 8.44 0 15.733 1.834 21.879 5.504 6.147 3.578 10.505 8.578 13.073 15l-20.228 10.32c-3.395-6.697-8.348-10.045-14.862-10.045-4.679 0-8.578 1.56-11.697 4.678-3.027 3.12-4.541 7.431-4.541 12.935 0 5.597 1.514 10 4.541 13.211 3.119 3.119 7.018 4.679 11.697 4.679 6.514 0 11.467-3.349 14.862-10.046l20.228 10.321c-2.568 6.422-6.926 11.467-13.073 15.137-6.146 3.578-13.439 5.366-21.879 5.366zm123.234-75.822V133h-24.907v-7.981c-2.753 3.027-6.055 5.321-9.908 6.88-3.853 1.56-7.936 2.339-12.248 2.339-9.632 0-17.338-2.843-23.118-8.531-5.688-5.688-8.532-14.22-8.532-25.595V58.416h26.146v37.43c0 5.596 1.055 9.678 3.165 12.247 2.11 2.569 5.183 3.853 9.22 3.853 4.128 0 7.477-1.422 10.045-4.266 2.661-2.936 3.991-7.385 3.991-13.348V58.416h26.146zm43.95 75.822a82.948 82.948 0 01-18.44-2.064c-6.055-1.467-10.917-3.348-14.587-5.642l7.844-17.889c3.394 2.11 7.431 3.807 12.11 5.092 4.678 1.192 9.311 1.789 13.898 1.789 4.22 0 7.202-.413 8.945-1.239 1.835-.917 2.752-2.202 2.752-3.853 0-1.651-1.101-2.798-3.303-3.44-2.11-.734-5.504-1.422-10.183-2.064-5.963-.734-11.054-1.697-15.274-2.89-4.129-1.193-7.706-3.394-10.734-6.605-3.027-3.211-4.541-7.706-4.541-13.486 0-4.77 1.422-8.99 4.266-12.66 2.844-3.761 6.972-6.697 12.385-8.807 5.504-2.201 12.063-3.302 19.678-3.302 5.412 0 10.779.55 16.1 1.65 5.321 1.102 9.77 2.661 13.348 4.68l-7.844 17.751c-6.605-3.67-13.76-5.504-21.467-5.504-4.128 0-7.155.504-9.082 1.514-1.926.917-2.89 2.155-2.89 3.715 0 1.743 1.055 2.981 3.165 3.715 2.11.642 5.597 1.33 10.459 2.064 6.146.918 11.238 1.973 15.274 3.165 4.037 1.193 7.523 3.395 10.459 6.606 3.027 3.119 4.541 7.522 4.541 13.21 0 4.679-1.422 8.899-4.266 12.66-2.844 3.67-7.064 6.559-12.66 8.669-5.505 2.11-12.156 3.165-19.953 3.165zm58.583-.275c-3.119 0-5.78-1.055-7.982-3.165-2.201-2.201-3.302-4.954-3.302-8.256 0-3.395 1.055-6.147 3.165-8.257 2.202-2.11 4.908-3.165 8.119-3.165 3.211 0 5.871 1.055 7.981 3.165 2.202 2.11 3.303 4.862 3.303 8.257 0 3.302-1.101 6.055-3.303 8.256-2.202 2.11-4.862 3.165-7.981 3.165z" fill="currentColor"></path><mask id="a" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 73.719C0 33.005 33.005 0 73.719 0c40.714 0 73.719 33.005 73.719 73.719 0 40.714-33.005 73.719-73.719 73.719H0V73.719zm65.749-15.94c8.803 0 15.94 7.137 15.94 15.94s-7.137 15.939-15.94 15.939-15.94-7.136-15.94-15.94c0-8.802 7.137-15.939 15.94-15.939zm63.758 15.94c0-8.803-7.137-15.94-15.94-15.94-8.802 0-15.939 7.137-15.939 15.94s7.137 15.939 15.939 15.939c8.803 0 15.94-7.136 15.94-15.94z"></path></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M0 73.719C0 33.005 33.005 0 73.719 0c40.714 0 73.719 33.005 73.719 73.719 0 40.714-33.005 73.719-73.719 73.719H0V73.719zm65.749-15.94c8.803 0 15.94 7.137 15.94 15.94s-7.137 15.939-15.94 15.939-15.94-7.136-15.94-15.94c0-8.802 7.137-15.939 15.94-15.939zm63.758 15.94c0-8.803-7.137-15.94-15.94-15.94-8.802 0-15.939 7.137-15.939 15.94s7.137 15.939 15.939 15.939c8.803 0 15.94-7.136 15.94-15.94z" fill="currentColor"></path><path d="M0 147.438h-.527v.526H0v-.526zM73.719-.527C32.714-.527-.527 32.714-.527 73.72H.527C.527 33.296 33.296.527 73.719.527V-.527zm74.245 74.246c0-41.005-33.24-74.246-74.245-74.246V.527c40.423 0 73.192 32.769 73.192 73.192h1.053zm-74.245 74.245c41.005 0 74.245-33.24 74.245-74.245h-1.053c0 40.423-32.769 73.192-73.192 73.192v1.053zm-73.719 0h73.719v-1.053H0v1.053zm-.527-74.245v73.719H.527V73.719H-.527zm82.742 0c0-9.094-7.372-16.466-16.466-16.466v1.053c8.512 0 15.413 6.9 15.413 15.413h1.053zM65.749 90.184c9.094 0 16.466-7.372 16.466-16.465h-1.053c0 8.512-6.9 15.412-15.413 15.412v1.053zM49.283 73.72c0 9.093 7.372 16.465 16.466 16.465v-1.053c-8.512 0-15.413-6.9-15.413-15.412h-1.053zM65.75 57.253c-9.094 0-16.466 7.372-16.466 16.466h1.053c0-8.513 6.9-15.413 15.413-15.413v-1.053zm47.818 1.053c8.513 0 15.413 6.9 15.413 15.413h1.053c0-9.094-7.372-16.466-16.466-16.466v1.053zM98.155 73.719c0-8.513 6.9-15.413 15.412-15.413v-1.053c-9.093 0-16.465 7.372-16.465 16.466h1.053zm15.412 15.412c-8.512 0-15.412-6.9-15.412-15.412h-1.053c0 9.093 7.372 16.465 16.465 16.465v-1.053zM128.98 73.72c0 8.512-6.9 15.412-15.413 15.412v1.053c9.094 0 16.466-7.372 16.466-16.465h-1.053z" fill="#000" mask="url(#a)"></path></svg>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/Logo.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$1]]);
const Logo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "NavbarLogo",
  __ssrInlineRender: true,
  setup(__props) {
    const docus = useDocus();
    const logo = computed(() => {
      var _a;
      return ((_a = docus.value.header) == null ? void 0 : _a.logo) || false;
    });
    const title = computed(() => {
      var _a;
      return ((_a = docus.value.header) == null ? void 0 : _a.title) || docus.value.title;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Logo = __nuxt_component_1$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        class: "flex items-center flex-none",
        to: "/",
        "aria-label": (_b = (_a = unref(docus)) == null ? void 0 : _a.header) == null ? void 0 : _b.title
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(logo)) {
              _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-xl font-bold u-text-gray-900 hover:u-text-gray-500"${_scopeId}>${ssrInterpolate(unref(title))}</span>`);
            }
          } else {
            return [
              unref(logo) ? (openBlock(), createBlock(_component_Logo, { key: 0 })) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-xl font-bold u-text-gray-900 hover:u-text-gray-500"
              }, toDisplayString(unref(title)), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/NavbarLogo.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const NavbarLogo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "NavbarCenter",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { navBottomLink: navBottomLink2 } = useContentHelpers();
    const { navigation } = useContent();
    const docus = useDocus();
    const hasNavigation = computed(() => {
      var _a;
      return !!((_a = docus.value.aside) == null ? void 0 : _a.level);
    });
    const filtered = computed(() => {
      var _a;
      return ((_a = docus.value.header) == null ? void 0 : _a.exclude) || [];
    });
    const tree = computed(() => {
      return (navigation.value || []).filter((item) => {
        if (filtered.value.includes(item._path)) {
          return false;
        }
        return true;
      });
    });
    const isActive = (link) => link.exact ? route.fullPath === link._path : route.fullPath.startsWith(link._path);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = _sfc_main$k;
      if (unref(hasNavigation)) {
        _push(`<nav${ssrRenderAttrs(_attrs)} data-v-81e0b9ad><ul class="flex items-center justify-center flex-1 max-w-full space-x-2 overflow-hidden font-medium truncate" data-v-81e0b9ad><!--[-->`);
        ssrRenderList(unref(tree), (link) => {
          _push(`<li data-v-81e0b9ad>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: ["link", { active: isActive(link) }],
            to: link.redirect ? link.redirect : unref(navBottomLink2)(link)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (link.icon && unref(docus).header.showLinksIcons) {
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: link.icon,
                    class: "w-4 h-4"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(link.title)}`);
              } else {
                return [
                  link.icon && unref(docus).header.showLinksIcons ? (openBlock(), createBlock(_component_Icon, {
                    key: 0,
                    name: link.icon,
                    class: "w-4 h-4"
                  }, null, 8, ["name"])) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(link.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/NavbarCenter.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-81e0b9ad"]]);
const NavbarCenter = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3
}, Symbol.toStringTag, { value: "Module" }));
const useDocSearch = () => {
  const { $docSearch } = useNuxtApp();
  if (!$docSearch) {
    return {
      hasDocSearch: ref(false)
    };
  }
  return $docSearch;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AppSearch",
  __ssrInlineRender: true,
  setup(__props) {
    useDocSearch();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$k;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative pointer-events-auto group" }, _attrs))}><button type="button" aria-label="Search" class="u-text-gray-500 hover:u-text-gray-700 lg:u-ring-gray-100 lg:group-hover:u-ring-gray-300 flex w-full items-center text-sm lg:rounded-md lg:py-1.5 lg:pl-2 lg:pr-3 lg:shadow-sm lg:ring-1">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons-outline:search",
        class: "flex-none w-6 h-6 lg:mr-2 lg:h-4 lg:w-4"
      }, null, _parent));
      _push(`<span class="hidden text-xs font-medium lg:block">Search</span><span class="flex-none hidden pl-3 ml-auto text-xs font-semibold u-text-gray-400 lg:block"><kbd>\u2318</kbd><kbd>K</kbd></span></button></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/AppSearch.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AppSearch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigation } = useContent();
    const { hasDocSearch } = useDocSearch();
    const hasNavbarDialog = computed(() => {
      var _a;
      return ((_a = navigation.value) == null ? void 0 : _a.length) > 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppContainer = _sfc_main$e;
      const _component_NavbarDialog = _sfc_main$9;
      const _component_NavbarLogo = _sfc_main$7;
      const _component_NavbarCenter = __nuxt_component_3;
      const _component_AppSearch = _sfc_main$5;
      const _component_ColorModeSwitch = _sfc_main$a;
      const _component_SocialIcons = _sfc_main$d;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-10 w-full border-b h-header u-border-gray-100 bg-white/80 dark:bg-black/80" }, _attrs))} data-v-ffc00f42>`);
      _push(ssrRenderComponent(_component_AppContainer, {
        padded: "",
        class: "grid h-full grid-cols-12 lg:gap-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center flex-none col-span-2" data-v-ffc00f42${_scopeId}>`);
            if (unref(hasNavbarDialog)) {
              _push2(ssrRenderComponent(_component_NavbarDialog, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_NavbarLogo, {
              class: unref(hasNavbarDialog) ? "hidden lg:block" : "block"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-center flex-1 col-span-8" data-v-ffc00f42${_scopeId}>`);
            if (unref(hasNavbarDialog)) {
              _push2(ssrRenderComponent(_component_NavbarLogo, { class: "lg:hidden" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_NavbarCenter, { class: "hidden lg:flex" }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-end flex-none col-span-2 lg:gap-4 lg:pl-4" data-v-ffc00f42${_scopeId}>`);
            if (unref(hasDocSearch)) {
              _push2(ssrRenderComponent(_component_AppSearch, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_ColorModeSwitch, {
              size: "w-5 h-5",
              class: unref(hasDocSearch) ? "hidden lg:block" : ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_SocialIcons, { size: "h-5 w-5 hidden lg:block" }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center flex-none col-span-2" }, [
                unref(hasNavbarDialog) ? (openBlock(), createBlock(_component_NavbarDialog, { key: 0 })) : createCommentVNode("", true),
                createVNode(_component_NavbarLogo, {
                  class: unref(hasNavbarDialog) ? "hidden lg:block" : "block"
                }, null, 8, ["class"])
              ]),
              createVNode("div", { class: "flex items-center justify-center flex-1 col-span-8" }, [
                unref(hasNavbarDialog) ? (openBlock(), createBlock(_component_NavbarLogo, {
                  key: 0,
                  class: "lg:hidden"
                })) : createCommentVNode("", true),
                createVNode(_component_NavbarCenter, { class: "hidden lg:flex" })
              ]),
              createVNode("div", { class: "flex items-center justify-end flex-none col-span-2 lg:gap-4 lg:pl-4" }, [
                unref(hasDocSearch) ? (openBlock(), createBlock(_component_AppSearch, { key: 0 })) : createCommentVNode("", true),
                createVNode(_component_ColorModeSwitch, {
                  size: "w-5 h-5",
                  class: unref(hasDocSearch) ? "hidden lg:block" : ""
                }, null, 8, ["class"]),
                createVNode(_component_SocialIcons, { size: "h-5 w-5 hidden lg:block" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/Navbar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-ffc00f42"]]);
const Navbar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: "info",
      validator(value) {
        return ["info", "success", "warning", "danger", "primary"].includes(value);
      }
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentSlot = ContentSlot;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["alert mt-4 mb-4 rounded-xl px-4 py-3 text-sm leading-relaxed", [__props.type]]
      }, _attrs))}><div class="flex items-start"><div class="alert-content flex-grow">`);
      _push(ssrRenderComponent(_component_ContentSlot, {
        use: _ctx.$slots.default,
        unwrap: "p"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/Alert.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Alert = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const docus = useDocus();
    const socialIcons = ref(null);
    const icons = computed(() => {
      var _a;
      return ((_a = docus.value.footer) == null ? void 0 : _a.icons) || [];
    });
    const socialIconsCount = computed(() => Object.entries(docus.value.socials).filter(([_, v]) => v).length);
    const nbSocialIcons = computed(() => socialIcons.value ? socialIconsCount.value : 0);
    const showOverrideAlert = computed(() => false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppContainer = _sfc_main$e;
      const _component_Icon = _sfc_main$k;
      const _component_SocialIcons = _sfc_main$d;
      const _component_Alert = _sfc_main$3;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border u-bg-white u-border-gray-100" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AppContainer, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex flex-col items-center h-full gap-4 py-4 sm:flex-row sm:justify-between sm:gap-x-16"${_scopeId}>`);
            if ((_a = unref(docus).footer) == null ? void 0 : _a.credits) {
              _push2(`<a${ssrRenderAttr("href", unref(docus).footer.credits.href)} rel="noopener" target="_blank" class="flex items-center u-text-gray-700 hover:u-text-gray-900"${_scopeId}>`);
              if (unref(docus).footer.credits.icon) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(docus).footer.credits.icon), { class: "w-4 h-4 mr-2 fill-current" }, null), _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(docus).footer.credits.text)}</p></a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(icons).slice(0, 6 - unref(nbSocialIcons)), (icon) => {
              _push2(`<a rel="noopener"${ssrRenderAttr("aria-label", icon.label)}${ssrRenderAttr("href", icon.href)} target="_blank" class="flex items-center text-sm font-medium u-text-gray-700 hover:u-text-gray-900"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: icon.icon || icon.component,
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`</a>`);
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_component_SocialIcons, {
              ref_key: "socialIcons",
              ref: socialIcons,
              size: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (unref(showOverrideAlert)) {
              _push2(ssrRenderComponent(_component_Alert, { type: "info" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div${_scopeId2}><p${_scopeId2}>Please consider to override <code${_scopeId2}>AppFooter.vue</code> if you want to add more icons</p></div>`);
                  } else {
                    return [
                      createVNode("div", null, [
                        createVNode("p", null, [
                          createTextVNode("Please consider to override "),
                          createVNode("code", null, "AppFooter.vue"),
                          createTextVNode(" if you want to add more icons")
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex flex-col items-center h-full gap-4 py-4 sm:flex-row sm:justify-between sm:gap-x-16" }, [
                ((_b = unref(docus).footer) == null ? void 0 : _b.credits) ? (openBlock(), createBlock("a", {
                  key: 0,
                  href: unref(docus).footer.credits.href,
                  rel: "noopener",
                  target: "_blank",
                  class: "flex items-center u-text-gray-700 hover:u-text-gray-900"
                }, [
                  unref(docus).footer.credits.icon ? (openBlock(), createBlock(resolveDynamicComponent(unref(docus).footer.credits.icon), {
                    key: 0,
                    class: "w-4 h-4 mr-2 fill-current"
                  })) : createCommentVNode("", true),
                  createVNode("p", { class: "text-xs font-semibold" }, toDisplayString(unref(docus).footer.credits.text), 1)
                ], 8, ["href"])) : createCommentVNode("", true),
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(true), createBlock(Fragment$1, null, renderList(unref(icons).slice(0, 6 - unref(nbSocialIcons)), (icon) => {
                    return openBlock(), createBlock("a", {
                      key: icon.label,
                      rel: "noopener",
                      "aria-label": icon.label,
                      href: icon.href,
                      target: "_blank",
                      class: "flex items-center text-sm font-medium u-text-gray-700 hover:u-text-gray-900"
                    }, [
                      createVNode(_component_Icon, {
                        name: icon.icon || icon.component,
                        class: "w-4 h-4"
                      }, null, 8, ["name"])
                    ], 8, ["aria-label", "href"]);
                  }), 128)),
                  createVNode(_component_SocialIcons, {
                    ref_key: "socialIcons",
                    ref: socialIcons,
                    size: "w-4 h-4"
                  }, null, 512)
                ])
              ]),
              unref(showOverrideAlert) ? (openBlock(), createBlock(_component_Alert, {
                key: 0,
                type: "info"
              }, {
                default: withCtx(() => [
                  createVNode("div", null, [
                    createVNode("p", null, [
                      createTextVNode("Please consider to override "),
                      createVNode("code", null, "AppFooter.vue"),
                      createTextVNode(" if you want to add more icons")
                    ])
                  ])
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/AppFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppLayout",
  __ssrInlineRender: true,
  props: {
    padded: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const docus = useDocus();
    const { navigation, page: page2 } = useContent();
    const { navKeyFromPath: navKeyFromPath2 } = useContentHelpers();
    const titleTemplate = computed(() => {
      var _a, _b;
      const appTitleTemplate = ((_a = docus.value.head) == null ? void 0 : _a.titleTemplate) || `%s \xB7 ${docus.value.title}`;
      if (page2.value) {
        return ((_b = page2.value.head) == null ? void 0 : _b.titleTemplate) || navKeyFromPath2(page2.value._path, "titleTemplate", navigation.value || []) || appTitleTemplate;
      }
      return appTitleTemplate;
    });
    useHead({
      titleTemplate: titleTemplate.value,
      meta: [
        { name: "twitter:card", content: "summary_large_image" }
      ]
    });
    watch(titleTemplate, () => {
      useHead({ titleTemplate: titleTemplate.value });
    });
    useContentHead(docus.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppLoadingBar = _sfc_main$f;
      const _component_Navbar = __nuxt_component_1$1;
      const _component_AppFooter = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_AppLoadingBar, null, null, _parent));
      if (unref(docus).header) {
        _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (unref(docus).footer) {
        _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/AppLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppLayout = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a2;
    return ((_a2 = m.components) == null ? void 0 : _a2.default) === routeProps.Component.type;
  });
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : matchedRoute && interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a, _b, _c, _d;
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(props.pageKey, routeProps);
          const transitionProps = (_b = (_a = props.transition) != null ? _a : routeProps.route.meta.pageTransition) != null ? _b : appPageTransition;
          const done = nuxtApp.deferHydration();
          return _wrapIf(
            Transition,
            transitionProps,
            wrapInKeepAlive(
              (_d = (_c = props.keepalive) != null ? _c : routeProps.route.meta.keepalive) != null ? _d : appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component).finally(done)
              }, { default: () => h(Component, { key, routeProps, pageKey: key, hasTransition: !!transitionProps }) })
            )
          ).default();
        }
      });
    };
  }
});
const Component = defineComponent({
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppLayout = _sfc_main$1;
  const _component_NuxtPage = __nuxt_component_1;
  _push(ssrRenderComponent(_component_AppLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main$g);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { Logo as $, assertArray as A, ensureArray as B, ContentSlot as C, sortList as D, apply as E, withoutKeys as F, withKeys as G, useCookie as H, createQuery as I, nuxtLink as J, layout as K, ContentRendererMarkdown as L, ContentRenderer as M, DocumentDrivenEmpty as N, Icon as O, ContentSlot$1 as P, ButtonLink as Q, DocumentDrivenNotFound as R, AppLoadingBar as S, AppContainer as T, SocialIcons as U, DocsAsideTree as V, clientOnly as W, component_vue3 as X, ColorModeSwitch as Y, NavbarDialog as Z, __nuxt_component_1$3 as _, _sfc_main$k as a, NavbarLogo as a0, NavbarCenter as a1, AppSearch as a2, Navbar as a3, Alert as a4, AppFooter as a5, AppLayout as a6, page as a7, _export_sfc as b, useUnwrap as c, useNuxtApp as d, entry$1 as default, useColorMode as e, __nuxt_component_0$3 as f, useDocus as g, useRuntimeConfig as h, _sfc_main$m as i, useRoute as j, useContentHead as k, useHead as l, useState as m, fetchContentNavigation as n, useContentHelpers as o, _sfc_main$c as p, queryContent as q, useRouter as r, _sfc_main$e as s, _sfc_main$3 as t, useContent as u, useRequestEvent as v, __nuxt_component_0$2 as w, _sfc_main$l as x, __nuxt_component_3$1 as y, get as z };
//# sourceMappingURL=server.mjs.map
