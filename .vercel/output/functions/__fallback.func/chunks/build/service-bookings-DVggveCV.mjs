import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { Wrench } from 'lucide-vue-next';
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

//#region app/pages/dashboard/service-bookings.vue?vue&type=script&setup=true&lang.ts
var service_bookings_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "service-bookings",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Service Bookings - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const items = ref([]);
		const showModal = ref(false);
		const editingItem = ref(null);
		const updateForm = ref({
			status: "pending",
			cost: "",
			notes: ""
		});
		function statusVariant(s) {
			return {
				pending: "warning",
				diagnosed: "default",
				in_progress: "secondary",
				completed: "success",
				cancelled: "danger"
			}[s] || "outline";
		}
		function openUpdate(s) {
			editingItem.value = s;
			updateForm.value = {
				status: s.status || "pending",
				cost: s.cost?.toString() || "",
				notes: s.notes || ""
			};
			showModal.value = true;
		}
		async function saveUpdate() {
			saving.value = true;
			try {
				const p = {
					status: updateForm.value.status,
					notes: updateForm.value.notes
				};
				if (updateForm.value.cost) p.cost = parseFloat(updateForm.value.cost);
				await pb.collection("service_bookings").update(editingItem.value.id, p);
				showModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function loadData() {
			try {
				const res = await pb.collection("service_bookings").getList(1, 100, {
					sort: "-created",
					filter: "type=\"service\""
				});
				items.value = res.items;
			} catch (e) {
				console.error(e);
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Badge = badge_default;
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6"><h1 class="font-heading text-4xl text-white">Service <span class="text-brand-red">Bookings</span></h1><p class="mt-1 text-sm text-brand-grey">Manage customer service bookings</p></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Wrench), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Service Bookings</p></div>`);
			} else {
				_push(`<div class="space-y-4"><!--[-->`);
				ssrRenderList(unref(items), (s) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(s.name || "Guest")}</h3><p class="text-xs text-brand-grey">${ssrInterpolate(s.service_type)} · ${ssrInterpolate(s.motorcycle)}</p></div>`);
					_push(ssrRenderComponent(_component_Badge, { variant: statusVariant(s.status) }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(s.status)}`);
							else return [createTextVNode(toDisplayString(s.status), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</div>`);
					if (s.phone || s.email) {
						_push(`<div class="mt-2 flex flex-wrap gap-4 text-xs text-brand-grey/70">`);
						if (s.phone) _push(`<span>Phone: ${ssrInterpolate(s.phone)}</span>`);
						else _push(`<!---->`);
						if (s.email) _push(`<span>Email: ${ssrInterpolate(s.email)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					if (s.description) _push(`<p class="mt-2 text-sm text-brand-grey/70">${ssrInterpolate(s.description)}</p>`);
					else _push(`<!---->`);
					if (s.preferred_date || s.preferred_time || s.branch) {
						_push(`<div class="mt-1 flex flex-wrap gap-3 text-xs text-brand-grey/50">`);
						if (s.preferred_date) _push(`<span>Date: ${ssrInterpolate(s.preferred_date)}</span>`);
						else _push(`<!---->`);
						if (s.preferred_time) _push(`<span>Time: ${ssrInterpolate(s.preferred_time)}</span>`);
						else _push(`<!---->`);
						if (s.branch) _push(`<span>Branch: ${ssrInterpolate(s.branch)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`<div class="mt-3 flex gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						size: "sm",
						onClick: ($event) => openUpdate(s)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Update Status`);
							else return [createTextVNode("Update Status")];
						}),
						_: 2
					}, _parent));
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">Update Status</h2><div class="mt-4 space-y-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label><select class="input-field w-full"><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "pending") : ssrLooseEqual(unref(updateForm).status, "pending")) ? " selected" : ""}>Pending</option><option value="diagnosed"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "diagnosed") : ssrLooseEqual(unref(updateForm).status, "diagnosed")) ? " selected" : ""}>Diagnosed</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "in_progress") : ssrLooseEqual(unref(updateForm).status, "in_progress")) ? " selected" : ""}>In Progress</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "completed") : ssrLooseEqual(unref(updateForm).status, "completed")) ? " selected" : ""}>Completed</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "cancelled") : ssrLooseEqual(unref(updateForm).status, "cancelled")) ? " selected" : ""}>Cancelled</option></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Cost (KSh)</label><input${ssrRenderAttr("value", unref(updateForm).cost)} type="number" class="input-field w-full"></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Notes</label><textarea rows="3" class="input-field w-full resize-none">${ssrInterpolate(unref(updateForm).notes)}</textarea></div></div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(saving),
						onClick: saveUpdate
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(saving) ? "Saving..." : "Save"), 1)];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/service-bookings.vue
var _sfc_setup = service_bookings_vue_vue_type_script_setup_true_lang_default.setup;
service_bookings_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/service-bookings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var service_bookings_default = service_bookings_vue_vue_type_script_setup_true_lang_default;

export { service_bookings_default as default };
//# sourceMappingURL=service-bookings-DVggveCV.mjs.map
