import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useClipboard } from './index.4e223d73.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Terminal",
  __ssrInlineRender: true,
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    useClipboard();
    const state = ref("init");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative flex h-64 w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-gray-900" }, _attrs))}>`);
      if (state.value === "copied") {
        _push(`<div class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center"><div class="absolute top-0 left-0 h-full w-full bg-black opacity-75"></div><div class="z-10 text-lg font-semibold text-gray-100"> Copied! </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative flex h-12 w-full items-center border-b-2 border-gray-800"><div class="ml-4 flex"><div class="h-3 w-3 rounded-full bg-red-400"></div><div class="ml-2 h-3 w-3 rounded-full bg-yellow-400"></div><div class="ml-2 h-3 w-3 rounded-full bg-green-400"></div></div><div class="absolute top-0 left-0 flex h-full w-full items-center justify-center font-semibold"> Bash </div></div><div class="flex flex-1 p-4 font-mono"><span class="mr-2 inline-block select-none font-bold">$</span><span class="inline-block text-gray-200">${ssrInterpolate(__props.content)}</span></div>`);
      if (state.value !== "copied") {
        _push(`<div class="py-2 text-center font-semibold opacity-0 transition-opacity group-hover:opacity-100"> Click to copy </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/Terminal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Terminal.bf4fd044.mjs.map
