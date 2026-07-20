import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/dashboard/my-settings.vue?vue&type=script&setup=true&lang.ts
var my_settings_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "my-settings",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Settings - Nairobi Powerbikes" });
		const pb = usePB();
		const auth = useAuthStore();
		const saving = ref(false);
		const form = ref({
			name: "",
			phone: "",
			email_notifications: true
		});
		async function save() {
			saving.value = true;
			try {
				const payload = { name: form.value.name };
				if (form.value.phone) payload.phone = form.value.phone;
				await pb.collection("users").update(auth.user.id, payload);
			} catch (e) {
				console.error("Settings save failed:", e?.data?.message || e?.message || e);
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6"><h1 class="font-heading text-4xl text-white">Account <span class="text-brand-red">Settings</span></h1></div><div class="max-w-lg rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="space-y-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Name</label><input${ssrRenderAttr("value", unref(form).name)} class="input-field w-full"></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><input${ssrRenderAttr("value", unref(form).phone)} class="input-field w-full"></div><div class="flex items-center gap-3"><input id="emnotif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).email_notifications) ? ssrLooseContain(unref(form).email_notifications, null) : unref(form).email_notifications) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-brand-red"><label for="emnotif" class="text-sm text-brand-grey">Email notifications</label></div></div><div class="mt-6 flex justify-end">`);
			_push(ssrRenderComponent(_component_Button, {
				disabled: unref(saving),
				onClick: save
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(saving) ? "Saving..." : "Save Settings")}`);
					else return [createTextVNode(toDisplayString(unref(saving) ? "Saving..." : "Save Settings"), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/my-settings.vue
var _sfc_setup = my_settings_vue_vue_type_script_setup_true_lang_default.setup;
my_settings_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-settings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var my_settings_default = my_settings_vue_vue_type_script_setup_true_lang_default;

export { my_settings_default as default };
//# sourceMappingURL=my-settings-C2x-BmXS.mjs.map
