import { u as useHead$1, b as useRoute$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { LoaderCircle, CalendarCheck } from 'lucide-vue-next';
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

//#region app/pages/service/test-ride.vue?vue&type=script&setup=true&lang.ts
var test_ride_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "test-ride",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Test Ride Booking - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Book a test ride at Nairobi Powerbikes. Experience your next motorcycle firsthand."
			}]
		});
		const pb = usePB();
		useRoute$1();
		const showSuccess = ref(false);
		const submitError = ref("");
		const submittedEmail = ref("");
		const motorcycles = ref([]);
		const bookedTimes = ref(/* @__PURE__ */ new Set());
		const selectedDate = ref("");
		const allTimeSlots = [
			"08:00",
			"09:00",
			"10:00",
			"11:00",
			"12:00",
			"13:00",
			"14:00",
			"15:00",
			"16:00"
		];
		const minDate = computed(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		const availableTimeSlots = computed(() => {
			const now = /* @__PURE__ */ new Date();
			return allTimeSlots.filter((slot) => {
				const [h] = slot.split(":").map(Number);
				if (selectedDate.value === now.toISOString().split("T")[0] && h <= now.getHours()) return false;
				return true;
			});
		});
		const model = pb.authStore.model;
		const isLoggedIn = !!model;
		const { handleSubmit, isSubmitting, resetForm, setFieldValue, setFieldError } = useForm({
			validationSchema: toTypedSchema(z.object({
				name: z.string().min(2, "Name required"),
				phone: z.string().min(8, "Valid phone required"),
				email: z.string().email("Valid email required"),
				motorcycle: z.string().min(1, "Select motorcycle"),
				date: z.string().min(1, "Select date"),
				time: z.string().min(1, "Select time"),
				branch: z.string().min(1),
				notes: z.string().optional()
			})),
			initialValues: {
				name: model?.name || "",
				phone: model?.phone || "",
				email: model?.email || "",
				motorcycle: "",
				date: "",
				time: "",
				branch: "mombasa-road",
				notes: ""
			}
		});
		async function onDateChange(e) {
			const date = e.target.value;
			selectedDate.value = date;
			if (!date) {
				bookedTimes.value = /* @__PURE__ */ new Set();
				return;
			}
			try {
				const res = await pb.collection("service_bookings").getList(1, 50, {
					filter: `preferred_date = "${date}" && type = "test_ride"`,
					fields: "preferred_time"
				});
				bookedTimes.value = new Set(res.items.map((b) => b.preferred_time));
			} catch {
				bookedTimes.value = /* @__PURE__ */ new Set();
			}
		}
		function closeSuccess() {
			showSuccess.value = false;
			submittedEmail.value = "";
		}
		const submit = handleSubmit(async (values) => {
			showSuccess.value = false;
			submitError.value = "";
			try {
				if ((await pb.collection("service_bookings").getList(1, 1, { filter: `preferred_date = "${values.date}" && preferred_time = "${values.time}" && type = "test_ride"` })).totalItems > 0) {
					setFieldError("time", "This time slot is already booked");
					submitError.value = "This time slot has already been taken. Please choose another.";
					return;
				}
				const userId = pb.authStore.model?.id || null;
				await pb.collection("service_bookings").create({
					type: "test_ride",
					name: values.name,
					phone: values.phone,
					email: values.email,
					motorcycle: values.motorcycle,
					branch: "Mombasa Road Branch",
					preferred_date: values.date,
					preferred_time: values.time,
					notes: values.notes || "",
					status: "pending",
					user: userId
				});
				submittedEmail.value = values.email;
				showSuccess.value = true;
				selectedDate.value = "";
				bookedTimes.value = /* @__PURE__ */ new Set();
				resetForm();
			} catch (err) {
				submitError.value = err?.data?.message || err?.message || "Booking failed. Please try again.";
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Book a <span class="text-brand-red"${_scopeId}>Test Ride</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Experience your next motorcycle firsthand. Schedule a test ride at our Mombasa Road branch.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Book a "), createVNode("span", { class: "text-brand-red" }, "Test Ride")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Experience your next motorcycle firsthand. Schedule a test ride at our Mombasa Road branch.")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mt-10 max-w-2xl",
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
						_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8"${_scopeId}><form class="space-y-5"${_scopeId}>`);
						if (!isLoggedIn) {
							_push(`<!--[--><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Full Name</label>`);
							_push(ssrRenderComponent(unref(Field), { name: "name" }, {
								default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
											type: "text",
											placeholder: "John Doe",
											class: ["input-field h-11", { "border-brand-red": errorMessage }]
										}))}${_scopeId}>`);
										if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
										else _push(`<!---->`);
									} else return [createVNode("input", mergeProps(componentField, {
										type: "text",
										placeholder: "John Doe",
										class: ["input-field h-11", { "border-brand-red": errorMessage }]
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
											placeholder: "+254 7XX XXX XXX",
											class: ["input-field h-11", { "border-brand-red": errorMessage }]
										}))}${_scopeId}>`);
										if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
										else _push(`<!---->`);
									} else return [createVNode("input", mergeProps(componentField, {
										type: "tel",
										placeholder: "+254 7XX XXX XXX",
										class: ["input-field h-11", { "border-brand-red": errorMessage }]
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
											placeholder: "john@example.com",
											class: ["input-field h-11", { "border-brand-red": errorMessage }]
										}))}${_scopeId}>`);
										if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
										else _push(`<!---->`);
									} else return [createVNode("input", mergeProps(componentField, {
										type: "email",
										placeholder: "john@example.com",
										class: ["input-field h-11", { "border-brand-red": errorMessage }]
									}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
										key: 0,
										class: "mt-1 text-xs text-brand-red"
									}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div><!--]-->`);
						} else _push(`<!---->`);
						_push(`<div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Motorcycle</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "motorcycle" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }))}${_scopeId}><option value="" disabled${_scopeId}>Select motorcycle</option><!--[-->`);
									ssrRenderList(unref(motorcycles), (b) => {
										_push(`<option${ssrRenderAttr("value", b.name)}${_scopeId}>${ssrInterpolate(b.name)} (${ssrInterpolate(b.year || "N/A")})</option>`);
									});
									_push(`<!--]--></select>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
									value: "",
									disabled: ""
								}, "Select motorcycle"), (openBlock(true), createBlock(Fragment, null, renderList(unref(motorcycles), (b) => {
									return openBlock(), createBlock("option", {
										key: b.id,
										value: b.name
									}, toDisplayString(b.name) + " (" + toDisplayString(b.year || "N/A") + ")", 9, ["value"]);
								}), 128))], 16), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div class="grid gap-5 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Preferred Date</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "date" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
										type: "date",
										class: ["input-field h-11", { "border-brand-red": errorMessage }],
										min: unref(minDate)
									}))}${_scopeId}>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
								} else return [createVNode("input", mergeProps(componentField, {
									type: "date",
									class: ["input-field h-11", { "border-brand-red": errorMessage }],
									min: unref(minDate),
									onChange: onDateChange
								}), null, 16, ["min"]), errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Preferred Time</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "time" }, {
							default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }))}${_scopeId}><option value="" disabled${_scopeId}>Select time</option><!--[-->`);
									ssrRenderList(unref(availableTimeSlots), (slot) => {
										_push(`<option${ssrRenderAttr("value", slot)}${ssrIncludeBooleanAttr(unref(bookedTimes).has(slot)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(slot)}</option>`);
									});
									_push(`<!--]--></select>`);
									if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
									else _push(`<!---->`);
									if (unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s))) _push(`<p class="mt-1 text-xs text-amber-400"${_scopeId}>Fully booked for this date</p>`);
									else _push(`<!---->`);
								} else return [
									createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
										value: "",
										disabled: ""
									}, "Select time"), (openBlock(true), createBlock(Fragment, null, renderList(unref(availableTimeSlots), (slot) => {
										return openBlock(), createBlock("option", {
											key: slot,
											value: slot,
											disabled: unref(bookedTimes).has(slot)
										}, toDisplayString(slot), 9, ["value", "disabled"]);
									}), 128))], 16),
									errorMessage ? (openBlock(), createBlock("p", {
										key: 0,
										class: "mt-1 text-xs text-brand-red"
									}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true),
									unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s)) ? (openBlock(), createBlock("p", {
										key: 1,
										class: "mt-1 text-xs text-amber-400"
									}, "Fully booked for this date")) : createCommentVNode("", true)
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Branch</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "branch" }, {
							default: withCtx(({ componentField }, _push, _parent, _scopeId) => {
								if (_push) _push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: "input-field h-11 appearance-none" }))}${_scopeId}><option value="mombasa-road"${_scopeId}>Mombasa Road Branch</option></select>`);
								else return [createVNode("select", mergeProps(componentField, { class: "input-field h-11 appearance-none" }), [createVNode("option", { value: "mombasa-road" }, "Mombasa Road Branch")], 16)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>Additional Notes</label>`);
						_push(ssrRenderComponent(unref(Field), { name: "notes" }, {
							default: withCtx(({ componentField }, _push, _parent, _scopeId) => {
								if (_push) _push(`<textarea${ssrRenderAttrs(_temp0 = mergeProps(componentField, {
									rows: "3",
									class: "input-field min-h-[100px]",
									placeholder: "Any preferences..."
								}), "textarea")}${_scopeId}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
								else return [createVNode("textarea", mergeProps(componentField, {
									rows: "3",
									class: "input-field min-h-[100px]",
									placeholder: "Any preferences..."
								}), null, 16)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting) || unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s))) ? " disabled" : ""} class="btn-primary mt-2 w-full justify-center h-12 disabled:opacity-50"${_scopeId}>`);
						if (unref(isSubmitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(CalendarCheck), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`${ssrInterpolate(unref(isSubmitting) ? "Booking..." : "Book Test Ride")}</button></form>`);
						if (unref(submitError)) _push(`<div class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"${_scopeId}><p class="text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(submitError))}</p></div>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8" }, [createVNode("form", {
						onSubmit: withModifiers(unref(submit), ["prevent"]),
						class: "space-y-5"
					}, [
						!isLoggedIn ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Full Name"), createVNode(unref(Field), { name: "name" }, {
							default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
								type: "text",
								placeholder: "John Doe",
								class: ["input-field h-11", { "border-brand-red": errorMessage }]
							}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-xs text-brand-red"
							}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
							_: 1
						})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Phone"), createVNode(unref(Field), { name: "phone" }, {
							default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
								type: "tel",
								placeholder: "+254 7XX XXX XXX",
								class: ["input-field h-11", { "border-brand-red": errorMessage }]
							}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-xs text-brand-red"
							}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
							_: 1
						})])]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Email"), createVNode(unref(Field), { name: "email" }, {
							default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
								type: "email",
								placeholder: "john@example.com",
								class: ["input-field h-11", { "border-brand-red": errorMessage }]
							}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-xs text-brand-red"
							}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
							_: 1
						})])], 64)) : createCommentVNode("", true),
						createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Motorcycle"), createVNode(unref(Field), { name: "motorcycle" }, {
							default: withCtx(({ componentField, errorMessage }) => [createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
								value: "",
								disabled: ""
							}, "Select motorcycle"), (openBlock(true), createBlock(Fragment, null, renderList(unref(motorcycles), (b) => {
								return openBlock(), createBlock("option", {
									key: b.id,
									value: b.name
								}, toDisplayString(b.name) + " (" + toDisplayString(b.year || "N/A") + ")", 9, ["value"]);
							}), 128))], 16), errorMessage ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-xs text-brand-red"
							}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
							_: 1
						})]),
						createVNode("div", { class: "grid gap-5 sm:grid-cols-2" }, [createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Preferred Date"), createVNode(unref(Field), { name: "date" }, {
							default: withCtx(({ componentField, errorMessage }) => [createVNode("input", mergeProps(componentField, {
								type: "date",
								class: ["input-field h-11", { "border-brand-red": errorMessage }],
								min: unref(minDate),
								onChange: onDateChange
							}), null, 16, ["min"]), errorMessage ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-xs text-brand-red"
							}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)]),
							_: 1
						})]), createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Preferred Time"), createVNode(unref(Field), { name: "time" }, {
							default: withCtx(({ componentField, errorMessage }) => [
								createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
									value: "",
									disabled: ""
								}, "Select time"), (openBlock(true), createBlock(Fragment, null, renderList(unref(availableTimeSlots), (slot) => {
									return openBlock(), createBlock("option", {
										key: slot,
										value: slot,
										disabled: unref(bookedTimes).has(slot)
									}, toDisplayString(slot), 9, ["value", "disabled"]);
								}), 128))], 16),
								errorMessage ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-1 text-xs text-brand-red"
								}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true),
								unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s)) ? (openBlock(), createBlock("p", {
									key: 1,
									class: "mt-1 text-xs text-amber-400"
								}, "Fully booked for this date")) : createCommentVNode("", true)
							]),
							_: 1
						})])]),
						createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Branch"), createVNode(unref(Field), { name: "branch" }, {
							default: withCtx(({ componentField }) => [createVNode("select", mergeProps(componentField, { class: "input-field h-11 appearance-none" }), [createVNode("option", { value: "mombasa-road" }, "Mombasa Road Branch")], 16)]),
							_: 1
						})]),
						createVNode("div", null, [createVNode("label", { class: "mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase" }, "Additional Notes"), createVNode(unref(Field), { name: "notes" }, {
							default: withCtx(({ componentField }) => [createVNode("textarea", mergeProps(componentField, {
								rows: "3",
								class: "input-field min-h-[100px]",
								placeholder: "Any preferences..."
							}), null, 16)]),
							_: 1
						})]),
						createVNode("button", {
							type: "submit",
							disabled: unref(isSubmitting) || unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s)),
							class: "btn-primary mt-2 w-full justify-center h-12 disabled:opacity-50"
						}, [unref(isSubmitting) ? (openBlock(), createBlock(unref(LoaderCircle), {
							key: 0,
							class: "h-5 w-5 animate-spin"
						})) : (openBlock(), createBlock(unref(CalendarCheck), {
							key: 1,
							class: "h-5 w-5"
						})), createTextVNode(toDisplayString(unref(isSubmitting) ? "Booking..." : "Book Test Ride"), 1)], 8, ["disabled"])
					], 40, ["onSubmit"]), unref(submitError) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"
					}, [createVNode("p", { class: "text-sm text-brand-red" }, toDisplayString(unref(submitError)), 1)])) : createCommentVNode("", true)])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showSuccess)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">`);
					_push(ssrRenderComponent(unref(motion).div, {
						initial: {
							opacity: 0,
							scale: .9
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						class: "relative w-full max-w-md rounded-sm border border-green-500/30 bg-brand-black p-8 text-center shadow-2xl"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"${_scopeId}>`);
								_push(ssrRenderComponent(unref(CalendarCheck), { class: "h-8 w-8 text-green-400" }, null, _parent, _scopeId));
								_push(`</div><h2 class="font-heading text-2xl text-white"${_scopeId}>Booking Submitted!</h2><p class="mt-3 text-sm leading-relaxed text-brand-grey"${_scopeId}> Your test ride request has been received. We will send a confirmation with your appointment details to <span class="font-medium text-white"${_scopeId}>${ssrInterpolate(unref(submittedEmail))}</span>. </p><button class="btn-primary mt-6 w-full justify-center"${_scopeId}>Got it</button>`);
							} else return [
								createVNode("div", { class: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20" }, [createVNode(unref(CalendarCheck), { class: "h-8 w-8 text-green-400" })]),
								createVNode("h2", { class: "font-heading text-2xl text-white" }, "Booking Submitted!"),
								createVNode("p", { class: "mt-3 text-sm leading-relaxed text-brand-grey" }, [
									createTextVNode(" Your test ride request has been received. We will send a confirmation with your appointment details to "),
									createVNode("span", { class: "font-medium text-white" }, toDisplayString(unref(submittedEmail)), 1),
									createTextVNode(". ")
								]),
								createVNode("button", {
									onClick: closeSuccess,
									class: "btn-primary mt-6 w-full justify-center"
								}, "Got it")
							];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/service/test-ride.vue
var _sfc_setup = test_ride_vue_vue_type_script_setup_true_lang_default.setup;
test_ride_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/service/test-ride.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var test_ride_default = test_ride_vue_vue_type_script_setup_true_lang_default;

export { test_ride_default as default };
//# sourceMappingURL=test-ride-DP4_bCYN.mjs.map
