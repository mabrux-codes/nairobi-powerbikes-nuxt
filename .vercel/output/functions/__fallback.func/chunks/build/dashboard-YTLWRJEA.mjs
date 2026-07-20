import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { defineComponent, defineAsyncComponent, computed, createVNode, resolveDynamicComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode } from 'vue/server-renderer';
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

//#region app/pages/dashboard/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const componentMap = {
			admin: defineAsyncComponent(() => import('./AdminOverview-CnkCKuxZ.mjs')),
			customer: defineAsyncComponent(() => import('./CustomerOverview-C2a2DYlo.mjs'))
		};
		const activeComponent = computed(() => componentMap[auth.userRole || "customer"]);
		useHead$1({ title: {
			admin: "Admin Dashboard - Nairobi Powerbikes",
			customer: "My Dashboard - Nairobi Powerbikes"
		}[auth.userRole || "customer"] || "Dashboard - Nairobi Powerbikes" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(activeComponent)), null, null), _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = index_vue_vue_type_script_setup_true_lang_default;

export { dashboard_default as default };
//# sourceMappingURL=dashboard-YTLWRJEA.mjs.map
