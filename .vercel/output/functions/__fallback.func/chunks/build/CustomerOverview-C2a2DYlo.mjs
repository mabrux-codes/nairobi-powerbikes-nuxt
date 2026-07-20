import { N as NuxtLink } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { Calendar, Wrench, Check, ChevronRight } from 'lucide-vue-next';
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

//#region app/components/dashboard/CustomerOverview.vue?vue&type=script&setup=true&lang.ts
var CustomerOverview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CustomerOverview",
	__ssrInlineRender: true,
	setup(__props) {
		usePB();
		const auth = useAuthStore();
		const loading = ref(true);
		const stats = ref({
			testRides: 0,
			serviceBookings: 0,
			favorites: 0
		});
		const testRides = ref([]);
		const serviceBookings = ref([]);
		const serviceSteps = [
			{
				key: "pending",
				label: "Booked"
			},
			{
				key: "diagnosed",
				label: "Diagnosed"
			},
			{
				key: "in_progress",
				label: "In Progress"
			},
			{
				key: "completed",
				label: "Completed"
			}
		];
		const statusOrder = {
			pending: 0,
			diagnosed: 1,
			in_progress: 2,
			completed: 3,
			cancelled: -1
		};
		function stepIndex(s) {
			return statusOrder[s] ?? -1;
		}
		function stepStyle(stepKey, bookingStatus) {
			const idx = stepIndex(bookingStatus);
			const stepIdx = statusOrder[stepKey];
			if (bookingStatus === "cancelled") return "bg-red-500/30 text-red-400";
			if (idx >= stepIdx) return "bg-emerald-500/30 text-emerald-400";
			return "bg-brand-grey/10 text-brand-grey/50";
		}
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "N/A";
		}
		function testRideStatusVariant(s) {
			return {
				pending: "warning",
				confirmed: "secondary",
				completed: "success",
				cancelled: "danger"
			}[s] || "outline";
		}
		function serviceStatusVariant(s) {
			return {
				pending: "warning",
				diagnosed: "default",
				in_progress: "secondary",
				completed: "success",
				cancelled: "danger"
			}[s] || "outline";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Button = button_default;
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-8"><h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Dashboard</span></h1><p class="mt-1 text-sm text-brand-grey">Welcome back, ${ssrInterpolate(unref(auth).user?.name || unref(auth).user?.email)}</p></div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-4 w-24 rounded bg-brand-grey/10"></div><div class="mt-2 h-8 w-16 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30"><p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Test Rides</p><p class="mt-2 font-display text-3xl tracking-display text-white">${ssrInterpolate(unref(stats).testRides)}</p></div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30"><p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Service Bookings</p><p class="mt-2 font-display text-3xl tracking-display text-white">${ssrInterpolate(unref(stats).serviceBookings)}</p></div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30"><p class="text-xs font-display tracking-display text-brand-grey uppercase">Favourites / Wishlist</p><p class="mt-2 font-display text-3xl tracking-display text-white">${ssrInterpolate(unref(stats).favorites)}</p></div></div><div class="mt-8 grid gap-6 lg:grid-cols-2"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">My Test Rides</h2><span class="text-xs text-brand-grey">Live</span></div>`);
				if (unref(testRides).length === 0) {
					_push(`<div class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">`);
					_push(ssrRenderComponent(unref(Calendar), { class: "mx-auto h-10 w-10 text-brand-grey/40" }, null, _parent));
					_push(`<p class="mt-3 font-display text-base tracking-display text-brand-grey">No Test Rides</p>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: "/service/test-ride",
						class: "mt-3 inline-block"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_Button, { size: "sm" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Book a Test Ride`);
									else return [createTextVNode("Book a Test Ride")];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(_component_Button, { size: "sm" }, {
								default: withCtx(() => [createTextVNode("Book a Test Ride")]),
								_: 1
							})];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else {
					_push(`<div class="mt-4 space-y-3"><!--[-->`);
					ssrRenderList(unref(testRides), (b) => {
						_push(`<div class="border-b border-brand-grey/10 pb-3 last:border-0 last:pb-0"><div class="flex items-start justify-between gap-2"><div><p class="text-sm text-white">${ssrInterpolate(b.motorcycle || "Motorcycle")}</p><p class="text-xs text-brand-grey">${ssrInterpolate(formatDate(b.preferred_date))} · ${ssrInterpolate(b.preferred_time || "N/A")}</p></div>`);
						_push(ssrRenderComponent(_component_Badge, { variant: testRideStatusVariant(b.status) }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(b.status)}`);
								else return [createTextVNode(toDisplayString(b.status), 1)];
							}),
							_: 2
						}, _parent));
						_push(`</div>`);
						if (b.notes) _push(`<p class="mt-1 text-xs text-brand-grey/60 italic">${ssrInterpolate(b.notes)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div>`);
				}
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">My Service Bookings</h2><span class="text-xs text-brand-grey">Live</span></div>`);
				if (unref(serviceBookings).length === 0) {
					_push(`<div class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">`);
					_push(ssrRenderComponent(unref(Wrench), { class: "mx-auto h-10 w-10 text-brand-grey/40" }, null, _parent));
					_push(`<p class="mt-3 font-display text-base tracking-display text-brand-grey">No Service Bookings</p>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: "/service/booking",
						class: "mt-3 inline-block"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_Button, { size: "sm" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Book a Service`);
									else return [createTextVNode("Book a Service")];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(_component_Button, { size: "sm" }, {
								default: withCtx(() => [createTextVNode("Book a Service")]),
								_: 1
							})];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else {
					_push(`<div class="mt-4 space-y-4"><!--[-->`);
					ssrRenderList(unref(serviceBookings), (b) => {
						_push(`<div class="border-b border-brand-grey/10 pb-4 last:border-0 last:pb-0"><div class="flex items-start justify-between gap-2"><div><p class="text-sm text-white">${ssrInterpolate(b.service_type || "Service")}</p><p class="text-xs text-brand-grey">${ssrInterpolate(b.motorcycle || "N/A")} · ${ssrInterpolate(formatDate(b.preferred_date))}</p></div>`);
						_push(ssrRenderComponent(_component_Badge, { variant: serviceStatusVariant(b.status) }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(b.status)}`);
								else return [createTextVNode(toDisplayString(b.status), 1)];
							}),
							_: 2
						}, _parent));
						_push(`</div><div class="mt-2"><div class="flex items-center gap-1 text-xs text-brand-grey/60"><!--[-->`);
						ssrRenderList(serviceSteps, (step, i) => {
							_push(`<div class="flex items-center gap-1"><div class="flex items-center gap-1.5"><div class="${ssrRenderClass([stepStyle(step.key, b.status), "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"])}">`);
							if (stepIndex(b.status) >= i) _push(ssrRenderComponent(unref(Check), { class: "h-3 w-3" }, null, _parent));
							else _push(`<span>${ssrInterpolate(i + 1)}</span>`);
							_push(`</div><span class="${ssrRenderClass(stepIndex(b.status) >= i ? "text-white" : "text-brand-grey/50")}">${ssrInterpolate(step.label)}</span></div>`);
							if (i < serviceSteps.length - 1) _push(ssrRenderComponent(unref(ChevronRight), { class: "mx-1 h-3 w-3 text-brand-grey/30" }, null, _parent));
							else _push(`<!---->`);
							_push(`</div>`);
						});
						_push(`<!--]--></div></div>`);
						if (b.notes) _push(`<p class="mt-1 text-xs text-brand-grey/60 italic">Notes: ${ssrInterpolate(b.notes)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div>`);
				}
				_push(`</div></div></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/dashboard/CustomerOverview.vue
var _sfc_setup = CustomerOverview_vue_vue_type_script_setup_true_lang_default.setup;
CustomerOverview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/CustomerOverview.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CustomerOverview_default = Object.assign(CustomerOverview_vue_vue_type_script_setup_true_lang_default, { __name: "CustomerOverview" });

export { CustomerOverview_default as default };
//# sourceMappingURL=CustomerOverview-C2a2DYlo.mjs.map
