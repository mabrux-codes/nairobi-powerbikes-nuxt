import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Calendar, Check, ChevronRight } from 'lucide-vue-next';
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

//#region app/pages/dashboard/my-test-rides.vue?vue&type=script&setup=true&lang.ts
var my_test_rides_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "my-test-rides",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "My Test Rides - Nairobi Powerbikes" });
		usePB();
		useAuthStore();
		const loading = ref(true);
		const allTestRides = ref([]);
		const statusFilter = ref("");
		const testRideSteps = [
			{
				key: "pending",
				label: "Pending"
			},
			{
				key: "confirmed",
				label: "Confirmed"
			},
			{
				key: "completed",
				label: "Completed"
			}
		];
		const testRideStatusOrder = {
			pending: 0,
			confirmed: 1,
			completed: 2,
			cancelled: -1
		};
		function testRideStepIndex(s) {
			return testRideStatusOrder[s] ?? -1;
		}
		function testRideStepStyle(stepKey, bookingStatus) {
			const idx = testRideStepIndex(bookingStatus);
			const stepIdx = testRideStatusOrder[stepKey];
			if (bookingStatus === "cancelled") return "bg-red-500/30 text-red-400";
			if (idx >= stepIdx) return "bg-emerald-500/30 text-emerald-400";
			return "bg-brand-grey/10 text-brand-grey/50";
		}
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "N/A";
		}
		function statusVariant(s) {
			return {
				pending: "warning",
				confirmed: "secondary",
				completed: "success",
				cancelled: "danger"
			}[s] || "outline";
		}
		const filtered = computed(() => {
			if (!statusFilter.value) return allTestRides.value;
			return allTestRides.value.filter((b) => b.status === statusFilter.value);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Button = button_default;
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Test Rides</span></h1><p class="mt-1 text-sm text-brand-grey">Your test ride bookings and their status</p></div><div class="mb-4 flex flex-wrap gap-3"><select class="input-field w-40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Status</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "pending") : ssrLooseEqual(unref(statusFilter), "pending")) ? " selected" : ""}>Pending</option><option value="confirmed"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "confirmed") : ssrLooseEqual(unref(statusFilter), "confirmed")) ? " selected" : ""}>Confirmed</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "completed") : ssrLooseEqual(unref(statusFilter), "completed")) ? " selected" : ""}>Completed</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "cancelled") : ssrLooseEqual(unref(statusFilter), "cancelled")) ? " selected" : ""}>Cancelled</option></select></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filtered).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Calendar), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Test Ride Bookings</p><p class="mt-2 text-sm text-brand-grey/60">You haven&#39;t booked any test rides yet</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/service/test-ride",
					class: "mt-4 inline-block"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_component_Button, null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Book a Test Ride`);
								else return [createTextVNode("Book a Test Ride")];
							}),
							_: 1
						}, _parent, _scopeId));
						else return [createVNode(_component_Button, null, {
							default: withCtx(() => [createTextVNode("Book a Test Ride")]),
							_: 1
						})];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="space-y-4"><!--[-->`);
				ssrRenderList(unref(filtered), (b) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all hover:border-brand-red/30"><div class="flex flex-wrap items-start justify-between gap-3"><div><div class="flex items-center gap-2"><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(b.motorcycle || "Test Ride")}</h3>`);
					_push(ssrRenderComponent(_component_Badge, { variant: "secondary" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Test Ride`);
							else return [createTextVNode("Test Ride")];
						}),
						_: 2
					}, _parent));
					_push(`</div><p class="text-xs text-brand-grey">${ssrInterpolate(formatDate(b.preferred_date))} · ${ssrInterpolate(b.preferred_time || "N/A")}</p></div>`);
					_push(ssrRenderComponent(_component_Badge, { variant: statusVariant(b.status) }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(b.status)}`);
							else return [createTextVNode(toDisplayString(b.status), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</div><div class="mt-3 grid gap-2 sm:grid-cols-3"><div><p class="text-xs text-brand-grey">Branch</p><p class="text-sm text-white">${ssrInterpolate(b.branch || "N/A")}</p></div><div><p class="text-xs text-brand-grey">Date</p><p class="text-sm text-white">${ssrInterpolate(formatDate(b.preferred_date) || "N/A")}</p></div><div><p class="text-xs text-brand-grey">Time</p><p class="text-sm text-white">${ssrInterpolate(b.preferred_time || "N/A")}</p></div></div><div class="mt-3"><div class="flex items-center gap-1 text-xs text-brand-grey/60"><!--[-->`);
					ssrRenderList(testRideSteps, (step, i) => {
						_push(`<div class="flex items-center gap-1"><div class="flex items-center gap-1.5"><div class="${ssrRenderClass([testRideStepStyle(step.key, b.status), "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"])}">`);
						if (testRideStepIndex(b.status) >= i) _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5" }, null, _parent));
						else _push(`<span>${ssrInterpolate(i + 1)}</span>`);
						_push(`</div><span class="${ssrRenderClass(testRideStepIndex(b.status) >= i ? "text-white" : "text-brand-grey/50")}">${ssrInterpolate(step.label)}</span></div>`);
						if (i < testRideSteps.length - 1) _push(ssrRenderComponent(unref(ChevronRight), { class: "mx-2 h-3 w-3 text-brand-grey/30" }, null, _parent));
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div></div>`);
					if (b.notes) _push(`<p class="mt-2 text-sm text-brand-grey/70">Notes: ${ssrInterpolate(b.notes)}</p>`);
					else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/my-test-rides.vue
var _sfc_setup = my_test_rides_vue_vue_type_script_setup_true_lang_default.setup;
my_test_rides_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-test-rides.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var my_test_rides_default = my_test_rides_vue_vue_type_script_setup_true_lang_default;

export { my_test_rides_default as default };
//# sourceMappingURL=my-test-rides-0seU_mR6.mjs.map
