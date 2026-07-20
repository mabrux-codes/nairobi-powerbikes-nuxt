import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';

//#region app/pages/dashboard/brands.vue?vue&type=script&setup=true&lang.ts
var brands_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "brands",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Brands - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const brands = ref([]);
		const showModal = ref(false);
		const editingId = ref(null);
		const logoFile = ref(null);
		const logoPreview = ref(null);
		const form = ref({
			name: "",
			tagline: "",
			country: "",
			description: "",
			sort_order: "0"
		});
		function openCreateModal() {
			editingId.value = null;
			form.value = {
				name: "",
				tagline: "",
				country: "",
				description: "",
				sort_order: "0"
			};
			logoFile.value = null;
			logoPreview.value = null;
			showModal.value = true;
		}
		function openEditModal(b) {
			editingId.value = b.id;
			form.value = {
				name: b.name,
				tagline: b.tagline || "",
				country: b.country || "",
				description: b.description || "",
				sort_order: b.sort_order?.toString() || "0"
			};
			logoFile.value = null;
			logoPreview.value = b.logo ? pb.files.getURL(b, b.logo) : null;
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveBrand() {
			saving.value = true;
			try {
				const data = new FormData();
				data.append("name", form.value.name);
				data.append("tagline", form.value.tagline);
				data.append("country", form.value.country);
				data.append("description", form.value.description);
				data.append("sort_order", form.value.sort_order || "0");
				if (logoFile.value) data.append("logo", logoFile.value);
				if (editingId.value) await pb.collection("brands").update(editingId.value, data);
				else await pb.collection("brands").create(data);
				closeModal();
				await loadBrands();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(b) {
			if (await confirm(`Delete brand "${b.name}"?`)) pb.collection("brands").delete(b.id).then(() => loadBrands());
		}
		async function loadBrands() {
			try {
				const res = await pb.collection("brands").getList(1, 100, { sort: "sort_order,name" });
				brands.value = res.items;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Brands</h1><p class="mt-1 text-sm text-brand-grey">Manage motorcycle brands</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreateModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Brand`);
					else return [createTextVNode("Add Brand")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mx-auto mb-3 h-16 w-16 rounded-full bg-brand-grey/10"></div><div class="mx-auto h-5 w-24 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(brands).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><p class="font-display text-xl tracking-display text-brand-grey">No Brands Found</p><p class="mt-2 text-sm text-brand-grey/60">Add your first brand to get started</p></div>`);
			else {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(brands), (b) => {
					_push(`<div class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 text-center transition-all duration-200 hover:border-brand-red/30">`);
					if (b.logo) _push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center"><img${ssrRenderAttr("src", unref(pb).files.getURL(b, b.logo))}${ssrRenderAttr("alt", b.name)} class="max-h-16 max-w-16 object-contain"></div>`);
					else _push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-grey/10"><span class="font-display text-2xl tracking-display text-brand-grey/40">${ssrInterpolate(b.name?.slice(0, 2).toUpperCase())}</span></div>`);
					_push(`<h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(b.name)}</h3>`);
					if (b.tagline) _push(`<p class="mt-1 text-xs text-brand-grey italic">${ssrInterpolate(b.tagline)}</p>`);
					else _push(`<!---->`);
					if (b.country) _push(`<p class="mt-1 text-xs text-brand-grey">${ssrInterpolate(b.country)}</p>`);
					else _push(`<!---->`);
					_push(`<div class="mt-4 flex justify-center gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openEditModal(b)
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
						onClick: ($event) => confirmDelete(b)
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
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Brand" : "Add Brand")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Brand Name",
						placeholder: "e.g. Kawasaki"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).tagline,
						"onUpdate:modelValue": ($event) => unref(form).tagline = $event,
						label: "Tagline",
						placeholder: "e.g. Let the Good Times Roll"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).country,
						"onUpdate:modelValue": ($event) => unref(form).country = $event,
						label: "Country",
						placeholder: "e.g. Japan"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Logo</label><input type="file" accept="image/*" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white">`);
					if (unref(logoPreview)) _push(`<img${ssrRenderAttr("src", unref(logoPreview))} class="mt-2 h-12 object-contain">`);
					else _push(`<!---->`);
					_push(`</div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea rows="3" class="input-field w-full resize-none" placeholder="Brand description...">${ssrInterpolate(unref(form).description)}</textarea></div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).sort_order,
						"onUpdate:modelValue": ($event) => unref(form).sort_order = $event,
						label: "Sort Order",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(`</div><div class="mt-6 flex justify-end gap-3">`);
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
						onClick: saveBrand
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
//#region app/pages/dashboard/brands.vue
var _sfc_setup = brands_vue_vue_type_script_setup_true_lang_default.setup;
brands_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/brands.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var brands_default = brands_vue_vue_type_script_setup_true_lang_default;

export { brands_default as default };
//# sourceMappingURL=brands-CERD8Iuw.mjs.map
