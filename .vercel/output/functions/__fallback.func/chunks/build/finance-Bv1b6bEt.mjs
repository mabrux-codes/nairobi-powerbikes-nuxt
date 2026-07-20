import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withDirectives, isRef, vModelText, vModelSelect, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
import { LoaderCircle, BadgeDollarSign, CheckCircle, Check, Phone, Mail } from 'lucide-vue-next';
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

//#region app/pages/finance.vue?vue&type=script&setup=true&lang.ts
var finance_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "finance",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Financing - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Explore flexible motorcycle financing options. Use our loan calculator and apply online."
			}]
		});
		const pb = usePB();
		const calcPrice = ref(5e5);
		const calcDown = ref(5e4);
		const calcRate = ref(12.5);
		const calcTerm = ref(36);
		const { handleSubmit: handleFinSubmit, isSubmitting: isSubmittingFin, resetForm: resetFinForm } = useForm({
			validationSchema: toTypedSchema(z.object({
				fin_name: z.string().min(2, "Name required"),
				fin_phone: z.string().min(10, "Valid phone required"),
				fin_email: z.string().email("Valid email required"),
				fin_bike: z.string().optional(),
				fin_employment: z.string().min(1, "Select employment status"),
				fin_income: z.string().optional()
			})),
			initialValues: {
				fin_name: "",
				fin_phone: "",
				fin_email: "",
				fin_bike: "",
				fin_employment: "",
				fin_income: ""
			}
		});
		const finSuccess = ref(false);
		const finError = ref("");
		const loanAmount = computed(() => Math.max(0, calcPrice.value - calcDown.value));
		const monthlyRate = computed(() => calcRate.value / 100 / 12);
		const monthlyPayment = computed(() => {
			if (loanAmount.value <= 0 || calcTerm.value <= 0) return 0;
			const r = monthlyRate.value;
			const n = calcTerm.value;
			if (r === 0) return Math.round(loanAmount.value / n);
			return Math.round(loanAmount.value * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
		});
		const totalAmount = computed(() => monthlyPayment.value * calcTerm.value);
		const totalInterest = computed(() => totalAmount.value - loanAmount.value);
		const submitFinance = handleFinSubmit(async (values) => {
			finSuccess.value = false;
			finError.value = "";
			try {
				await pb.collection("contacts").create({
					name: values.fin_name,
					email: values.fin_email,
					phone: values.fin_phone,
					subject: "Finance: " + (values.fin_bike || ""),
					message: "Loan Amount: KES " + loanAmount.value + "\nEmployment: " + values.fin_employment + "\nMonthly Income: " + (values.fin_income || "N/A") + "\nInterest Rate: " + calcRate.value + "%\nTerm: " + calcTerm.value + " months",
					category: "finance",
					status: "new"
				});
				finSuccess.value = true;
				resetFinForm();
			} catch (err) {
				finError.value = err?.data?.message || err?.message || "Submission failed.";
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Motorcycle <span class="text-brand-red"${_scopeId}>Financing</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Flexible financing options to get you on the road. Use our loan calculator or apply directly.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Motorcycle "), createVNode("span", { class: "text-brand-red" }, "Financing")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Flexible financing options to get you on the road. Use our loan calculator or apply directly.")
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
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8"${_scopeId}><h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white"${_scopeId}>Loan Calculator</h2><div class="mt-6 space-y-5"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Vehicle Price (KES)</label><input${ssrRenderAttr("value", unref(calcPrice))} type="number" class="input-field" min="0"${_scopeId}></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Down Payment (KES)</label><input${ssrRenderAttr("value", unref(calcDown))} type="number" class="input-field" min="0"${_scopeId}></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Interest Rate (%)</label><input${ssrRenderAttr("value", unref(calcRate))} type="number" class="input-field" min="0" step="0.1"${_scopeId}></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Term (Months)</label><select class="input-field appearance-none"${_scopeId}><option${ssrRenderAttr("value", 12)}${ssrIncludeBooleanAttr(Array.isArray(unref(calcTerm)) ? ssrLooseContain(unref(calcTerm), 12) : ssrLooseEqual(unref(calcTerm), 12)) ? " selected" : ""}${_scopeId}>12 Months</option><option${ssrRenderAttr("value", 24)}${ssrIncludeBooleanAttr(Array.isArray(unref(calcTerm)) ? ssrLooseContain(unref(calcTerm), 24) : ssrLooseEqual(unref(calcTerm), 24)) ? " selected" : ""}${_scopeId}>24 Months</option><option${ssrRenderAttr("value", 36)}${ssrIncludeBooleanAttr(Array.isArray(unref(calcTerm)) ? ssrLooseContain(unref(calcTerm), 36) : ssrLooseEqual(unref(calcTerm), 36)) ? " selected" : ""}${_scopeId}>36 Months</option><option${ssrRenderAttr("value", 48)}${ssrIncludeBooleanAttr(Array.isArray(unref(calcTerm)) ? ssrLooseContain(unref(calcTerm), 48) : ssrLooseEqual(unref(calcTerm), 48)) ? " selected" : ""}${_scopeId}>48 Months</option><option${ssrRenderAttr("value", 60)}${ssrIncludeBooleanAttr(Array.isArray(unref(calcTerm)) ? ssrLooseContain(unref(calcTerm), 60) : ssrLooseEqual(unref(calcTerm), 60)) ? " selected" : ""}${_scopeId}>60 Months</option></select></div></div><div class="mt-6 grid grid-cols-2 gap-4 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5"${_scopeId}><div${_scopeId}><p class="text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Monthly Payment</p><p class="font-display text-2xl text-white"${_scopeId}>KES ${ssrInterpolate(unref(monthlyPayment).toLocaleString())}</p></div><div${_scopeId}><p class="text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Total Interest</p><p class="font-display text-2xl text-white"${_scopeId}>KES ${ssrInterpolate(unref(totalInterest).toLocaleString())}</p></div><div class="col-span-2"${_scopeId}><p class="text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Total Amount</p><p class="font-display text-2xl text-white"${_scopeId}>KES ${ssrInterpolate(unref(totalAmount).toLocaleString())}</p></div></div></div><div class="mt-8 rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8"${_scopeId}><h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white"${_scopeId}>Apply for Financing</h2><form class="mt-6 space-y-5"${_scopeId}><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Full Name</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "fin_name" }, {
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
						_push(ssrRenderComponent(unref(Field), { name: "fin_phone" }, {
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
						_push(ssrRenderComponent(unref(Field), { name: "fin_email" }, {
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
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Preferred Motorcycle</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "fin_bike" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) _push(`<input${ssrRenderAttrs(mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}))}${_scopeId}>`);
								else return [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Employment Status</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "fin_employment" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) _push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: "input-field appearance-none" }))}${_scopeId}><option value="" disabled${_scopeId}>Select</option><option${_scopeId}>Employed</option><option${_scopeId}>Self-Employed</option><option${_scopeId}>Business Owner</option></select>`);
								else return [createVNode("select", mergeProps(componentField, { class: "input-field appearance-none" }), [
									createVNode("option", {
										value: "",
										disabled: ""
									}, "Select"),
									createVNode("option", null, "Employed"),
									createVNode("option", null, "Self-Employed"),
									createVNode("option", null, "Business Owner")
								], 16)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Monthly Income (KES)</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "fin_income" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) _push(`<input${ssrRenderAttrs(mergeProps(componentField, {
									type: "number",
									class: "input-field"
								}))}${_scopeId}>`);
								else return [createVNode("input", mergeProps(componentField, {
									type: "number",
									class: "input-field"
								}), null, 16)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmittingFin)) ? " disabled" : ""} class="btn-primary w-full justify-center disabled:opacity-50"${_scopeId}>`);
						if (unref(isSubmittingFin)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(BadgeDollarSign), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`${ssrInterpolate(unref(isSubmittingFin) ? "Submitting..." : "Submit Application")}</button></form>`);
						if (unref(finSuccess)) {
							_push(`<div class="mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center"${_scopeId}>`);
							_push(ssrRenderComponent(unref(CheckCircle), { class: "mx-auto mb-3 h-8 w-8 text-green-400" }, null, _parent, _scopeId));
							_push(`<p class="font-display text-xl tracking-display text-green-400"${_scopeId}>Application Submitted</p><p class="mt-1 text-sm text-green-300"${_scopeId}>Our finance team will contact you within 48 hours.</p></div>`);
						} else _push(`<!---->`);
						if (unref(finError)) _push(`<div class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"${_scopeId}><p class="text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(finError))}</p></div>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8" }, [
						createVNode("h2", { class: "font-display text-display-sm leading-[var(--leading-display)] text-white" }, "Loan Calculator"),
						createVNode("div", { class: "mt-6 space-y-5" }, [
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Vehicle Price (KES)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => isRef(calcPrice) ? calcPrice.value = $event : null,
								type: "number",
								class: "input-field",
								min: "0"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(calcPrice),
								void 0,
								{ number: true }
							]])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Down Payment (KES)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => isRef(calcDown) ? calcDown.value = $event : null,
								type: "number",
								class: "input-field",
								min: "0"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(calcDown),
								void 0,
								{ number: true }
							]])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Interest Rate (%)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => isRef(calcRate) ? calcRate.value = $event : null,
								type: "number",
								class: "input-field",
								min: "0",
								step: "0.1"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(calcRate),
								void 0,
								{ number: true }
							]])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Term (Months)"), withDirectives(createVNode("select", {
								"onUpdate:modelValue": ($event) => isRef(calcTerm) ? calcTerm.value = $event : null,
								class: "input-field appearance-none"
							}, [
								createVNode("option", { value: 12 }, "12 Months"),
								createVNode("option", { value: 24 }, "24 Months"),
								createVNode("option", { value: 36 }, "36 Months"),
								createVNode("option", { value: 48 }, "48 Months"),
								createVNode("option", { value: 60 }, "60 Months")
							], 8, ["onUpdate:modelValue"]), [[
								vModelSelect,
								unref(calcTerm),
								void 0,
								{ number: true }
							]])])
						]),
						createVNode("div", { class: "mt-6 grid grid-cols-2 gap-4 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5" }, [
							createVNode("div", null, [createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey uppercase" }, "Monthly Payment"), createVNode("p", { class: "font-display text-2xl text-white" }, "KES " + toDisplayString(unref(monthlyPayment).toLocaleString()), 1)]),
							createVNode("div", null, [createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey uppercase" }, "Total Interest"), createVNode("p", { class: "font-display text-2xl text-white" }, "KES " + toDisplayString(unref(totalInterest).toLocaleString()), 1)]),
							createVNode("div", { class: "col-span-2" }, [createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey uppercase" }, "Total Amount"), createVNode("p", { class: "font-display text-2xl text-white" }, "KES " + toDisplayString(unref(totalAmount).toLocaleString()), 1)])
						])
					]), createVNode("div", { class: "mt-8 rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8" }, [
						createVNode("h2", { class: "font-display text-display-sm leading-[var(--leading-display)] text-white" }, "Apply for Financing"),
						createVNode("form", {
							onSubmit: withModifiers(unref(submitFinance), ["prevent"]),
							class: "mt-6 space-y-5"
						}, [
							createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Full Name"), createVNode(unref(Field), { name: "fin_name" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Phone"), createVNode(unref(Field), { name: "fin_phone" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "tel",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})])]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Email"), createVNode(unref(Field), { name: "fin_email" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "email",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
								_: 1
							})]),
							createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Preferred Motorcycle"), createVNode(unref(Field), { name: "fin_bike" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "text",
									class: ["input-field", { "border-brand-red": errorMessage }]
								}), null, 16)]),
								_: 1
							})]),
							createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Employment Status"), createVNode(unref(Field), { name: "fin_employment" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("select", mergeProps(componentField, { class: "input-field appearance-none" }), [
									createVNode("option", {
										value: "",
										disabled: ""
									}, "Select"),
									createVNode("option", null, "Employed"),
									createVNode("option", null, "Self-Employed"),
									createVNode("option", null, "Business Owner")
								], 16)]),
								_: 1
							})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Monthly Income (KES)"), createVNode(unref(Field), { name: "fin_income" }, {
								default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
									type: "number",
									class: "input-field"
								}), null, 16)]),
								_: 1
							})])]),
							createVNode("button", {
								type: "submit",
								disabled: unref(isSubmittingFin),
								class: "btn-primary w-full justify-center disabled:opacity-50"
							}, [unref(isSubmittingFin) ? (openBlock(), createBlock(unref(LoaderCircle), {
								key: 0,
								class: "h-5 w-5 animate-spin"
							})) : (openBlock(), createBlock(unref(BadgeDollarSign), {
								key: 1,
								class: "h-5 w-5"
							})), createTextVNode(toDisplayString(unref(isSubmittingFin) ? "Submitting..." : "Submit Application"), 1)], 8, ["disabled"])
						], 40, ["onSubmit"]),
						unref(finSuccess) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center"
						}, [
							createVNode(unref(CheckCircle), { class: "mx-auto mb-3 h-8 w-8 text-green-400" }),
							createVNode("p", { class: "font-display text-xl tracking-display text-green-400" }, "Application Submitted"),
							createVNode("p", { class: "mt-1 text-sm text-green-300" }, "Our finance team will contact you within 48 hours.")
						])) : createCommentVNode("", true),
						unref(finError) ? (openBlock(), createBlock("div", {
							key: 1,
							class: "mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"
						}, [createVNode("p", { class: "text-sm text-brand-red" }, toDisplayString(unref(finError)), 1)])) : createCommentVNode("", true)
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
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"${_scopeId}><h3 class="font-display text-lg text-white"${_scopeId}>Why Finance With Us?</h3><ul class="mt-4 space-y-3 text-sm text-brand-grey"${_scopeId}><li class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }, null, _parent, _scopeId));
						_push(`Competitive interest rates from 9.9% APR</li><li class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }, null, _parent, _scopeId));
						_push(`Flexible repayment terms up to 60 months</li><li class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }, null, _parent, _scopeId));
						_push(`Quick approval within 48 hours</li><li class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }, null, _parent, _scopeId));
						_push(`Low down payment options from 10%</li><li class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }, null, _parent, _scopeId));
						_push(`No hidden fees or early repayment penalties</li></ul></div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"${_scopeId}><h3 class="font-display text-lg text-white"${_scopeId}>Need Help?</h3><p class="mt-2 text-sm text-brand-grey"${_scopeId}>Our finance specialists are ready to assist you with the application process.</p><p class="mt-3 flex items-center gap-2 text-sm"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 text-brand-red" }, null, _parent, _scopeId));
						_push(`<a href="tel:+254712345678" class="hover:text-brand-red"${_scopeId}>+254 712 345 678</a></p><p class="mt-1 flex items-center gap-2 text-sm"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Mail), { class: "h-4 w-4 text-brand-red" }, null, _parent, _scopeId));
						_push(`<a href="mailto:finance@nairobipowerbikes.com" class="hover:text-brand-red"${_scopeId}>finance@nairobipowerbikes.com</a></p></div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6" }, [createVNode("h3", { class: "font-display text-lg text-white" }, "Why Finance With Us?"), createVNode("ul", { class: "mt-4 space-y-3 text-sm text-brand-grey" }, [
						createVNode("li", { class: "flex gap-3" }, [createVNode(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }), createTextVNode("Competitive interest rates from 9.9% APR")]),
						createVNode("li", { class: "flex gap-3" }, [createVNode(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }), createTextVNode("Flexible repayment terms up to 60 months")]),
						createVNode("li", { class: "flex gap-3" }, [createVNode(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }), createTextVNode("Quick approval within 48 hours")]),
						createVNode("li", { class: "flex gap-3" }, [createVNode(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }), createTextVNode("Low down payment options from 10%")]),
						createVNode("li", { class: "flex gap-3" }, [createVNode(unref(Check), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-red" }), createTextVNode("No hidden fees or early repayment penalties")])
					])]), createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6" }, [
						createVNode("h3", { class: "font-display text-lg text-white" }, "Need Help?"),
						createVNode("p", { class: "mt-2 text-sm text-brand-grey" }, "Our finance specialists are ready to assist you with the application process."),
						createVNode("p", { class: "mt-3 flex items-center gap-2 text-sm" }, [createVNode(unref(Phone), { class: "h-4 w-4 text-brand-red" }), createVNode("a", {
							href: "tel:+254712345678",
							class: "hover:text-brand-red"
						}, "+254 712 345 678")]),
						createVNode("p", { class: "mt-1 flex items-center gap-2 text-sm" }, [createVNode(unref(Mail), { class: "h-4 w-4 text-brand-red" }), createVNode("a", {
							href: "mailto:finance@nairobipowerbikes.com",
							class: "hover:text-brand-red"
						}, "finance@nairobipowerbikes.com")])
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/finance.vue
var _sfc_setup = finance_vue_vue_type_script_setup_true_lang_default.setup;
finance_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/finance.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var finance_default = finance_vue_vue_type_script_setup_true_lang_default;

export { finance_default as default };
//# sourceMappingURL=finance-Bv1b6bEt.mjs.map
