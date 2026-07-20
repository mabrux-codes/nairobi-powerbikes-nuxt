import { u as useHead$1, n as navigateTo, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuth } from './useAuth-CUdaXvut.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, unref, withCtx, mergeProps, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { LoaderCircle, UserPlus } from 'lucide-vue-next';
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
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
import './auth-Tihkx7gx.mjs';
import './usePocketBase-F4xtrz4F.mjs';
import 'pocketbase';
import 'framer-motion/dom';
import '@vueuse/core';
import 'motion-dom';
import 'hey-listen';
import 'motion-utils';

//#region app/pages/register.vue?vue&type=script&setup=true&lang.ts
var register_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "register",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Register - Nairobi Powerbikes" });
		const { register } = useAuth();
		const { handleSubmit, isSubmitting, setFieldError } = useForm({
			validationSchema: toTypedSchema(z.object({
				name: z.string().min(2, "Name required"),
				email: z.string().email("Valid email required"),
				phone: z.string().min(10, "Valid phone required"),
				password: z.string().min(6, "Password must be at least 6 characters"),
				passwordConfirm: z.string().min(6, "Confirm your password")
			}).refine((d) => d.password === d.passwordConfirm, {
				message: "Passwords do not match",
				path: ["passwordConfirm"]
			})),
			initialValues: {
				name: "",
				email: "",
				phone: "",
				password: "",
				passwordConfirm: ""
			}
		});
		const errorMsg = ref("");
		const handleRegister = handleSubmit(async (values) => {
			errorMsg.value = "";
			try {
				await register(values.email, values.password, {
					name: values.name,
					phone: values.phone
				});
				await navigateTo("/login");
			} catch (err) {
				const msg = err?.data?.message || err?.message || "Registration failed.";
				setFieldError("email", msg);
				errorMsg.value = msg;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					y: 30
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .5 },
				class: "w-full"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black p-8"${_scopeId}><div class="mb-6 text-center"${_scopeId}><h1 class="font-heading text-4xl text-white sm:text-5xl"${_scopeId}>Create Account</h1><p class="mt-2 text-sm text-brand-grey"${_scopeId}>Join the Nairobi Powerbikes community</p></div><form class="space-y-5"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Full Name</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "name" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "text",
										class: ["input-field", { "border-brand-red": errorMessage }],
										placeholder: "John Doe"
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "John Doe"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Email</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "email" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "email",
										class: ["input-field", { "border-brand-red": errorMessage }],
										placeholder: "you@example.com"
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "email",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "you@example.com"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Phone</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "phone" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "tel",
										class: ["input-field", { "border-brand-red": errorMessage }],
										placeholder: "+254 7XX XXX XXX"
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "tel",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "+254 7XX XXX XXX"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Password</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "password" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "password",
										class: ["input-field", { "border-brand-red": errorMessage }],
										placeholder: "••••••••"
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "password",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "••••••••"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Confirm Password</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "passwordConfirm" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "password",
										class: ["input-field", { "border-brand-red": errorMessage }],
										placeholder: "••••••••"
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "password",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "••••••••"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="btn-primary w-full justify-center disabled:opacity-50"${_scopeId}>`);
						if (unref(isSubmitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(UserPlus), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`${ssrInterpolate(unref(isSubmitting) ? "Creating Account..." : "Create Account")}</button></form>`);
						if (unref(errorMsg)) _push(`<div class="mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"${_scopeId}><p class="text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(errorMsg))}</p></div>`);
						else _push(`<!---->`);
						_push(`<p class="mt-6 text-center text-sm text-brand-grey"${_scopeId}>Already have an account? `);
						_push(ssrRenderComponent(_component_NuxtLink, {
							to: "/login",
							class: "font-display text-brand-red hover:underline"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Sign In`);
								else return [createTextVNode("Sign In")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</p></div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black p-8" }, [
						createVNode("div", { class: "mb-6 text-center" }, [createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl" }, "Create Account"), createVNode("p", { class: "mt-2 text-sm text-brand-grey" }, "Join the Nairobi Powerbikes community")]),
						createVNode("form", {
							onSubmit: withModifiers(unref(handleRegister), ["prevent"]),
							class: "space-y-5"
						}, [
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Full Name"), createVNode(unref(Field), { name: "name" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "John Doe"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Email"), createVNode(unref(Field), { name: "email" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "email",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "you@example.com"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Phone"), createVNode(unref(Field), { name: "phone" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "tel",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "+254 7XX XXX XXX"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Password"), createVNode(unref(Field), { name: "password" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "password",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "••••••••"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Confirm Password"), createVNode(unref(Field), { name: "passwordConfirm" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "password",
									class: ["input-field", { "border-brand-red": errorMessage }],
									placeholder: "••••••••"
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("button", {
								type: "submit",
								disabled: unref(isSubmitting),
								class: "btn-primary w-full justify-center disabled:opacity-50"
							}, [unref(isSubmitting) ? (openBlock(), createBlock(unref(LoaderCircle), {
								key: 0,
								class: "h-5 w-5 animate-spin"
							})) : (openBlock(), createBlock(unref(UserPlus), {
								key: 1,
								class: "h-5 w-5"
							})), createTextVNode(toDisplayString(unref(isSubmitting) ? "Creating Account..." : "Create Account"), 1)], 8, ["disabled"])
						], 40, ["onSubmit"]),
						unref(errorMsg) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"
						}, [createVNode("p", { class: "text-sm text-brand-red" }, toDisplayString(unref(errorMsg)), 1)])) : createCommentVNode("", true),
						createVNode("p", { class: "mt-6 text-center text-sm text-brand-grey" }, [createTextVNode("Already have an account? "), createVNode(_component_NuxtLink, {
							to: "/login",
							class: "font-display text-brand-red hover:underline"
						}, {
							default: withCtx(() => [createTextVNode("Sign In")]),
							_: 1
						})])
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/register.vue
var _sfc_setup = register_vue_vue_type_script_setup_true_lang_default.setup;
register_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var register_default = register_vue_vue_type_script_setup_true_lang_default;

export { register_default as default };
//# sourceMappingURL=register-Ci4w3eqB.mjs.map
