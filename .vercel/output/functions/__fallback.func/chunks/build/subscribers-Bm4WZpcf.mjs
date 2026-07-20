import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, computed, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Mail } from 'lucide-vue-next';
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
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';
import 'pocketbase';

//#region app/pages/dashboard/subscribers.vue?vue&type=script&setup=true&lang.ts
var subscribers_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "subscribers",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Subscribers - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const subscribers = ref([]);
		const searchQuery = ref("");
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "N/A";
		}
		const filtered = computed(() => {
			if (!searchQuery.value) return subscribers.value;
			return subscribers.value.filter((s) => s.email.toLowerCase().includes(searchQuery.value.toLowerCase()));
		});
		async function toggleActive(s) {
			const active = s.active !== false ? false : true;
			await pb.collection("subscribers").update(s.id, { active });
			s.active = active;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Input = input_default;
			const _component_Badge = badge_default;
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Newsletter <span class="text-brand-red">Subscribers</span></h1><p class="mt-1 text-sm text-brand-grey">${ssrInterpolate(unref(subscribers).length)} total subscribers</p></div><div class="mb-4 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_Input, {
				modelValue: unref(searchQuery),
				"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
				placeholder: "Search by email...",
				class: "w-64"
			}, null, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filtered).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Mail), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Subscribers</p><p class="mt-2 text-sm text-brand-grey/60">No newsletter subscribers yet</p></div>`);
			} else {
				_push(`<div class="overflow-x-auto rounded-sm border border-brand-grey/20"><table class="w-full text-left text-sm"><thead class="border-b border-brand-grey/20 bg-brand-black/80"><tr><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Name</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Subscribed</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Active</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th></tr></thead><tbody class="divide-y divide-brand-grey/10"><!--[-->`);
				ssrRenderList(unref(filtered), (s) => {
					_push(`<tr class="transition-colors hover:bg-white/5"><td class="px-4 py-3 text-white">${ssrInterpolate(s.email)}</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(s.name || "N/A")}</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(formatDate(s.created))}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, { variant: s.active !== false ? "success" : "danger" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(s.active !== false ? "Active" : "Inactive")}`);
							else return [createTextVNode(toDisplayString(s.active !== false ? "Active" : "Inactive"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-right">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						onClick: ($event) => toggleActive(s)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(s.active !== false ? "Deactivate" : "Activate")}`);
							else return [createTextVNode(toDisplayString(s.active !== false ? "Deactivate" : "Activate"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/subscribers.vue
var _sfc_setup = subscribers_vue_vue_type_script_setup_true_lang_default.setup;
subscribers_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/subscribers.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var subscribers_default = subscribers_vue_vue_type_script_setup_true_lang_default;

export { subscribers_default as default };
//# sourceMappingURL=subscribers-Bm4WZpcf.mjs.map
