import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { MessageSquare } from 'lucide-vue-next';
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

//#region app/pages/dashboard/contacts.vue?vue&type=script&setup=true&lang.ts
var contacts_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "contacts",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Contacts - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const items = ref([]);
		const showModal = ref(false);
		const editingItem = ref(null);
		const updateForm = ref({ status: "new" });
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "N/A";
		}
		function openDetail(c) {
			editingItem.value = c;
			updateForm.value = { status: c.status || "new" };
			showModal.value = true;
		}
		async function saveUpdate() {
			saving.value = true;
			try {
				await pb.collection("contacts").update(editingItem.value.id, updateForm.value);
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
				const res = await pb.collection("contacts").getList(1, 100, { sort: "-created" });
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6"><h1 class="font-heading text-4xl text-white">Contact <span class="text-brand-red">Submissions</span></h1><p class="mt-1 text-sm text-brand-grey">Manage contact form and finance inquiries</p></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(MessageSquare), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Submissions</p></div>`);
			} else {
				_push(`<div class="overflow-x-auto rounded-sm border border-brand-grey/20"><table class="w-full text-left text-sm"><thead class="border-b border-brand-grey/20 bg-brand-black/80"><tr><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Name</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Subject</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Category</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Date</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Status</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th></tr></thead><tbody class="divide-y divide-brand-grey/10"><!--[-->`);
				ssrRenderList(unref(items), (c) => {
					_push(`<tr class="transition-colors hover:bg-white/5"><td class="px-4 py-3 text-white">${ssrInterpolate(c.name)}</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(c.email)}</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(c.subject || "-")}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, null, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(c.category)}`);
							else return [createTextVNode(toDisplayString(c.category), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(formatDate(c.created))}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, { variant: c.status === "new" ? "warning" : c.status === "contacted" ? "secondary" : "success" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(c.status)}`);
							else return [createTextVNode(toDisplayString(c.status), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-right">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => openDetail(c)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`View`);
							else return [createTextVNode("View")];
						}),
						_: 2
					}, _parent));
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingItem)?.subject || "Message")}</h2><p class="mt-1 text-sm text-brand-grey">${ssrInterpolate(unref(editingItem)?.name)} &lt;${ssrInterpolate(unref(editingItem)?.email)}&gt;</p><div class="mt-4 rounded-sm bg-brand-grey/5 p-4"><p class="text-sm text-white whitespace-pre-wrap">${ssrInterpolate(unref(editingItem)?.message)}</p></div><div class="mt-4"><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label><select class="input-field w-full"><option value="new"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "new") : ssrLooseEqual(unref(updateForm).status, "new")) ? " selected" : ""}>New</option><option value="contacted"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "contacted") : ssrLooseEqual(unref(updateForm).status, "contacted")) ? " selected" : ""}>Contacted</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(unref(updateForm).status) ? ssrLooseContain(unref(updateForm).status, "resolved") : ssrLooseEqual(unref(updateForm).status, "resolved")) ? " selected" : ""}>Resolved</option></select></div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: ($event) => showModal.value = false
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Close`);
							else return [createTextVNode("Close")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(saving),
						onClick: saveUpdate
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(saving) ? "Saving..." : "Update Status")}`);
							else return [createTextVNode(toDisplayString(unref(saving) ? "Saving..." : "Update Status"), 1)];
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
//#region app/pages/dashboard/contacts.vue
var _sfc_setup = contacts_vue_vue_type_script_setup_true_lang_default.setup;
contacts_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/contacts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var contacts_default = contacts_vue_vue_type_script_setup_true_lang_default;

export { contacts_default as default };
//# sourceMappingURL=contacts-0V5ED04u.mjs.map
