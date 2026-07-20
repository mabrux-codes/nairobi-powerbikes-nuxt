import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/dashboard/profile.vue?vue&type=script&setup=true&lang.ts
var profile_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "profile",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "My Profile - Nairobi Powerbikes" });
		const pb = usePB();
		const auth = useAuthStore();
		const loading = ref(true);
		const savingProfile = ref(false);
		const savingPassword = ref(false);
		const profileMessage = ref("");
		const passwordMessage = ref("");
		const passwordError = ref(false);
		const profileForm = ref({
			name: "",
			email: "",
			phone: ""
		});
		const passwordForm = ref({
			current: "",
			newPassword: "",
			confirm: ""
		});
		async function saveProfile() {
			savingProfile.value = true;
			profileMessage.value = "";
			try {
				const payload = {
					name: profileForm.value.name,
					email: profileForm.value.email
				};
				if (profileForm.value.phone) payload.phone = profileForm.value.phone;
				await pb.collection("users").update(auth.user.id, payload);
				auth.user.name = profileForm.value.name;
				auth.user.email = profileForm.value.email;
				profileMessage.value = "Profile updated successfully";
				setTimeout(() => {
					profileMessage.value = "";
				}, 3e3);
			} catch (e) {
				profileMessage.value = e.message || "Failed to update profile";
			} finally {
				savingProfile.value = false;
			}
		}
		async function changePassword() {
			savingPassword.value = true;
			passwordMessage.value = "";
			passwordError.value = false;
			if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
				passwordMessage.value = "Passwords do not match";
				passwordError.value = true;
				savingPassword.value = false;
				return;
			}
			if (passwordForm.value.newPassword.length < 6) {
				passwordMessage.value = "Password must be at least 6 characters";
				passwordError.value = true;
				savingPassword.value = false;
				return;
			}
			try {
				await pb.collection("users").update(auth.user.id, {
					oldPassword: passwordForm.value.current,
					password: passwordForm.value.newPassword,
					passwordConfirm: passwordForm.value.confirm
				});
				passwordMessage.value = "Password updated successfully";
				passwordForm.value = {
					current: "",
					newPassword: "",
					confirm: ""
				};
				setTimeout(() => {
					passwordMessage.value = "";
				}, 3e3);
			} catch (e) {
				passwordMessage.value = e.message || "Failed to update password";
				passwordError.value = true;
			} finally {
				savingPassword.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Input = input_default;
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-3xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Profile</span></h1><p class="mt-1 text-sm text-brand-grey">Manage your account settings</p></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-6"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-5 w-48 rounded bg-brand-grey/10"></div><div class="mt-3 h-10 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="space-y-6"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white mb-4">Profile Information</h2>`);
				if (unref(profileMessage)) _push(`<div class="mb-4 rounded-sm bg-emerald-500/20 p-3 text-sm text-emerald-400">${ssrInterpolate(unref(profileMessage))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="space-y-4">`);
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(profileForm).name,
					"onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
					label: "Full Name",
					placeholder: "Your name"
				}, null, _parent));
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(profileForm).email,
					"onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
					label: "Email",
					type: "email",
					placeholder: "email@example.com"
				}, null, _parent));
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(profileForm).phone,
					"onUpdate:modelValue": ($event) => unref(profileForm).phone = $event,
					label: "Phone",
					placeholder: "+254..."
				}, null, _parent));
				_push(`</div><div class="mt-6 flex justify-end">`);
				_push(ssrRenderComponent(_component_Button, {
					disabled: unref(savingProfile),
					onClick: saveProfile
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(unref(savingProfile) ? "Saving..." : "Save Changes")}`);
						else return [createTextVNode(toDisplayString(unref(savingProfile) ? "Saving..." : "Save Changes"), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div></div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white mb-4">Change Password</h2>`);
				if (unref(passwordMessage)) _push(`<div class="${ssrRenderClass([unref(passwordError) ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400", "mb-4 rounded-sm p-3 text-sm"])}">${ssrInterpolate(unref(passwordMessage))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="space-y-4">`);
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(passwordForm).current,
					"onUpdate:modelValue": ($event) => unref(passwordForm).current = $event,
					label: "Current Password",
					type: "password",
					placeholder: "Enter current password"
				}, null, _parent));
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(passwordForm).newPassword,
					"onUpdate:modelValue": ($event) => unref(passwordForm).newPassword = $event,
					label: "New Password",
					type: "password",
					placeholder: "Enter new password"
				}, null, _parent));
				_push(ssrRenderComponent(_component_Input, {
					modelValue: unref(passwordForm).confirm,
					"onUpdate:modelValue": ($event) => unref(passwordForm).confirm = $event,
					label: "Confirm New Password",
					type: "password",
					placeholder: "Confirm new password"
				}, null, _parent));
				_push(`</div><div class="mt-6 flex justify-end">`);
				_push(ssrRenderComponent(_component_Button, {
					disabled: unref(savingPassword),
					onClick: changePassword
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(unref(savingPassword) ? "Saving..." : "Update Password")}`);
						else return [createTextVNode(toDisplayString(unref(savingPassword) ? "Saving..." : "Update Password"), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div></div></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/profile.vue
var _sfc_setup = profile_vue_vue_type_script_setup_true_lang_default.setup;
profile_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var profile_default = profile_vue_vue_type_script_setup_true_lang_default;

export { profile_default as default };
//# sourceMappingURL=profile-BGJyuQgA.mjs.map
