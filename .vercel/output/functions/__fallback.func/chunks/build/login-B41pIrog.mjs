import { u as useHead$1, n as navigateTo, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuth } from './useAuth-CUdaXvut.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, unref, withCtx, mergeProps, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { LoaderCircle, LogIn } from 'lucide-vue-next';
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

//#region app/pages/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Sign In - Nairobi Powerbikes" });
		const { login } = useAuth();
		const { handleSubmit, isSubmitting, setFieldError } = useForm({
			validationSchema: toTypedSchema(z.object({
				email: z.string().email("Valid email required"),
				password: z.string().min(6, "Password must be at least 6 characters")
			})),
			initialValues: {
				email: "",
				password: ""
			}
		});
		const errorMsg = ref("");
		const handleLogin = handleSubmit(async (values) => {
			errorMsg.value = "";
			try {
				await login(values.email, values.password);
				await navigateTo("/dashboard");
			} catch (err) {
				const msg = err?.data?.message || err?.message || "Invalid email or password.";
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
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black p-8"${_scopeId}><div class="mb-6 text-center"${_scopeId}><h1 class="font-heading text-4xl text-white sm:text-5xl"${_scopeId}>Welcome <span class="text-brand-red"${_scopeId}>Back</span></h1><p class="mt-2 text-sm text-brand-grey"${_scopeId}>Sign in to your account</p></div><form class="space-y-5"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Email</label>`);
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
						_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="btn-primary w-full justify-center disabled:opacity-50"${_scopeId}>`);
						if (unref(isSubmitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(LogIn), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`${ssrInterpolate(unref(isSubmitting) ? "Signing In..." : "Sign In")}</button></form>`);
						if (unref(errorMsg)) _push(`<div class="mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"${_scopeId}><p class="text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(errorMsg))}</p></div>`);
						else _push(`<!---->`);
						_push(`<p class="mt-6 text-center text-sm text-brand-grey"${_scopeId}>Don&#39;t have an account? `);
						_push(ssrRenderComponent(_component_NuxtLink, {
							to: "/register",
							class: "font-display text-brand-red hover:underline"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Register`);
								else return [createTextVNode("Register")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</p></div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black p-8" }, [
						createVNode("div", { class: "mb-6 text-center" }, [createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl" }, [createTextVNode("Welcome "), createVNode("span", { class: "text-brand-red" }, "Back")]), createVNode("p", { class: "mt-2 text-sm text-brand-grey" }, "Sign in to your account")]),
						createVNode("form", {
							onSubmit: withModifiers(unref(handleLogin), ["prevent"]),
							class: "space-y-5"
						}, [
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
							createVNode("button", {
								type: "submit",
								disabled: unref(isSubmitting),
								class: "btn-primary w-full justify-center disabled:opacity-50"
							}, [unref(isSubmitting) ? (openBlock(), createBlock(unref(LoaderCircle), {
								key: 0,
								class: "h-5 w-5 animate-spin"
							})) : (openBlock(), createBlock(unref(LogIn), {
								key: 1,
								class: "h-5 w-5"
							})), createTextVNode(toDisplayString(unref(isSubmitting) ? "Signing In..." : "Sign In"), 1)], 8, ["disabled"])
						], 40, ["onSubmit"]),
						unref(errorMsg) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"
						}, [createVNode("p", { class: "text-sm text-brand-red" }, toDisplayString(unref(errorMsg)), 1)])) : createCommentVNode("", true),
						createVNode("p", { class: "mt-6 text-center text-sm text-brand-grey" }, [createTextVNode("Don't have an account? "), createVNode(_component_NuxtLink, {
							to: "/register",
							class: "font-display text-brand-red hover:underline"
						}, {
							default: withCtx(() => [createTextVNode("Register")]),
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
//#region app/pages/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = login_vue_vue_type_script_setup_true_lang_default;

export { login_default as default };
//# sourceMappingURL=login-B41pIrog.mjs.map
