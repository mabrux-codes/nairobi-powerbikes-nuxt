import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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
import 'pocketbase';
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';

//#region app/pages/dashboard/team-members.vue?vue&type=script&setup=true&lang.ts
var team_members_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "team-members",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Team - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const members = ref([]);
		const showModal = ref(false);
		const editingId = ref(null);
		const form = ref({
			name: "",
			role: "",
			bio: "",
			sort_order: "0"
		});
		function getInitials(name) {
			return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
		}
		function openCreateModal() {
			editingId.value = null;
			form.value = {
				name: "",
				role: "",
				bio: "",
				sort_order: "0"
			};
			showModal.value = true;
		}
		function openEditModal(m) {
			editingId.value = m.id;
			form.value = {
				name: m.name,
				role: m.role || "",
				bio: m.bio || "",
				sort_order: m.sort_order?.toString() || "0"
			};
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveMember() {
			saving.value = true;
			try {
				const payload = {
					...form.value,
					sort_order: parseInt(form.value.sort_order) || 0
				};
				if (editingId.value) await pb.collection("team_members").update(editingId.value, payload);
				else await pb.collection("team_members").create(payload);
				closeModal();
				await loadMembers();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(m) {
			if (await confirm(`Delete "${m.name}"?`)) pb.collection("team_members").delete(m.id).then(() => loadMembers());
		}
		async function loadMembers() {
			try {
				const res = await pb.collection("team_members").getList(1, 50, { sort: "sort_order" });
				members.value = res.items;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Team <span class="text-brand-red">Members</span></h1><p class="mt-1 text-sm text-brand-grey">Manage team for the About page</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreateModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Member`);
					else return [createTextVNode("Add Member")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mx-auto mb-4 h-20 w-20 rounded-full bg-brand-grey/10"></div><div class="mx-auto h-5 w-24 rounded bg-brand-grey/10"></div><div class="mx-auto mt-2 h-4 w-16 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(members).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Users), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Team Members</p><p class="mt-2 text-sm text-brand-grey/60">Add team members to showcase on the About page</p></div>`);
			} else {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(members), (m) => {
					_push(`<div class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 text-center transition-all duration-200 hover:border-brand-red/30"><div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10"><span class="font-display text-2xl tracking-display text-brand-grey/40">${ssrInterpolate(getInitials(m.name))}</span></div><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(m.name)}</h3><p class="text-xs font-display tracking-display text-brand-red uppercase">${ssrInterpolate(m.role)}</p>`);
					if (m.bio) _push(`<p class="mt-2 text-xs text-brand-grey leading-relaxed">${ssrInterpolate(m.bio)}</p>`);
					else _push(`<!---->`);
					_push(`<div class="mt-4 flex justify-center gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openEditModal(m)
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
						onClick: ($event) => confirmDelete(m)
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
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Member" : "Add Member")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name",
						placeholder: "Full name"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).role,
						"onUpdate:modelValue": ($event) => unref(form).role = $event,
						label: "Role / Title",
						placeholder: "e.g. Lead Mechanic"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Bio</label><textarea rows="3" class="input-field w-full resize-none" placeholder="Short biography...">${ssrInterpolate(unref(form).bio)}</textarea></div>`);
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
						onClick: saveMember
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
//#region app/pages/dashboard/team-members.vue
var _sfc_setup = team_members_vue_vue_type_script_setup_true_lang_default.setup;
team_members_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/team-members.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var team_members_default = team_members_vue_vue_type_script_setup_true_lang_default;

export { team_members_default as default };
//# sourceMappingURL=team-members-U5ZV5itg.mjs.map
