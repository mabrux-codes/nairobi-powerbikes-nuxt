import { u as useHead$1 } from '../virtual/entry.mjs';
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
import 'pocketbase';
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';

//#region app/pages/dashboard/content.vue?vue&type=script&setup=true&lang.ts
var content_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "content",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Content - Manager - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const milestones = ref([]);
		const stats = ref([]);
		const team = ref([]);
		const showMilestoneModal = ref(false);
		const editingMilestoneId = ref(null);
		const savingMilestone = ref(false);
		const milestoneForm = ref({
			year: "",
			title: "",
			description: "",
			display_order: "0"
		});
		const showStatModal = ref(false);
		const editingStatId = ref(null);
		const savingStat = ref(false);
		const statForm = ref({
			label: "",
			value: "",
			suffix: "",
			sort_order: "0"
		});
		const showTeamModal = ref(false);
		const editingTeamId = ref(null);
		const savingTeam = ref(false);
		const teamForm = ref({
			name: "",
			role: "",
			bio: "",
			sort_order: "0"
		});
		function getInitials(name) {
			return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
		}
		function openMilestoneModal(ms) {
			editingMilestoneId.value = ms?.id || null;
			milestoneForm.value = ms ? {
				year: ms.year,
				title: ms.title,
				description: ms.description || "",
				display_order: ms.display_order?.toString() || "0"
			} : {
				year: "",
				title: "",
				description: "",
				display_order: "0"
			};
			showMilestoneModal.value = true;
		}
		async function saveMilestone() {
			savingMilestone.value = true;
			try {
				const p = {
					...milestoneForm.value,
					display_order: parseInt(milestoneForm.value.display_order) || 0
				};
				if (editingMilestoneId.value) await pb.collection("timeline_milestones").update(editingMilestoneId.value, p);
				else await pb.collection("timeline_milestones").create(p);
				showMilestoneModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				savingMilestone.value = false;
			}
		}
		async function deleteMilestone(ms) {
			if (await confirm("Delete this milestone?")) pb.collection("timeline_milestones").delete(ms.id).then(() => loadData());
		}
		function openStatModal(s) {
			editingStatId.value = s?.id || null;
			statForm.value = s ? {
				label: s.label,
				value: s.value?.toString() || "",
				suffix: s.suffix || "",
				sort_order: s.sort_order?.toString() || "0"
			} : {
				label: "",
				value: "",
				suffix: "",
				sort_order: "0"
			};
			showStatModal.value = true;
		}
		async function saveStat() {
			savingStat.value = true;
			try {
				const p = {
					...statForm.value,
					value: parseInt(statForm.value.value) || 0,
					sort_order: parseInt(statForm.value.sort_order) || 0
				};
				if (editingStatId.value) await pb.collection("company_stats").update(editingStatId.value, p);
				else await pb.collection("company_stats").create(p);
				showStatModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				savingStat.value = false;
			}
		}
		async function deleteStat(s) {
			if (await confirm("Delete this stat?")) pb.collection("company_stats").delete(s.id).then(() => loadData());
		}
		function openTeamModal(m) {
			editingTeamId.value = m?.id || null;
			teamForm.value = m ? {
				name: m.name,
				role: m.role || "",
				bio: m.bio || "",
				sort_order: m.sort_order?.toString() || "0"
			} : {
				name: "",
				role: "",
				bio: "",
				sort_order: "0"
			};
			showTeamModal.value = true;
		}
		async function saveTeamMember() {
			savingTeam.value = true;
			try {
				const p = {
					...teamForm.value,
					sort_order: parseInt(teamForm.value.sort_order) || 0
				};
				if (editingTeamId.value) await pb.collection("team_members").update(editingTeamId.value, p);
				else await pb.collection("team_members").create(p);
				showTeamModal.value = false;
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				savingTeam.value = false;
			}
		}
		async function deleteTeamMember(m) {
			if (await confirm(`Delete "${m.name}"?`)) pb.collection("team_members").delete(m.id).then(() => loadData());
		}
		async function loadData() {
			try {
				const [m, s, t] = await Promise.all([
					pb.collection("timeline_milestones").getFullList({ sort: "display_order" }).catch(() => []),
					pb.collection("company_stats").getList(1, 10, { sort: "sort_order" }).catch(() => ({ items: [] })),
					pb.collection("team_members").getFullList({ sort: "sort_order" }).catch(() => [])
				]);
				milestones.value = m;
				stats.value = s.items || [];
				team.value = t;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Content <span class="text-brand-red">Management</span></h1><p class="mt-1 text-sm text-brand-grey">Manage About page content, milestones, and company stats</p></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-6"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-48 rounded bg-brand-grey/10"></div><div class="h-24 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="space-y-8"><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">Company Milestones</h2>`);
				_push(ssrRenderComponent(_component_Button, {
					size: "sm",
					onClick: ($event) => openMilestoneModal()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Add Milestone`);
						else return [createTextVNode("Add Milestone")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				if (unref(milestones).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No milestones yet</p></div>`);
				else {
					_push(`<div class="space-y-2"><!--[-->`);
					ssrRenderList(unref(milestones), (ms) => {
						_push(`<div class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3"><div><p class="text-sm font-medium text-white"><span class="text-brand-red">${ssrInterpolate(ms.year)}</span> — ${ssrInterpolate(ms.title)}</p><p class="text-xs text-brand-grey">${ssrInterpolate(ms.description)}</p></div><div class="flex gap-2">`);
						_push(ssrRenderComponent(_component_Button, {
							variant: "ghost",
							size: "sm",
							onClick: ($event) => openMilestoneModal(ms)
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
							onClick: ($event) => deleteMilestone(ms)
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
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">Company Stats</h2>`);
				_push(ssrRenderComponent(_component_Button, {
					size: "sm",
					onClick: ($event) => openStatModal()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Add Stat`);
						else return [createTextVNode("Add Stat")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				if (unref(stats).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No stats yet</p></div>`);
				else {
					_push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
					ssrRenderList(unref(stats), (s) => {
						_push(`<div class="rounded-sm border border-brand-grey/10 p-4 text-center"><p class="font-heading text-4xl text-white">${ssrInterpolate(s.value)}${ssrInterpolate(s.suffix || "")}</p><p class="text-xs font-display tracking-display text-brand-grey uppercase">${ssrInterpolate(s.label)}</p><div class="mt-2 flex justify-center gap-2">`);
						_push(ssrRenderComponent(_component_Button, {
							variant: "ghost",
							size: "sm",
							onClick: ($event) => openStatModal(s)
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
							onClick: ($event) => deleteStat(s)
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
				_push(`</div><div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-lg tracking-display text-white">Team Members (About Page)</h2>`);
				_push(ssrRenderComponent(_component_Button, {
					size: "sm",
					onClick: ($event) => openTeamModal()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Add Member`);
						else return [createTextVNode("Add Member")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				if (unref(team).length === 0) _push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No team members</p></div>`);
				else {
					_push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
					ssrRenderList(unref(team), (m) => {
						_push(`<div class="rounded-sm border border-brand-grey/10 p-4 text-center"><div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-grey/20 text-xs font-bold text-brand-light">${ssrInterpolate(getInitials(m.name))}</div><p class="font-display text-white">${ssrInterpolate(m.name)}</p><p class="text-xs text-brand-red font-display tracking-display">${ssrInterpolate(m.role)}</p><div class="mt-2 flex justify-center gap-2">`);
						_push(ssrRenderComponent(_component_Button, {
							variant: "ghost",
							size: "sm",
							onClick: ($event) => openTeamModal(m)
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
							onClick: ($event) => deleteTeamMember(m)
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
				_push(`</div></div>`);
			}
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showMilestoneModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingMilestoneId) ? "Edit Milestone" : "Add Milestone")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(milestoneForm).year,
						"onUpdate:modelValue": ($event) => unref(milestoneForm).year = $event,
						label: "Year",
						placeholder: "e.g. 2025"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(milestoneForm).title,
						"onUpdate:modelValue": ($event) => unref(milestoneForm).title = $event,
						label: "Title",
						placeholder: "Milestone title"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea rows="3" class="input-field w-full resize-none">${ssrInterpolate(unref(milestoneForm).description)}</textarea></div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(milestoneForm).display_order,
						"onUpdate:modelValue": ($event) => unref(milestoneForm).display_order = $event,
						label: "Display Order",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(`</div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showMilestoneModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(savingMilestone),
						onClick: saveMilestone
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(savingMilestone) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(savingMilestone) ? "Saving..." : "Save"), 1)];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showStatModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingStatId) ? "Edit Stat" : "Add Stat")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(statForm).label,
						"onUpdate:modelValue": ($event) => unref(statForm).label = $event,
						label: "Label",
						placeholder: "e.g. Bikes Sold"
					}, null, _parent));
					_push(`<div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(statForm).value,
						"onUpdate:modelValue": ($event) => unref(statForm).value = $event,
						label: "Value",
						type: "number",
						placeholder: "5000"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(statForm).suffix,
						"onUpdate:modelValue": ($event) => unref(statForm).suffix = $event,
						label: "Suffix",
						placeholder: "e.g. +"
					}, null, _parent));
					_push(`</div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(statForm).sort_order,
						"onUpdate:modelValue": ($event) => unref(statForm).sort_order = $event,
						label: "Sort Order",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(`</div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showStatModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(savingStat),
						onClick: saveStat
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(savingStat) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(savingStat) ? "Saving..." : "Save"), 1)];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showTeamModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingTeamId) ? "Edit Team Member" : "Add Team Member")}</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(teamForm).name,
						"onUpdate:modelValue": ($event) => unref(teamForm).name = $event,
						label: "Name",
						placeholder: "Full name"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(teamForm).role,
						"onUpdate:modelValue": ($event) => unref(teamForm).role = $event,
						label: "Role / Title",
						placeholder: "e.g. Lead Mechanic"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Bio</label><textarea rows="3" class="input-field w-full resize-none">${ssrInterpolate(unref(teamForm).bio)}</textarea></div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(teamForm).sort_order,
						"onUpdate:modelValue": ($event) => unref(teamForm).sort_order = $event,
						label: "Sort Order",
						type: "number",
						placeholder: "0"
					}, null, _parent));
					_push(`</div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showTeamModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(savingTeam),
						onClick: saveTeamMember
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(savingTeam) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(savingTeam) ? "Saving..." : "Save"), 1)];
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
//#region app/pages/dashboard/content.vue
var _sfc_setup = content_vue_vue_type_script_setup_true_lang_default.setup;
content_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/content.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var content_default = content_vue_vue_type_script_setup_true_lang_default;

export { content_default as default };
//# sourceMappingURL=content-5D9RIapA.mjs.map
