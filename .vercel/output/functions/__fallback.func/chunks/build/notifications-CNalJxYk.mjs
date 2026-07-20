import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { Bell } from 'lucide-vue-next';
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

//#region app/pages/dashboard/notifications.vue?vue&type=script&setup=true&lang.ts
var notifications_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "notifications",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Notifications - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const sending = ref(false);
		const items = ref([]);
		const users = ref([]);
		const showModal = ref(false);
		const notifForm = ref({
			title: "",
			type: "system",
			user: "",
			message: "",
			link: ""
		});
		function formatDate(d) {
			return d ? new Date(d).toLocaleString() : "";
		}
		function openSendModal() {
			notifForm.value = {
				title: "",
				type: "system",
				user: "",
				message: "",
				link: ""
			};
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function sendNotification() {
			sending.value = true;
			try {
				if (notifForm.value.user) await pb.collection("notifications").create({
					user: notifForm.value.user,
					title: notifForm.value.title,
					type: notifForm.value.type,
					message: notifForm.value.message,
					link: notifForm.value.link,
					read: false
				});
				else for (const u of users.value) await pb.collection("notifications").create({
					user: u.id,
					title: notifForm.value.title,
					type: notifForm.value.type,
					message: notifForm.value.message,
					link: notifForm.value.link,
					read: false
				});
				closeModal();
				await loadData();
			} catch (e) {
				console.error(e);
			} finally {
				sending.value = false;
			}
		}
		async function loadData() {
			try {
				const [notifRes, userRes] = await Promise.all([pb.collection("notifications").getList(1, 100, {
					sort: "-created",
					expand: "user"
				}).catch(() => ({ items: [] })), pb.collection("users").getFullList({ sort: "name" }).catch(() => [])]);
				items.value = notifRes.items;
				users.value = userRes;
			} catch (e) {
				console.error(e);
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Badge = badge_default;
			const _component_Input = input_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl" }, _attrs))}><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Notifications</h1><p class="mt-1 text-sm text-brand-grey">Manage system notifications</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openSendModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Send Notification`);
					else return [createTextVNode("Send Notification")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(items).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Bell), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Notifications</p></div>`);
			} else {
				_push(`<div class="overflow-x-auto rounded-sm border border-brand-grey/20"><table class="w-full text-left text-sm"><thead class="border-b border-brand-grey/20 bg-brand-black/80"><tr><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Title</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Type</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">User</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Date</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Read</th><th class="px-4 py-3"></th></tr></thead><tbody class="divide-y divide-brand-grey/10"><!--[-->`);
				ssrRenderList(unref(items), (n) => {
					_push(`<tr class="transition-colors hover:bg-white/5"><td class="px-4 py-3 text-white">${ssrInterpolate(n.title)}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, { size: "sm" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(n.type)}`);
							else return [createTextVNode(toDisplayString(n.type), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(n.expand?.user?.name || n.expand?.user?.email || "All Users")}</td><td class="px-4 py-3 text-brand-grey">${ssrInterpolate(formatDate(n.created))}</td><td class="px-4 py-3">`);
					_push(ssrRenderComponent(_component_Badge, { variant: n.read ? "success" : "warning" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(n.read ? "Read" : "New")}`);
							else return [createTextVNode(toDisplayString(n.read ? "Read" : "New"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</td><td class="px-4 py-3"><button class="text-xs text-brand-red hover:underline">Delete</button></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">Send Notification</h2><div class="mt-4 space-y-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(notifForm).title,
						"onUpdate:modelValue": ($event) => unref(notifForm).title = $event,
						label: "Title",
						placeholder: "e.g. Service Reminder"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label><select class="input-field w-full"><option value="system"${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).type) ? ssrLooseContain(unref(notifForm).type, "system") : ssrLooseEqual(unref(notifForm).type, "system")) ? " selected" : ""}>System</option><option value="booking"${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).type) ? ssrLooseContain(unref(notifForm).type, "booking") : ssrLooseEqual(unref(notifForm).type, "booking")) ? " selected" : ""}>Booking</option><option value="service"${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).type) ? ssrLooseContain(unref(notifForm).type, "service") : ssrLooseEqual(unref(notifForm).type, "service")) ? " selected" : ""}>Service</option><option value="offer"${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).type) ? ssrLooseContain(unref(notifForm).type, "offer") : ssrLooseEqual(unref(notifForm).type, "offer")) ? " selected" : ""}>Offer</option><option value="message"${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).type) ? ssrLooseContain(unref(notifForm).type, "message") : ssrLooseEqual(unref(notifForm).type, "message")) ? " selected" : ""}>Message</option></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Target User</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).user) ? ssrLooseContain(unref(notifForm).user, "") : ssrLooseEqual(unref(notifForm).user, "")) ? " selected" : ""}>All Users (broadcast)</option><!--[-->`);
					ssrRenderList(unref(users), (u) => {
						_push(`<option${ssrRenderAttr("value", u.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(notifForm).user) ? ssrLooseContain(unref(notifForm).user, u.id) : ssrLooseEqual(unref(notifForm).user, u.id)) ? " selected" : ""}>${ssrInterpolate(u.name || u.email)}</option>`);
					});
					_push(`<!--]--></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Message</label><textarea rows="4" class="input-field w-full resize-none" placeholder="Notification message...">${ssrInterpolate(unref(notifForm).message)}</textarea></div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(notifForm).link,
						"onUpdate:modelValue": ($event) => unref(notifForm).link = $event,
						label: "Link (optional)",
						placeholder: "/dashboard/bookings"
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
						disabled: unref(sending),
						onClick: sendNotification
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(sending) ? "Sending..." : "Send")}`);
							else return [createTextVNode(toDisplayString(unref(sending) ? "Sending..." : "Send"), 1)];
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
//#region app/pages/dashboard/notifications.vue
var _sfc_setup = notifications_vue_vue_type_script_setup_true_lang_default.setup;
notifications_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/notifications.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var notifications_default = notifications_vue_vue_type_script_setup_true_lang_default;

export { notifications_default as default };
//# sourceMappingURL=notifications-CNalJxYk.mjs.map
