import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { Bell } from 'lucide-vue-next';
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
import 'pocketbase';
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';

//#region app/pages/dashboard/my-notifications.vue?vue&type=script&setup=true&lang.ts
var my_notifications_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "my-notifications",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Notifications - Nairobi Powerbikes" });
		const pb = usePB();
		useAuthStore();
		const loading = ref(true);
		const items = ref([]);
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "";
		}
		function markRead(n) {
			pb.collection("notifications").update(n.id, { read: true }).then(() => n.read = true);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6"><h1 class="font-heading text-4xl text-white">Notifications</h1></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Bell), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Notifications</p></div>`);
			} else {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(unref(items), (n) => {
					_push(`<div class="${ssrRenderClass([n.read ? "opacity-60" : "border-brand-red/30", "flex items-start gap-3 rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-colors"])}"><div class="flex-1"><p class="text-sm text-white">${ssrInterpolate(n.title)}</p>`);
					if (n.message) _push(`<p class="text-xs text-brand-grey/70">${ssrInterpolate(n.message)}</p>`);
					else _push(`<!---->`);
					_push(`<p class="mt-1 text-xs text-brand-grey/50">${ssrInterpolate(formatDate(n.created))}</p></div>`);
					if (!n.read) _push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => markRead(n)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Mark Read`);
							else return [createTextVNode("Mark Read")];
						}),
						_: 2
					}, _parent));
					else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/my-notifications.vue
var _sfc_setup = my_notifications_vue_vue_type_script_setup_true_lang_default.setup;
my_notifications_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-notifications.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var my_notifications_default = my_notifications_vue_vue_type_script_setup_true_lang_default;

export { my_notifications_default as default };
//# sourceMappingURL=my-notifications-Dnb3zp2r.mjs.map
