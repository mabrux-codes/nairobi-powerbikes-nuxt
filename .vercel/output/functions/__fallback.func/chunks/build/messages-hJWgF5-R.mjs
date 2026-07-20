import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, computed, isRef, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/dashboard/messages.vue?vue&type=script&setup=true&lang.ts
var messages_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "messages",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Messages - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const messages = ref([]);
		const searchQuery = ref("");
		const readFilter = ref("");
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString() : "N/A";
		}
		const filtered = computed(() => {
			return messages.value.filter((m) => {
				const q = searchQuery.value.toLowerCase();
				if (q && !`${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q)) return false;
				if (readFilter.value === "true" && !m.read) return false;
				if (readFilter.value === "false" && m.read) return false;
				return true;
			});
		});
		async function markRead(msg) {
			await pb.collection("contacts").update(msg.id, { read: true });
			msg.read = true;
		}
		async function confirmDelete(msg) {
			if (await confirm("Delete this message?")) pb.collection("contacts").delete(msg.id).then(() => loadMessages());
		}
		async function loadMessages() {
			try {
				const res = await pb.collection("contacts").getList(1, 100, { sort: "-created" });
				messages.value = res.items;
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Input = input_default;
			const _component_Badge = badge_default;
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Contact <span class="text-brand-red">Messages</span></h1><p class="mt-1 text-sm text-brand-grey">All messages from the contact form</p></div><div class="mb-4 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_Input, {
				modelValue: unref(searchQuery),
				"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
				placeholder: "Search messages...",
				class: "w-64"
			}, null, _parent));
			_push(`<select class="input-field w-40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(readFilter)) ? ssrLooseContain(unref(readFilter), "") : ssrLooseEqual(unref(readFilter), "")) ? " selected" : ""}>All</option><option value="true"${ssrIncludeBooleanAttr(Array.isArray(unref(readFilter)) ? ssrLooseContain(unref(readFilter), "true") : ssrLooseEqual(unref(readFilter), "true")) ? " selected" : ""}>Read</option><option value="false"${ssrIncludeBooleanAttr(Array.isArray(unref(readFilter)) ? ssrLooseContain(unref(readFilter), "false") : ssrLooseEqual(unref(readFilter), "false")) ? " selected" : ""}>Unread</option></select></div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filtered).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(MessageSquare), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Messages</p><p class="mt-2 text-sm text-brand-grey/60">No contact messages received yet</p></div>`);
			} else {
				_push(`<div class="space-y-4"><!--[-->`);
				ssrRenderList(unref(filtered), (msg) => {
					_push(`<div class="${ssrRenderClass([msg.read ? "opacity-70" : "border-l-2 border-l-brand-red", "rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all duration-200 hover:border-brand-red/30"])}"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="font-display text-lg tracking-display text-white">${ssrInterpolate(msg.name || "Anonymous")}</h3><p class="text-xs text-brand-grey">${ssrInterpolate(msg.email)} `);
					if (msg.phone) _push(`<span>· ${ssrInterpolate(msg.phone)}</span>`);
					else _push(`<!---->`);
					_push(`</p></div><div class="flex items-center gap-2">`);
					_push(ssrRenderComponent(_component_Badge, { variant: msg.read ? "outline" : "default" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(msg.read ? "Read" : "New")}`);
							else return [createTextVNode(toDisplayString(msg.read ? "Read" : "New"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`<span class="text-xs text-brand-grey">${ssrInterpolate(formatDate(msg.created))}</span></div></div><p class="mt-3 text-sm text-brand-grey/80 leading-relaxed">${ssrInterpolate(msg.message || msg.body || "No content")}</p><div class="mt-3 flex items-center gap-3">`);
					if (!msg.read) _push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						onClick: ($event) => markRead(msg)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Mark Read`);
							else return [createTextVNode("Mark Read")];
						}),
						_: 2
					}, _parent));
					else _push(`<!---->`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						onClick: ($event) => confirmDelete(msg)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Delete`);
							else return [createTextVNode("Delete")];
						}),
						_: 2
					}, _parent));
					if (msg.email) _push(`<a${ssrRenderAttr("href", `mailto:${msg.email}`)} class="text-xs text-brand-red hover:underline">Reply via Email</a>`);
					else _push(`<!---->`);
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/messages.vue
var _sfc_setup = messages_vue_vue_type_script_setup_true_lang_default.setup;
messages_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/messages.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var messages_default = messages_vue_vue_type_script_setup_true_lang_default;

export { messages_default as default };
//# sourceMappingURL=messages-hJWgF5-R.mjs.map
