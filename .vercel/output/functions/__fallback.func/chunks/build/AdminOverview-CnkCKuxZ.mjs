import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { defineComponent, ref, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderVNode, ssrRenderClass, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';
import '../virtual/entry.mjs';
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

//#region app/components/dashboard/AdminOverview.vue?vue&type=script&setup=true&lang.ts
var AdminOverview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminOverview",
	__ssrInlineRender: true,
	setup(__props) {
		usePB();
		const loading = ref(true);
		const stats = ref([]);
		const activities = ref([]);
		const chartData = ref({
			bookingsByStatus: [],
			bookingsTotal: 0,
			contactsByCategory: [],
			contactsTotal: 0,
			serviceByStatus: [],
			serviceTotal: 0
		});
		const recentContacts = ref([]);
		const subscriberCount = ref(0);
		const lastUpdated = ref("");
		function chartPct(count, total) {
			return total > 0 ? Math.round(count / total * 100) : 0;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-8"><h1 class="font-heading text-4xl text-white">Admin <span class="text-brand-red">Dashboard</span></h1><p class="mt-1 text-sm text-brand-grey">Overview of your entire business</p></div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-3 h-4 w-24 rounded bg-brand-grey/10"></div><div class="h-8 w-16 rounded bg-brand-grey/10"></div><div class="mt-2 h-3 w-20 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"><!--[-->`);
				ssrRenderList(unref(stats), (stat) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-200 hover:border-brand-red/30"><div class="flex items-center justify-between"><p class="text-xs font-display tracking-display text-brand-grey uppercase">${ssrInterpolate(stat.label)}</p>`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(stat.icon), { class: "h-5 w-5 text-brand-red" }, null), _parent);
					_push(`</div><p class="mt-2 font-display text-3xl tracking-display text-white">${ssrInterpolate(stat.value)}</p><p class="${ssrRenderClass([stat.change >= 0 ? "text-emerald-400" : "text-red-400", "mt-1 text-xs"])}">${ssrInterpolate(stat.change >= 0 ? "+" : "")}${ssrInterpolate(stat.change)}% from last month </p></div>`);
				});
				_push(`<!--]--></div><div class="mt-8 grid gap-8 lg:grid-cols-2"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Test Rides by Status</h2>`);
				if (unref(chartData).bookingsByStatus.length) {
					_push(`<div class="mt-4 space-y-3"><!--[-->`);
					ssrRenderList(unref(chartData).bookingsByStatus, (item) => {
						_push(`<div class="space-y-1"><div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">${ssrInterpolate(item.label)}</span><span class="text-white">${ssrInterpolate(item.count)}</span></div><div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-brand-red transition-all" style="${ssrRenderStyle({ width: chartPct(item.count, unref(chartData).bookingsTotal) + "%" })}"></div></div></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<div class="mt-4 text-sm text-brand-grey">No test ride data yet</div>`);
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Service Bookings by Status</h2>`);
				if (unref(chartData).serviceByStatus.length) {
					_push(`<div class="mt-4 space-y-3"><!--[-->`);
					ssrRenderList(unref(chartData).serviceByStatus, (item) => {
						_push(`<div class="space-y-1"><div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">${ssrInterpolate(item.label)}</span><span class="text-white">${ssrInterpolate(item.count)}</span></div><div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-emerald-500 transition-all" style="${ssrRenderStyle({ width: chartPct(item.count, unref(chartData).serviceTotal) + "%" })}"></div></div></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<div class="mt-4 text-sm text-brand-grey">No service bookings yet</div>`);
				_push(`</div></div><div class="mt-8 grid gap-8 lg:grid-cols-2"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Contacts by Category</h2>`);
				if (unref(chartData).contactsByCategory.length) {
					_push(`<div class="mt-4 space-y-3"><!--[-->`);
					ssrRenderList(unref(chartData).contactsByCategory, (item) => {
						_push(`<div class="space-y-1"><div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">${ssrInterpolate(item.label)}</span><span class="text-white">${ssrInterpolate(item.count)}</span></div><div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-amber-500 transition-all" style="${ssrRenderStyle({ width: chartPct(item.count, unref(chartData).contactsTotal) + "%" })}"></div></div></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<div class="mt-4 text-sm text-brand-grey">No contact data yet</div>`);
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Recent Activity</h2>`);
				if (unref(activities).length === 0) _push(`<div class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center"><p class="text-sm text-brand-grey">No recent activity</p></div>`);
				else {
					_push(`<div class="mt-4 space-y-3"><!--[-->`);
					ssrRenderList(unref(activities), (act) => {
						_push(`<div class="flex items-start gap-3 border-b border-brand-grey/10 pb-3 last:border-0 last:pb-0"><div class="${ssrRenderClass([act.bgClass, "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full"])}">`);
						ssrRenderVNode(_push, createVNode(resolveDynamicComponent(act.icon), { class: ["h-4 w-4", act.iconClass] }, null), _parent);
						_push(`</div><div class="flex-1 min-w-0"><p class="text-sm text-white">${ssrInterpolate(act.text)}</p><p class="text-xs text-brand-grey">${ssrInterpolate(act.time)}</p></div></div>`);
					});
					_push(`<!--]--></div>`);
				}
				_push(`</div></div><div class="mt-8 grid gap-8 lg:grid-cols-2"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Recent Contacts</h2>`);
				if (unref(recentContacts).length === 0) _push(`<div class="mt-4 text-sm text-brand-grey">No recent contacts</div>`);
				else {
					_push(`<div class="mt-4 space-y-2"><!--[-->`);
					ssrRenderList(unref(recentContacts), (c) => {
						_push(`<div class="flex items-center justify-between border-b border-brand-grey/10 pb-2 last:border-0 last:pb-0"><span class="text-sm text-white truncate">${ssrInterpolate(c.name || c.email)}</span>`);
						_push(ssrRenderComponent(_component_Badge, { size: "sm" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(c.category || "general")}`);
								else return [createTextVNode(toDisplayString(c.category || "general"), 1)];
							}),
							_: 2
						}, _parent));
						_push(`</div>`);
					});
					_push(`<!--]--></div>`);
				}
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">Subscribers</h2><p class="mt-2 font-display text-4xl tracking-display text-white">${ssrInterpolate(unref(subscriberCount))}</p><p class="text-xs text-brand-grey mt-1">Total email subscribers</p></div></div><div class="mt-4 text-xs text-brand-grey/40 text-right">Last updated: ${ssrInterpolate(unref(lastUpdated))}</div></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/dashboard/AdminOverview.vue
var _sfc_setup = AdminOverview_vue_vue_type_script_setup_true_lang_default.setup;
AdminOverview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/AdminOverview.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AdminOverview_default = Object.assign(AdminOverview_vue_vue_type_script_setup_true_lang_default, { __name: "AdminOverview" });

export { AdminOverview_default as default };
//# sourceMappingURL=AdminOverview-CnkCKuxZ.mjs.map
