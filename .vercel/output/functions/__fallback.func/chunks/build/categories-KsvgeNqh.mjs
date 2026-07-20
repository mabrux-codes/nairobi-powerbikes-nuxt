import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
import { Tag } from 'lucide-vue-next';
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

//#region app/pages/dashboard/categories.vue?vue&type=script&setup=true&lang.ts
var categories_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "categories",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Categories - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const items = ref([]);
		const showModal = ref(false);
		const editingId = ref(null);
		const form = ref({
			name: "",
			description: ""
		});
		function openCreate() {
			editingId.value = null;
			form.value = {
				name: "",
				description: ""
			};
			showModal.value = true;
		}
		function openEdit(c) {
			editingId.value = c.id;
			form.value = {
				name: c.name,
				description: c.description || ""
			};
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveItem() {
			saving.value = true;
			try {
				if (editingId.value) await pb.collection("categories").update(editingId.value, form.value);
				else await pb.collection("categories").create(form.value);
				closeModal();
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(c) {
			if (await confirm(`Delete "${c.name}"?`)) pb.collection("categories").delete(c.id).then(() => loadData());
		}
		async function loadData() {
			try {
				const res = await pb.collection("categories").getList(1, 50, { sort: "name" });
				items.value = res.items;
			} catch (e) {
				console.error(e);
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Categories</h1><p class="mt-1 text-sm text-brand-grey">Manage motorcycle categories</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreate
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Category`);
					else return [createTextVNode("Add Category")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-48 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Tag), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Categories</p></div>`);
			} else {
				_push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(items), (c) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4"><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(c.name)}</h3>`);
					if (c.description) _push(`<p class="text-xs text-brand-grey">${ssrInterpolate(c.description)}</p>`);
					else _push(`<!---->`);
					_push(`<div class="mt-3 flex gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openEdit(c)
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
						onClick: ($event) => confirmDelete(c)
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
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Category" : "Add Category")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).description,
						"onUpdate:modelValue": ($event) => unref(form).description = $event,
						label: "Description"
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
//#region app/pages/dashboard/categories.vue
var _sfc_setup = categories_vue_vue_type_script_setup_true_lang_default.setup;
categories_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/categories.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var categories_default = categories_vue_vue_type_script_setup_true_lang_default;

export { categories_default as default };
//# sourceMappingURL=categories-KsvgeNqh.mjs.map
