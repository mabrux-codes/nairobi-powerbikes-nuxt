import { u as useHead$1, C as ClientOnly, S as ServerPlaceholder } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { LoaderCircle, Send, CheckCircle, MapPin, Phone, Clock } from 'lucide-vue-next';
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
import 'pocketbase';
import 'framer-motion/dom';
import '@vueuse/core';
import 'motion-dom';
import 'hey-listen';
import 'motion-utils';

//#region app/pages/contact.vue?vue&type=script&setup=true&lang.ts
var contact_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "contact",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Contact Us - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Get in touch with Nairobi Powerbikes. Visit our branch on Mombasa Road or Kiambu Road."
			}]
		});
		const pb = usePB();
		const { handleSubmit, isSubmitting, resetForm } = useForm({
			validationSchema: toTypedSchema(z.object({
				name: z.string().min(2, "Name required"),
				email: z.string().email("Valid email required"),
				phone: z.string().optional(),
				subject: z.string().min(2, "Subject required"),
				category: z.string().min(1, "Select category"),
				message: z.string().min(10, "Message too short")
			})),
			initialValues: {
				name: "",
				email: "",
				phone: "",
				subject: "",
				category: "",
				message: ""
			}
		});
		const showSuccess = ref(false);
		const submitError = ref("");
		const branchesLoading = ref(true);
		const branches = ref([]);
		const categories = [
			"General Inquiry",
			"Sales",
			"Service",
			"Parts",
			"Financing",
			"Feedback",
			"Other"
		];
		const mapBranches = computed(() => {
			if (branches.value.length) return branches.value.filter((b) => b.lat && b.lng).map((b) => ({
				name: b.name,
				address: b.address,
				phone: b.phone,
				hours: b.hours,
				lat: b.lat,
				lng: b.lng
			}));
			return [{
				name: "Mombasa Road Branch",
				address: "DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi",
				phone: "+254 712 345 678",
				hours: "Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM",
				lat: -1.326078,
				lng: 36.8458795
			}, {
				name: "Kiambu Road Branch",
				address: "TotalEnergies Kiambu Road Service Station, Kiambu Road",
				phone: "+254 723 456 789",
				hours: "Mon-Sat: 8:30 AM - 6:30 PM\nSun: 10:00 AM - 4:00 PM",
				lat: -1.1891417,
				lng: 36.8371582
			}];
		});
		const submit = handleSubmit(async (values) => {
			showSuccess.value = false;
			submitError.value = "";
			try {
				await pb.collection("contacts").create({
					name: values.name,
					email: values.email,
					phone: values.phone || "",
					subject: values.subject,
					category: values.category,
					message: values.message,
					status: "new"
				});
				showSuccess.value = true;
				resetForm();
			} catch (err) {
				submitError.value = err?.data?.message || err?.message || "Failed to send message.";
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			const _component_LeafletMap = ServerPlaceholder;
			let _temp0;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					y: 40
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Get in Touch</h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>We&#39;d love to hear from you. Reach out with any questions or inquiries.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, "Get in Touch"),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "We'd love to hear from you. Reach out with any questions or inquiries.")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="mt-10 grid gap-12 lg:grid-cols-5">`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "lg:col-span-3",
				initial: {
					opacity: 0,
					x: -30
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					delay: .2,
					duration: .5
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8"${_scopeId}><h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white"${_scopeId}>Send Us a Message</h2><form class="mt-6 space-y-5"${_scopeId}><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Name</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "name" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "text",
										class: ["input-field", { "border-brand-red": errorMessage }]
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
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
										class: ["input-field", { "border-brand-red": errorMessage }]
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "tel",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Email</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "email" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "email",
										class: ["input-field", { "border-brand-red": errorMessage }]
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "email",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Subject</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "subject" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "text",
										class: ["input-field", { "border-brand-red": errorMessage }]
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Category</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "category" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: ["input-field appearance-none", { "border-brand-red": errorMessage }] }))}${_scopeId}><option value="" disabled${_scopeId}>Select category</option><!--[-->`);
									ssrRenderList(categories, (c) => {
										_push(`<option${ssrRenderAttr("value", c)}${_scopeId}>${ssrInterpolate(c)}</option>`);
									});
									_push(`<!--]--></select>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("select", mergeProps(componentField, { class: ["input-field appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
									value: "",
									disabled: ""
								}, "Select category"), (openBlock(), createBlock(Fragment, null, renderList(categories, (c) => {
									return createVNode("option", {
										key: c,
										value: c
									}, toDisplayString(c), 9, ["value"]);
								}), 64))], 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Message</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "message" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<textarea${ssrRenderAttrs(_temp0 = mergeProps(componentField, {
										rows: "5",
										class: ["input-field min-h-[140px]", { "border-brand-red": errorMessage }]
									}), "textarea")}${_scopeId}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("textarea", mergeProps(componentField, {
									rows: "5",
									class: ["input-field min-h-[140px]", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="btn-primary w-full justify-center disabled:opacity-50"${_scopeId}>`);
						if (unref(isSubmitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(Send), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`${ssrInterpolate(unref(isSubmitting) ? "Sending..." : "Send Message")}</button></form>`);
						if (unref(showSuccess)) {
							_push(`<div class="mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center"${_scopeId}>`);
							_push(ssrRenderComponent(unref(CheckCircle), { class: "mx-auto mb-3 h-8 w-8 text-green-400" }, null, _parent, _scopeId));
							_push(`<p class="font-display text-xl tracking-display text-green-400"${_scopeId}>Message Sent!</p><p class="mt-1 text-sm text-green-300"${_scopeId}>We&#39;ll get back to you as soon as possible.</p><button class="btn-ghost mt-4"${_scopeId}>Send Another Message</button></div>`);
						} else _push(`<!---->`);
						if (unref(submitError)) _push(`<div class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"${_scopeId}><p class="text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(submitError))}</p></div>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8" }, [
						createVNode("h2", { class: "font-display text-display-sm leading-[var(--leading-display)] text-white" }, "Send Us a Message"),
						createVNode("form", {
							onSubmit: withModifiers(unref(submit), ["prevent"]),
							class: "mt-6 space-y-5"
						}, [
							createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Name"), createVNode(unref(Field), { name: "name" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Phone"), createVNode(unref(Field), { name: "phone" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "tel",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Email"), createVNode(unref(Field), { name: "email" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "email",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Subject"), createVNode(unref(Field), { name: "subject" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Category"), createVNode(unref(Field), { name: "category" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("select", mergeProps(componentField, { class: ["input-field appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
									value: "",
									disabled: ""
								}, "Select category"), (openBlock(), createBlock(Fragment, null, renderList(categories, (c) => {
									return createVNode("option", {
										key: c,
										value: c
									}, toDisplayString(c), 9, ["value"]);
								}), 64))], 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Message"), createVNode(unref(Field), { name: "message" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("textarea", mergeProps(componentField, {
									rows: "5",
									class: ["input-field min-h-[140px]", { "border-brand-red": errorMessage }]
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
							})) : (openBlock(), createBlock(unref(Send), {
								key: 1,
								class: "h-5 w-5"
							})), createTextVNode(toDisplayString(unref(isSubmitting) ? "Sending..." : "Send Message"), 1)], 8, ["disabled"])
						], 40, ["onSubmit"]),
						unref(showSuccess) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center"
						}, [
							createVNode(unref(CheckCircle), { class: "mx-auto mb-3 h-8 w-8 text-green-400" }),
							createVNode("p", { class: "font-display text-xl tracking-display text-green-400" }, "Message Sent!"),
							createVNode("p", { class: "mt-1 text-sm text-green-300" }, "We'll get back to you as soon as possible."),
							createVNode("button", {
								class: "btn-ghost mt-4",
								onClick: unref(resetForm)
							}, "Send Another Message", 8, ["onClick"])
						])) : createCommentVNode("", true),
						unref(submitError) ? (openBlock(), createBlock("div", {
							key: 1,
							class: "mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"
						}, [createVNode("p", { class: "text-sm text-brand-red" }, toDisplayString(unref(submitError)), 1)])) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).div, {
				class: "lg:col-span-2 space-y-6",
				initial: {
					opacity: 0,
					x: 30
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					delay: .3,
					duration: .5
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(branchesLoading)) {
							_push(`<div class="animate-pulse space-y-6"${_scopeId}><!--[-->`);
							ssrRenderList(3, (i) => {
								_push(`<div class="h-40 rounded-sm bg-brand-grey/10"${_scopeId}></div>`);
							});
							_push(`<!--]--></div>`);
						} else {
							_push(`<!--[-->`);
							ssrRenderList(unref(branches), (branch) => {
								_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all duration-300 hover:border-brand-red/40"${_scopeId}><div class="mb-3 flex items-center gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 text-brand-red" }, null, _parent, _scopeId));
								_push(`<h3 class="font-display text-lg text-white"${_scopeId}>${ssrInterpolate(branch.name)}</h3></div><div class="space-y-2 text-sm text-brand-grey"${_scopeId}><p class="flex items-center gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(branch.address)}</p>`);
								if (branch.phone) {
									_push(`<p class="flex items-center gap-2"${_scopeId}>`);
									_push(ssrRenderComponent(unref(Phone), { class: "h-3.5 w-3.5 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
									_push(`<a${ssrRenderAttr("href", `tel:${branch.phone}`)} class="hover:text-brand-red"${_scopeId}>${ssrInterpolate(branch.phone)}</a></p>`);
								} else _push(`<!---->`);
								if (branch.hours) {
									_push(`<p class="flex items-start gap-2"${_scopeId}>`);
									_push(ssrRenderComponent(unref(Clock), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
									_push(`<span class="whitespace-pre-line"${_scopeId}>${ssrInterpolate(branch.hours)}</span></p>`);
								} else _push(`<!---->`);
								_push(`</div></div>`);
							});
							_push(`<!--]-->`);
						}
						_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<div class="h-[300px] animate-pulse rounded-sm bg-brand-grey/10"${_scopeId}></div>`);
							else return [createVNode("div", { class: "h-[300px] animate-pulse rounded-sm bg-brand-grey/10" })];
						}) }, _parent, _scopeId));
					} else return [unref(branchesLoading) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "animate-pulse space-y-6"
					}, [(openBlock(), createBlock(Fragment, null, renderList(3, (i) => {
						return createVNode("div", {
							key: i,
							class: "h-40 rounded-sm bg-brand-grey/10"
						});
					}), 64))])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(unref(branches), (branch) => {
						return openBlock(), createBlock("div", {
							key: branch.id,
							class: "rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all duration-300 hover:border-brand-red/40"
						}, [createVNode("div", { class: "mb-3 flex items-center gap-2" }, [createVNode(unref(MapPin), { class: "h-4 w-4 text-brand-red" }), createVNode("h3", { class: "font-display text-lg text-white" }, toDisplayString(branch.name), 1)]), createVNode("div", { class: "space-y-2 text-sm text-brand-grey" }, [
							createVNode("p", { class: "flex items-center gap-2" }, [createVNode(unref(MapPin), { class: "h-3.5 w-3.5 shrink-0 text-brand-grey/50" }), createTextVNode(toDisplayString(branch.address), 1)]),
							branch.phone ? (openBlock(), createBlock("p", {
								key: 0,
								class: "flex items-center gap-2"
							}, [createVNode(unref(Phone), { class: "h-3.5 w-3.5 shrink-0 text-brand-grey/50" }), createVNode("a", {
								href: `tel:${branch.phone}`,
								class: "hover:text-brand-red"
							}, toDisplayString(branch.phone), 9, ["href"])])) : createCommentVNode("", true),
							branch.hours ? (openBlock(), createBlock("p", {
								key: 1,
								class: "flex items-start gap-2"
							}, [createVNode(unref(Clock), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-grey/50" }), createVNode("span", { class: "whitespace-pre-line" }, toDisplayString(branch.hours), 1)])) : createCommentVNode("", true)
						])]);
					}), 128)), createVNode(_component_ClientOnly, null, {
						fallback: withCtx(() => [createVNode("div", { class: "h-[300px] animate-pulse rounded-sm bg-brand-grey/10" })]),
						default: withCtx(() => [createVNode(_component_LeafletMap, {
							branches: unref(mapBranches),
							height: "300px"
						}, null, 8, ["branches"])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/contact.vue
var _sfc_setup = contact_vue_vue_type_script_setup_true_lang_default.setup;
contact_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var contact_default = contact_vue_vue_type_script_setup_true_lang_default;

export { contact_default as default };
//# sourceMappingURL=contact-roLXIhbU.mjs.map
