import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { _ as _virtual_public__2FNPB_20Logo_default } from './_virtual_public-BZ2lbPvU.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import 'fnv1a-64';
import 'object-identity';
import 'perfect-debounce';
import 'unhead/utils';

//#region app/layouts/auth.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black flex items-center justify-center px-4" }, _attrs))}><div class="w-full max-w-md"><div class="mb-10 flex justify-center"><img${ssrRenderAttr("src", _virtual_public__2FNPB_20Logo_default)} alt="Nairobi Powerbikes" class="h-14 w-auto"></div>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/auth.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var auth_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { auth_default as default };
//# sourceMappingURL=auth-BngRjwDD.mjs.map
