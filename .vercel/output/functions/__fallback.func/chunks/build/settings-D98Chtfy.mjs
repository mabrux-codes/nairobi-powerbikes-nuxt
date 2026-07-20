import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/dashboard/settings.vue?vue&type=script&setup=true&lang.ts
var settings_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "settings",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Settings - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const branches = ref([]);
		const serviceTypes = ref([]);
		const showBranchModal = ref(false);
		const branchEditingId = ref(null);
		const branchForm = ref({
			name: "",
			address: "",
			phone: "",
			email: "",
			hours: ""
		});
		const savingBranch = ref(false);
		const showServiceModal = ref(false);
		const serviceEditingId = ref(null);
		const serviceForm = ref({
			name: "",
			price: "",
			description: ""
		});
		const savingService = ref(false);
		const roles = [
			{
				value: "admin",
				description: "Full system access"
			},
			{
				value: "manager",
				description: "Content & booking management"
			},
			{
				value: "salesperson",
				description: "Leads & test rides"
			},
			{
				value: "mechanic",
				description: "Service queue & jobs"
			},
			{
				value: "customer",
				description: "Personal dashboard"
			}
		];
		function openBranchModal(b) {
			branchEditingId.value = b?.id || null;
			branchForm.value = b ? {
				name: b.name,
				address: b.address || "",
				phone: b.phone || "",
				email: b.email || "",
				hours: b.hours || ""
			} : {
				name: "",
				address: "",
				phone: "",
				email: "",
				hours: ""
			};
			showBranchModal.value = true;
		}
		async function saveBranch() {
			savingBranch.value = true;
			try {
				const payload = { ...branchForm.value };
				if (!branchEditingId.value) payload.slug = branchForm.value.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
				if (branchEditingId.value) await pb.collection("branches").update(branchEditingId.value, payload);
				else await pb.collection("branches").create(payload);
				showBranchModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				savingBranch.value = false;
			}
		}
		async function deleteBranch(b) {
			if (await confirm(`Delete branch "${b.name}"?`)) pb.collection("branches").delete(b.id).then(() => loadData());
		}
		function openServiceModal(s) {
			serviceEditingId.value = s?.id || null;
			serviceForm.value = s ? {
				name: s.name,
				price: s.price?.toString() || "",
				description: s.description || ""
			} : {
				name: "",
				price: "",
				description: ""
			};
			showServiceModal.value = true;
		}
		async function saveService() {
			savingService.value = true;
			try {
				const payload = {
					...serviceForm.value,
					price: parseFloat(serviceForm.value.price) || 0
				};
				if (serviceEditingId.value) await pb.collection("service_types").update(serviceEditingId.value, payload);
				else await pb.collection("service_types").create(payload);
				showServiceModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				savingService.value = false;
			}
		}
		async function deleteService(s) {
			if (await confirm(`Delete service "${s.name}"?`)) pb.collection("service_types").delete(s.id).then(() => loadData());
		}
		async function loadData() {
			try {
				const [b, st] = await Promise.all([pb.collection("branches").getFullList({ sort: "name" }).catch(() => []), pb.collection("service_types").getFullList({ sort: "name" }).catch(() => [])]);
				branches.value = b;
				serviceTypes.value = st;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Badge = badge_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">System <span class="text-brand-red">Settings</span></h1><p class="mt-1 text-sm text-brand-grey">Manage branches, service types, and roles</p></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-6"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-48 rounded bg-brand-grey/10"></div><div class="h-24 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="space-y-8"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">Branches</h2>`);
				_push(ssrRenderComponent(_component_Button, {
					size: "sm",
					onClick: ($event) => openBranchModal()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Add Branch`);
						else return [createTextVNode("Add Branch")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				if (unref(branches).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No branches configured</p></div>`);
				else {
					_push(`<div class="space-y-2"><!--[-->`);
					ssrRenderList(unref(branches), (b) => {
						_push(`<div class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3"><div><p class="text-sm font-medium text-white">${ssrInterpolate(b.name)}</p>`);
						if (b.location) _push(`<p class="text-xs text-brand-grey">${ssrInterpolate(b.location)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="flex gap-2">`);
						_push(ssrRenderComponent(_component_Button, {
							variant: "ghost",
							size: "sm",
							onClick: ($event) => openBranchModal(b)
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
							onClick: ($event) => deleteBranch(b)
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
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">Service Types</h2>`);
				_push(ssrRenderComponent(_component_Button, {
					size: "sm",
					onClick: ($event) => openServiceModal()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Add Service`);
						else return [createTextVNode("Add Service")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				if (unref(serviceTypes).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No service types configured</p></div>`);
				else {
					_push(`<div class="space-y-2"><!--[-->`);
					ssrRenderList(unref(serviceTypes), (s) => {
						_push(`<div class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3"><div><p class="text-sm font-medium text-white">${ssrInterpolate(s.name)}</p>`);
						if (s.description) _push(`<p class="text-xs text-brand-grey">${ssrInterpolate(s.description)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="flex gap-2">`);
						_push(ssrRenderComponent(_component_Button, {
							variant: "ghost",
							size: "sm",
							onClick: ($event) => openServiceModal(s)
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
							onClick: ($event) => deleteService(s)
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
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><h2 class="font-display text-lg tracking-display text-white">User Roles</h2><div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(roles, (r) => {
					_push(`<div class="rounded-sm border border-brand-grey/10 p-4 text-center">`);
					_push(ssrRenderComponent(_component_Badge, null, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(r.value)}`);
							else return [createTextVNode(toDisplayString(r.value), 1)];
						}),
						_: 2
					}, _parent));
					_push(`<p class="mt-2 text-xs text-brand-grey">${ssrInterpolate(r.description)}</p></div>`);
				});
				_push(`<!--]--></div></div></div>`);
			}
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showBranchModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(branchEditingId) ? "Edit Branch" : "Add Branch")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(branchForm).name,
						"onUpdate:modelValue": ($event) => unref(branchForm).name = $event,
						label: "Branch Name",
						placeholder: "e.g. Nairobi CBD"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(branchForm).address,
						"onUpdate:modelValue": ($event) => unref(branchForm).address = $event,
						label: "Address",
						placeholder: "e.g. Moi Avenue"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(branchForm).phone,
						"onUpdate:modelValue": ($event) => unref(branchForm).phone = $event,
						label: "Phone",
						placeholder: "+254..."
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(branchForm).email,
						"onUpdate:modelValue": ($event) => unref(branchForm).email = $event,
						label: "Email",
						type: "email",
						placeholder: "branch@example.com"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(branchForm).hours,
						"onUpdate:modelValue": ($event) => unref(branchForm).hours = $event,
						label: "Hours",
						placeholder: "e.g. Mon-Sat: 8AM-6PM"
					}, null, _parent));
					_push(`</div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showBranchModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(savingBranch),
						onClick: saveBranch
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(savingBranch) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(savingBranch) ? "Saving..." : "Save"), 1)];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showServiceModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(serviceEditingId) ? "Edit Service" : "Add Service")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(serviceForm).name,
						"onUpdate:modelValue": ($event) => unref(serviceForm).name = $event,
						label: "Service Name",
						placeholder: "e.g. Oil Change"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(serviceForm).price,
						"onUpdate:modelValue": ($event) => unref(serviceForm).price = $event,
						label: "Price (KSh)",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea rows="3" class="input-field w-full resize-none">${ssrInterpolate(unref(serviceForm).description)}</textarea></div></div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showServiceModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(savingService),
						onClick: saveService
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(savingService) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(savingService) ? "Saving..." : "Save"), 1)];
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
//#region app/pages/dashboard/settings.vue
var _sfc_setup = settings_vue_vue_type_script_setup_true_lang_default.setup;
settings_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var settings_default = settings_vue_vue_type_script_setup_true_lang_default;

export { settings_default as default };
//# sourceMappingURL=settings-D98Chtfy.mjs.map
