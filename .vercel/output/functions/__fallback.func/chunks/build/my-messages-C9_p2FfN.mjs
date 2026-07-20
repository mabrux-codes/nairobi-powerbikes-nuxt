import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/dashboard/my-messages.vue?vue&type=script&setup=true&lang.ts
var my_messages_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "my-messages",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Messages - Nairobi Powerbikes" });
		usePB();
		useAuthStore();
		const loading = ref(true);
		const items = ref([]);
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6"><h1 class="font-heading text-4xl text-white">Messages</h1></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Mail), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Messages</p></div>`);
			} else {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(unref(items), (m) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4"><div class="flex items-start justify-between"><div><p class="text-sm text-white">${ssrInterpolate(m.subject || "No Subject")}</p><p class="text-xs text-brand-grey">From: ${ssrInterpolate(m.expand?.from_user?.name || m.expand?.from_user?.email)}</p></div>`);
					if (!m.read) _push(ssrRenderComponent(_component_Badge, {
						size: "sm",
						variant: "warning"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`New`);
							else return [createTextVNode("New")];
						}),
						_: 2
					}, _parent));
					else _push(`<!---->`);
					_push(`</div><p class="mt-2 text-sm text-brand-grey/70">${ssrInterpolate(m.message)}</p><p class="mt-1 text-xs text-brand-grey/50">${ssrInterpolate(formatDate(m.created))}</p></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/my-messages.vue
var _sfc_setup = my_messages_vue_vue_type_script_setup_true_lang_default.setup;
my_messages_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-messages.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var my_messages_default = my_messages_vue_vue_type_script_setup_true_lang_default;

export { my_messages_default as default };
//# sourceMappingURL=my-messages-C9_p2FfN.mjs.map
