import { u as useHead$1, C as ClientOnly } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { MapPin } from 'lucide-vue-next';
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

//#region app/pages/dashboard/branches.vue?vue&type=script&setup=true&lang.ts
var branches_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "branches",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Branches - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const items = ref([]);
		const showModal = ref(false);
		const editingId = ref(null);
		const imageFile = ref(null);
		const imagePreview = ref(null);
		const form = ref({
			name: "",
			slug: "",
			address: "",
			phone: "",
			email: "",
			hours: "",
			lat: "",
			lng: "",
			map_url: "",
			sort_order: "0"
		});
		computed(() => items.value.filter((b) => b.lat != null && b.lng != null).map((b) => ({
			name: b.name,
			address: b.address,
			phone: b.phone,
			hours: b.hours,
			lat: b.lat,
			lng: b.lng
		})));
		function openCreate() {
			editingId.value = null;
			form.value = {
				name: "",
				slug: "",
				address: "",
				phone: "",
				email: "",
				hours: "",
				lat: "",
				lng: "",
				map_url: "",
				sort_order: "0"
			};
			imageFile.value = null;
			imagePreview.value = null;
			showModal.value = true;
		}
		function openEdit(b) {
			editingId.value = b.id;
			form.value = {
				name: b.name,
				slug: b.slug || "",
				address: b.address || "",
				phone: b.phone || "",
				email: b.email || "",
				hours: b.hours || "",
				lat: b.lat?.toString() || "",
				lng: b.lng?.toString() || "",
				map_url: b.map_url || "",
				sort_order: b.sort_order?.toString() || "0"
			};
			imageFile.value = null;
			imagePreview.value = b.image ? pb.files.getURL(b, b.image) : null;
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveItem() {
			saving.value = true;
			try {
				const data = new FormData();
				for (const f of [
					"name",
					"slug",
					"address",
					"phone",
					"email",
					"hours",
					"map_url",
					"sort_order"
				]) if (form.value[f]) data.append(f, String(form.value[f]));
				if (form.value.lat) data.append("lat", form.value.lat);
				if (form.value.lng) data.append("lng", form.value.lng);
				if (imageFile.value) data.append("image", imageFile.value);
				if (editingId.value) await pb.collection("branches").update(editingId.value, data);
				else await pb.collection("branches").create(data);
				closeModal();
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(b) {
			if (await confirm(`Delete "${b.name}"?`)) pb.collection("branches").delete(b.id).then(() => loadData());
		}
		async function loadData() {
			try {
				const res = await pb.collection("branches").getList(1, 50, { sort: "sort_order" });
				items.value = res.items;
			} catch (e) {
				console.error(e);
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_ClientOnly = ClientOnly;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Branches</h1><p class="mt-1 text-sm text-brand-grey">Manage dealership branches</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreate
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Branch`);
					else return [createTextVNode("Add Branch")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(MapPin), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Branches</p></div>`);
			} else {
				_push(`<div><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"><!--[-->`);
				ssrRenderList(unref(items), (b) => {
					_push(`<div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-colors hover:border-brand-red/30"><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(b.name)}</h3><p class="mt-1 text-xs text-brand-grey">${ssrInterpolate(b.address)}</p><p class="mt-2 text-sm text-brand-grey">${ssrInterpolate(b.phone)} · ${ssrInterpolate(b.email)}</p><p class="mt-1 text-xs text-brand-grey/60 whitespace-pre-line">${ssrInterpolate(b.hours)}</p><div class="mt-4 flex gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openEdit(b)
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
				_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
				_push(`</div>`);
			}
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Branch" : "Add Branch")}</h2><div class="mt-4 space-y-4"><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).slug,
						"onUpdate:modelValue": ($event) => unref(form).slug = $event,
						label: "Slug",
						placeholder: "branch-name"
					}, null, _parent));
					_push(`</div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).address,
						"onUpdate:modelValue": ($event) => unref(form).address = $event,
						label: "Address"
					}, null, _parent));
					_push(`<div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).phone,
						"onUpdate:modelValue": ($event) => unref(form).phone = $event,
						label: "Phone"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).email,
						"onUpdate:modelValue": ($event) => unref(form).email = $event,
						label: "Email"
					}, null, _parent));
					_push(`</div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).hours,
						"onUpdate:modelValue": ($event) => unref(form).hours = $event,
						label: "Hours",
						placeholder: "Mon-Sat: 8:00 AM - 6:00 PM"
					}, null, _parent));
					_push(`<div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).lat,
						"onUpdate:modelValue": ($event) => unref(form).lat = $event,
						label: "Latitude",
						type: "number",
						placeholder: "-1.326"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).lng,
						"onUpdate:modelValue": ($event) => unref(form).lng = $event,
						label: "Longitude",
						type: "number",
						placeholder: "36.845"
					}, null, _parent));
					_push(`</div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).map_url,
						"onUpdate:modelValue": ($event) => unref(form).map_url = $event,
						label: "Google Maps URL",
						placeholder: "https://maps.google.com/?q=..."
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Image</label><input type="file" accept="image/*" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white">`);
					if (unref(imagePreview)) _push(`<img${ssrRenderAttr("src", unref(imagePreview))} class="mt-2 h-20 object-cover rounded-sm">`);
					else _push(`<!---->`);
					_push(`</div>`);
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
//#region app/pages/dashboard/branches.vue
var _sfc_setup = branches_vue_vue_type_script_setup_true_lang_default.setup;
branches_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/branches.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var branches_default = branches_vue_vue_type_script_setup_true_lang_default;

export { branches_default as default };
//# sourceMappingURL=branches-8P3OkbUk.mjs.map
