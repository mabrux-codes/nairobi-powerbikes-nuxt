import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, isRef, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { Users } from 'lucide-vue-next';
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

//#region app/pages/dashboard/staff.vue?vue&type=script&setup=true&lang.ts
var staff_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "staff",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Staff Management - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const staff = ref([]);
		const branches = ref([]);
		const searchQuery = ref("");
		const roleFilter = ref("");
		const statusFilter = ref("");
		const showModal = ref(false);
		const editingId = ref(null);
		const form = ref({
			name: "",
			email: "",
			role: "salesperson",
			branch: "",
			availability: "online",
			password: ""
		});
		function getInitials(name) {
			return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
		}
		const filteredStaff = computed(() => {
			return staff.value.filter((s) => {
				if (searchQuery.value && !`${s.name} ${s.email}`.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
				if (roleFilter.value && s.role !== roleFilter.value) return false;
				if (statusFilter.value && s.status !== statusFilter.value) return false;
				return true;
			});
		});
		function openCreateModal() {
			editingId.value = null;
			form.value = {
				name: "",
				email: "",
				role: "salesperson",
				branch: "",
				availability: "online",
				password: ""
			};
			showModal.value = true;
		}
		function openEditModal(s) {
			editingId.value = s.id;
			form.value = {
				name: s.name || "",
				email: s.email,
				role: s.role,
				branch: s.branch || "",
				availability: s.availability || "online",
				password: ""
			};
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveStaff() {
			saving.value = true;
			try {
				if (editingId.value) {
					const payload = {
						name: form.value.name,
						email: form.value.email,
						role: form.value.role,
						branch: form.value.branch,
						availability: form.value.availability
					};
					await pb.collection("users").update(editingId.value, payload);
				} else {
					const { password, ...rest } = form.value;
					await pb.collection("users").create({
						...rest,
						status: "active",
						emailVisibility: true,
						password,
						passwordConfirm: password
					});
				}
				closeModal();
				await loadStaff();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function toggleStatus(s) {
			const newStatus = s.status === "active" ? "inactive" : "active";
			try {
				await pb.collection("users").update(s.id, { status: newStatus });
				s.status = newStatus;
			} catch (e) {
				console.error("Status toggle failed:", e?.data?.message || e?.message || e);
			}
		}
		async function loadStaff() {
			try {
				const res = await pb.collection("users").getList(1, 100, { filter: "role != \"customer\"" });
				staff.value = res.items;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Staff <span class="text-brand-red">Management</span></h1><p class="mt-1 text-sm text-brand-grey">Manage your team members</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreateModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Staff`);
					else return [createTextVNode("Add Staff")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mb-4 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_Input, {
				modelValue: unref(searchQuery),
				"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
				placeholder: "Search staff...",
				class: "w-64"
			}, null, _parent));
			_push(`<select class="input-field w-40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "") : ssrLooseEqual(unref(roleFilter), "")) ? " selected" : ""}>All Roles</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "admin") : ssrLooseEqual(unref(roleFilter), "admin")) ? " selected" : ""}>Admin</option><option value="manager"${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "manager") : ssrLooseEqual(unref(roleFilter), "manager")) ? " selected" : ""}>Manager</option><option value="salesperson"${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "salesperson") : ssrLooseEqual(unref(roleFilter), "salesperson")) ? " selected" : ""}>Salesperson</option><option value="mechanic"${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "mechanic") : ssrLooseEqual(unref(roleFilter), "mechanic")) ? " selected" : ""}>Mechanic</option></select><select class="input-field w-40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "active") : ssrLooseEqual(unref(statusFilter), "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "inactive") : ssrLooseEqual(unref(statusFilter), "inactive")) ? " selected" : ""}>Inactive</option></select></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-48 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-32 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filteredStaff).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Users), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Staff Found</p><p class="mt-2 text-sm text-brand-grey/60">Add your first team member to get started</p></div>`);
			} else {
				_push(`<div class="overflow-x-auto rounded-sm border border-brand-grey/20"><table class="w-full text-left text-sm"><thead class="border-b border-brand-grey/20 bg-brand-black/80"><tr><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Name</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Role</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Branch</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Availability</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Status</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th></tr></thead><tbody class="divide-y divide-brand-grey/10"><!--[-->`);
				ssrRenderList(unref(filteredStaff), (s) => {
					_push(`<tr class="transition-colors hover:bg-white/5"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grey/20 text-xs font-bold text-brand-light">${ssrInterpolate(getInitials(s.name || s.email))}</div><span class="font-medium text-white">${ssrInterpolate(s.name || "Unnamed")}</span></div></td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(s.email)}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, null, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(s.role)}`);
							else return [createTextVNode(toDisplayString(s.role), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(s.branch || "N/A")}</td><td class="px-4 py-3"><span class="flex items-center gap-1.5 text-sm"><span class="${ssrRenderClass([s.availability === "online" ? "bg-emerald-400" : s.availability === "busy" ? "bg-amber-400" : "bg-brand-grey/40", "inline-block h-2 w-2 rounded-full"])}"></span> ${ssrInterpolate(s.availability || "offline")}</span></td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, { variant: s.status === "active" ? "success" : "danger" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(s.status)}`);
							else return [createTextVNode(toDisplayString(s.status), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-right"><div class="flex items-center justify-end gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openEditModal(s)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Edit`);
							else return [createTextVNode("Edit")];
						}),
						_: 2
					}, _parent));
					if (s.status === "active") _push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						onClick: ($event) => toggleStatus(s)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Deactivate`);
							else return [createTextVNode("Deactivate")];
						}),
						_: 2
					}, _parent));
					else _push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						onClick: ($event) => toggleStatus(s)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Activate`);
							else return [createTextVNode("Activate")];
						}),
						_: 2
					}, _parent));
					_push(`</div></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Staff" : "Add Staff")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name",
						placeholder: "Full name"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).email,
						"onUpdate:modelValue": ($event) => unref(form).email = $event,
						label: "Email",
						type: "email",
						placeholder: "email@example.com"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Role</label><select class="input-field w-full"><option value="manager"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "manager") : ssrLooseEqual(unref(form).role, "manager")) ? " selected" : ""}>Manager</option><option value="salesperson"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "salesperson") : ssrLooseEqual(unref(form).role, "salesperson")) ? " selected" : ""}>Salesperson</option><option value="mechanic"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "mechanic") : ssrLooseEqual(unref(form).role, "mechanic")) ? " selected" : ""}>Mechanic</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "admin") : ssrLooseEqual(unref(form).role, "admin")) ? " selected" : ""}>Admin</option></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Branch</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch) ? ssrLooseContain(unref(form).branch, "") : ssrLooseEqual(unref(form).branch, "")) ? " selected" : ""}>Select branch</option><!--[-->`);
					ssrRenderList(unref(branches), (b) => {
						_push(`<option${ssrRenderAttr("value", b.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch) ? ssrLooseContain(unref(form).branch, b.name) : ssrLooseEqual(unref(form).branch, b.name)) ? " selected" : ""}>${ssrInterpolate(b.name)}</option>`);
					});
					_push(`<!--]--></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Availability</label><select class="input-field w-full"><option value="online"${ssrIncludeBooleanAttr(Array.isArray(unref(form).availability) ? ssrLooseContain(unref(form).availability, "online") : ssrLooseEqual(unref(form).availability, "online")) ? " selected" : ""}>Online</option><option value="busy"${ssrIncludeBooleanAttr(Array.isArray(unref(form).availability) ? ssrLooseContain(unref(form).availability, "busy") : ssrLooseEqual(unref(form).availability, "busy")) ? " selected" : ""}>Busy</option><option value="offline"${ssrIncludeBooleanAttr(Array.isArray(unref(form).availability) ? ssrLooseContain(unref(form).availability, "offline") : ssrLooseEqual(unref(form).availability, "offline")) ? " selected" : ""}>Offline</option></select></div>`);
					if (!unref(editingId)) _push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).password,
						"onUpdate:modelValue": ($event) => unref(form).password = $event,
						label: "Password",
						type: "password",
						placeholder: "Set password"
					}, null, _parent));
					else _push(`<!---->`);
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
						onClick: saveStaff
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
//#region app/pages/dashboard/staff.vue
var _sfc_setup = staff_vue_vue_type_script_setup_true_lang_default.setup;
staff_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/staff.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var staff_default = staff_vue_vue_type_script_setup_true_lang_default;

export { staff_default as default };
//# sourceMappingURL=staff-Cf4HrukN.mjs.map
