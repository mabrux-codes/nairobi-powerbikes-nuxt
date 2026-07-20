import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, isRef, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/dashboard/apparel.vue?vue&type=script&setup=true&lang.ts
var apparel_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "apparel",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Apparel - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const items = ref([]);
		const types = [
			"T-Shirts",
			"Jackets",
			"Hoodies",
			"Caps",
			"Gloves",
			"Pants",
			"Vests",
			"Other"
		];
		const sizes = [
			"XS",
			"S",
			"M",
			"L",
			"XL",
			"2XL",
			"3XL"
		];
		const searchQuery = ref("");
		const typeFilter = ref("");
		const showModal = ref(false);
		const editingId = ref(null);
		const form = ref({
			name: "",
			type: "",
			size: "",
			price: "",
			color: "",
			description: "",
			in_stock: true
		});
		function formatPrice(p) {
			return p ? p.toLocaleString() : "0";
		}
		const filtered = computed(() => {
			return items.value.filter((a) => {
				if (searchQuery.value && !a.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
				if (typeFilter.value && a.type !== typeFilter.value) return false;
				return true;
			});
		});
		function openCreateModal() {
			editingId.value = null;
			form.value = {
				name: "",
				type: "",
				size: "",
				price: "",
				color: "",
				description: "",
				in_stock: true
			};
			showModal.value = true;
		}
		function openEditModal(a) {
			editingId.value = a.id;
			form.value = {
				name: a.name,
				type: a.type || "",
				size: a.size || "",
				price: a.price?.toString() || "",
				color: a.color || "",
				description: a.description || "",
				in_stock: a.in_stock ?? true
			};
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveItem() {
			saving.value = true;
			try {
				const payload = {
					...form.value,
					price: parseFloat(form.value.price) || 0
				};
				if (editingId.value) await pb.collection("apparel").update(editingId.value, payload);
				else await pb.collection("apparel").create(payload);
				closeModal();
				await loadItems();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(a) {
			if (await confirm(`Delete "${a.name}"?`)) pb.collection("apparel").delete(a.id).then(() => loadItems());
		}
		async function loadItems() {
			try {
				const res = await pb.collection("apparel").getList(1, 100, { sort: "-created" });
				items.value = res.items;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Apparel</h1><p class="mt-1 text-sm text-brand-grey">Manage apparel inventory</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreateModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Apparel`);
					else return [createTextVNode("Add Apparel")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mb-4 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_Input, {
				modelValue: unref(searchQuery),
				"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
				placeholder: "Search apparel...",
				class: "w-64"
			}, null, _parent));
			_push(`<select class="input-field w-44"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "") : ssrLooseEqual(unref(typeFilter), "")) ? " selected" : ""}>All Types</option><!--[-->`);
			ssrRenderList(types, (t) => {
				_push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), t) : ssrLooseEqual(unref(typeFilter), t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
			});
			_push(`<!--]--></select></div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mb-3 h-40 rounded-sm bg-brand-grey/10"></div><div class="h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filtered).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><p class="font-display text-xl tracking-display text-brand-grey">No Apparel Found</p><p class="mt-2 text-sm text-brand-grey/60">Add your first apparel item to the inventory</p></div>`);
			else {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(filtered), (a) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-all duration-200 hover:border-brand-red/30"><div class="mb-3 flex aspect-video items-center justify-center rounded-sm bg-brand-grey/10"><span class="font-display text-4xl tracking-display text-brand-grey/20">${ssrInterpolate(a.name?.slice(0, 1))}</span></div><h3 class="font-display text-lg tracking-display text-white truncate">${ssrInterpolate(a.name)}</h3><p class="text-sm text-brand-grey">${ssrInterpolate(a.type || "General")} · ${ssrInterpolate(a.size || "N/A")}</p><div class="mt-3 flex items-center justify-between"><span class="text-lg font-bold text-brand-red">KSh ${ssrInterpolate(formatPrice(a.price))}</span>`);
					_push(ssrRenderComponent(_component_Badge, { variant: a.in_stock ? "success" : "danger" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(a.in_stock ? "In Stock" : "Out of Stock")}`);
							else return [createTextVNode(toDisplayString(a.in_stock ? "In Stock" : "Out of Stock"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</div><div class="mt-3 flex gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						class: "flex-1",
						onClick: ($event) => openEditModal(a)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Edit`);
							else return [createTextVNode("Edit")];
						}),
						_: 2
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						class: "flex-1",
						onClick: ($event) => confirmDelete(a)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Delete`);
							else return [createTextVNode("Delete")];
						}),
						_: 2
					}, _parent));
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Apparel" : "Add Apparel")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name",
						placeholder: "Apparel name"
					}, null, _parent));
					_push(`<div class="grid grid-cols-2 gap-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "") : ssrLooseEqual(unref(form).type, "")) ? " selected" : ""}>Select</option><!--[-->`);
					ssrRenderList(types, (t) => {
						_push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, t) : ssrLooseEqual(unref(form).type, t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
					});
					_push(`<!--]--></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Size</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).size) ? ssrLooseContain(unref(form).size, "") : ssrLooseEqual(unref(form).size, "")) ? " selected" : ""}>Select</option><!--[-->`);
					ssrRenderList(sizes, (s) => {
						_push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).size) ? ssrLooseContain(unref(form).size, s) : ssrLooseEqual(unref(form).size, s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
					});
					_push(`<!--]--></select></div></div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).price,
						"onUpdate:modelValue": ($event) => unref(form).price = $event,
						label: "Price (KSh)",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).color,
						"onUpdate:modelValue": ($event) => unref(form).color = $event,
						label: "Color",
						placeholder: "e.g. Black"
					}, null, _parent));
					_push(`</div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea rows="3" class="input-field w-full resize-none" placeholder="Description...">${ssrInterpolate(unref(form).description)}</textarea></div><div class="flex items-center gap-3"><input id="inStockA"${ssrIncludeBooleanAttr(Array.isArray(unref(form).in_stock) ? ssrLooseContain(unref(form).in_stock, null) : unref(form).in_stock) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-brand-red"><label for="inStockA" class="text-sm text-brand-grey">In Stock</label></div></div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: closeModal
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(saving),
						onClick: saveItem
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
//#region app/pages/dashboard/apparel.vue
var _sfc_setup = apparel_vue_vue_type_script_setup_true_lang_default.setup;
apparel_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/apparel.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var apparel_default = apparel_vue_vue_type_script_setup_true_lang_default;

export { apparel_default as default };
//# sourceMappingURL=apparel-Cx4HqQQZ.mjs.map
