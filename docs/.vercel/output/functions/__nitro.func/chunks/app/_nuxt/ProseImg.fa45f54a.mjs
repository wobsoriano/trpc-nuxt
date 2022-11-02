import _sfc_main$1 from './NuxtImg.b4209846.mjs';
import { useSSRContext, defineComponent, mergeProps } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { b as _export_sfc } from '../server.mjs';
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
  __name: "ProseImg",
  __ssrInlineRender: true,
  props: {
    src: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    width: {
      type: [String, Number],
      default: void 0
    },
    height: {
      type: [String, Number],
      default: void 0
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$1;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps(_ctx.$attrs, {
        src: __props.src,
        alt: __props.alt,
        width: __props.width,
        height: __props.height
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/prose/ProseImg.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseImg = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e0fc3dbb"]]);

export { ProseImg as default };
//# sourceMappingURL=ProseImg.fa45f54a.mjs.map
