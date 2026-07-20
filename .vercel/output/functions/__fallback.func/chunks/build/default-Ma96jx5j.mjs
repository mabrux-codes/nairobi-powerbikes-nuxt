import { _ as _plugin_vue_export_helper_default, b as useRoute$1, N as NuxtLink, C as ClientOnly, n as navigateTo } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { _ as _virtual_public__2FNPB_20Logo_default } from './_virtual_public-BZ2lbPvU.mjs';
import { m as motion, p as provideAnimatePresence, u as useMotionConfig, a as mountedStates, b as motionGlobalConfig } from './motion-iPcKg62k.mjs';
import { defineComponent, mergeProps, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, isRef, openBlock, createBlock, Fragment, renderList, createCommentVNode, computed, resolveDynamicComponent, Transition, TransitionGroup, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { frame } from 'framer-motion/dom';
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
import '@vueuse/core';
import 'motion-dom';
import 'hey-listen';
import 'motion-utils';

//#region node_modules/motion-v/dist/es/components/animate-presence/use-pop-layout.mjs
var popId = 0;
function usePopLayout(props) {
	const styles = /* @__PURE__ */ new WeakMap();
	const config = useMotionConfig();
	function addPopStyle(element) {
		if (props.mode !== "popLayout") return;
		const parent = element.offsetParent;
		const parentWidth = parent instanceof HTMLElement ? parent.offsetWidth || 0 : 0;
		const size = {
			height: element.offsetHeight || 0,
			width: element.offsetWidth || 0,
			top: element.offsetTop,
			left: element.offsetLeft,
			right: 0
		};
		size.right = parentWidth - size.width - size.left;
		const x = props.anchorX === "left" ? `left: ${size.left}px` : `right: ${size.right}px`;
		const elementPopId = `pop-${popId++}`;
		element.dataset.motionPopId = elementPopId;
		const style = (void 0).createElement("style");
		if (config.value.nonce) style.nonce = config.value.nonce;
		styles.set(element, style);
		(void 0).head.appendChild(style);
		if (style.sheet) style.sheet.insertRule(`
    [data-motion-pop-id="${elementPopId}"] {
      position: absolute !important;
      width: ${size.width}px !important;
      height: ${size.height}px !important;
      top: ${size.top}px !important;
      ${x} !important;
      }
      `);
	}
	function removePopStyle(element) {
		const style = styles.get(element);
		if (!style) return;
		styles.delete(element);
		frame.render(() => {
			(void 0).head.removeChild(style);
		});
	}
	return {
		addPopStyle,
		removePopStyle
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/components/animate-presence/use-presence-container.mjs
var apId = 0;
function usePresenceContainer(props) {
	const presenceId = String(apId++);
	const exitSessions = /* @__PURE__ */ new Map();
	const { addPopStyle, removePopStyle } = usePopLayout(props);
	function findMotionStates(container) {
		const states = [];
		const selfState = mountedStates.get(container);
		if (selfState && container.getAttribute(motionGlobalConfig.motionAttribute) === presenceId) states.push(selfState);
		const elements = Array.from(container.querySelectorAll(`[${motionGlobalConfig.motionAttribute}="${presenceId}"]`));
		for (const el of elements) {
			const s = mountedStates.get(el);
			if (s) states.push(s);
		}
		return states;
	}
	function onMotionExitComplete(container, state) {
		const session = exitSessions.get(container);
		if (!session) return;
		session.remaining.delete(state);
		if (session.remaining.size === 0) finalizeExit(session);
	}
	const presenceContext = {
		initial: props.initial,
		custom: props.custom,
		presenceId,
		onMotionExitComplete
	};
	provideAnimatePresence(presenceContext);
	function finalizeExit(session) {
		removePopStyle(session.el);
		session.states.forEach((state) => {
			state.getSnapshot(state.options, false);
		});
		session.done();
		exitSessions.delete(session.el);
		if (!session.el?.isConnected) session.states.forEach((state) => {
			state.unmount();
		});
		else session.states[0]?.didUpdate();
		props.onExitComplete?.();
	}
	function enter(el, done) {
		findMotionStates(el).forEach((state) => {
			state.setActive("exit", false);
			state.getSnapshot(state.options, true);
		});
		done();
	}
	function exit(el, done) {
		presenceContext.custom = props.custom;
		const container = el;
		const states = findMotionStates(container);
		if (states.length === 0) {
			done();
			props.onExitComplete?.();
			return;
		}
		const session = {
			remaining: new Set(states),
			states,
			done,
			el: container
		};
		exitSessions.set(container, session);
		addPopStyle(container);
		states.forEach((state) => {
			state.presenceContainer = container;
			state.setActive("exit", true);
			state.getSnapshot(state.options, false);
		});
		states[0]?.didUpdate();
	}
	return {
		enter,
		exit
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/components/animate-presence/AnimatePresence.mjs
var AnimatePresence_default = /* @__PURE__ */ defineComponent({
	name: "AnimatePresence",
	inheritAttrs: true,
	__name: "AnimatePresence",
	props: {
		mode: { default: "sync" },
		initial: {
			type: Boolean,
			default: true
		},
		as: {},
		custom: {},
		onExitComplete: {},
		anchorX: { default: "left" }
	},
	setup(__props) {
		const props = __props;
		const { enter, exit } = usePresenceContainer(props);
		const transitionProps = computed(() => {
			if (props.mode !== "wait") return { tag: props.as };
			return { mode: props.mode === "wait" ? "out-in" : void 0 };
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(_ctx.mode === "wait" ? Transition : TransitionGroup), mergeProps(transitionProps.value, {
				appear: "",
				css: false,
				onLeave: unref(exit),
				onEnter: unref(enter)
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["onLeave", "onEnter"]);
		};
	}
});
//#endregion
//#region app/components/layout/MobileMenu.vue?vue&type=script&setup=true&lang.ts
var MobileMenu_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MobileMenu",
	__ssrInlineRender: true,
	props: { modelValue: { type: Boolean } },
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const auth = useAuthStore();
		const route = useRoute$1();
		const openDropdowns = ref([]);
		const navItems = [
			{
				label: "Home",
				to: "/",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/></svg>"
			},
			{
				label: "Motorcycles",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\"/><path d=\"M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4\"/><line x1=\"15\" y1=\"6\" x2=\"18.5\" y2=\"17.5\"/></svg>",
				children: [
					{
						label: "All Motorcycles",
						to: "/motorcycles"
					},
					{
						label: "Brands",
						to: "/brands"
					},
					{
						label: "Compare",
						to: "/motorcycles/compare"
					}
				]
			},
			{
				label: "New Arrivals",
				to: "/new-arrivals",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"/><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"/></svg>"
			},
			{
				label: "Accessories",
				to: "/accessories",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\"/><path d=\"M3 6h18\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/></svg>"
			},
			{
				label: "Apparel",
				to: "/apparel",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M6 5v14h12V5M6 5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4M6 5H3v5a2 2 0 0 0 2 2h1M18 5h3v5a2 2 0 0 1-2 2h-1\"/></svg>"
			},
			{
				label: "Service",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/></svg>",
				children: [{
					label: "Book a Service",
					to: "/service/booking"
				}, {
					label: "Book a Test Ride",
					to: "/service/test-ride"
				}]
			},
			{
				label: "Finance",
				to: "/finance",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"/><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>"
			},
			{
				label: "About",
				to: "/about",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/></svg>"
			},
			{
				label: "Contact Us",
				to: "/contact",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/></svg>"
			}
		];
		function close() {
			emit("update:modelValue", false);
		}
		function toggleDropdown(label) {
			const idx = openDropdowns.value.indexOf(label);
			if (idx > -1) openDropdowns.value.splice(idx, 1);
			else openDropdowns.value.push(label);
		}
		function isActive(path) {
			if (path === "/") return route.path === "/";
			return route.path.startsWith(path);
		}
		function handleSignOut() {
			auth.clear();
			close();
			navigateTo("/");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_ClientOnly = ClientOnly;
			ssrRenderTeleport(_push, (_push) => {
				_push(ssrRenderComponent(unref(AnimatePresence_default), null, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) if (__props.modelValue) {
							_push(`<div class="fixed inset-0 z-50 flex"${_scopeId}>`);
							_push(ssrRenderComponent(unref(motion).div, {
								class: "fixed inset-0 bg-brand-black/80 backdrop-blur-sm",
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: { opacity: 0 },
								onClick: close
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(unref(motion).div, {
								class: "relative ml-auto flex h-full w-full max-w-sm flex-col bg-brand-black border-l border-brand-grey/20",
								initial: { x: "100%" },
								animate: { x: 0 },
								exit: { x: "100%" },
								transition: {
									type: "spring",
									damping: 30,
									stiffness: 300
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="flex items-center justify-between border-b border-brand-grey/20 px-6 py-4"${_scopeId}>`);
										_push(ssrRenderComponent(_component_NuxtLink, {
											to: "/",
											class: "flex items-center",
											onClick: close
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2FNPB_20Logo_default)} alt="Nairobi Powerbikes" class="h-10 w-auto"${_scopeId}>`);
												else return [createVNode("img", {
													src: _virtual_public__2FNPB_20Logo_default,
													alt: "Nairobi Powerbikes",
													class: "h-10 w-auto"
												})];
											}),
											_: 1
										}, _parent, _scopeId));
										_push(`<button class="flex h-10 w-10 items-center justify-center text-brand-grey hover:text-white transition-colors" aria-label="Close menu"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><path d="M18 6 6 18"${_scopeId}></path><path d="m6 6 12 12"${_scopeId}></path></svg></button></div><nav class="flex-1 overflow-y-auto px-6 py-6"${_scopeId}><ul class="space-y-1"${_scopeId}><!--[-->`);
										ssrRenderList(navItems, (item) => {
											_push(`<li${_scopeId}>`);
											if (!item.children) _push(ssrRenderComponent(_component_NuxtLink, {
												to: item.to,
												class: ["flex items-center gap-3 py-4 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors border-b border-brand-grey/10", { "text-brand-red": isActive(item.to) }],
												onClick: close
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(`<span class="h-5 w-5 shrink-0"${_scopeId}>${item.icon ?? ""}</span> ${ssrInterpolate(item.label)}`);
													else return [createVNode("span", {
														innerHTML: item.icon,
														class: "h-5 w-5 shrink-0"
													}, null, 8, ["innerHTML"]), createTextVNode(" " + toDisplayString(item.label), 1)];
												}),
												_: 2
											}, _parent, _scopeId));
											else {
												_push(`<div class="border-b border-brand-grey/10 py-3"${_scopeId}><button class="flex w-full items-center justify-between py-1 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors"${_scopeId}><span class="flex items-center gap-3"${_scopeId}><span class="h-5 w-5 shrink-0"${_scopeId}>${item.icon ?? ""}</span> ${ssrInterpolate(item.label)}</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${ssrRenderClass([{ "rotate-180": unref(openDropdowns).includes(item.label) }, "transition-transform duration-200"])}"${_scopeId}><path d="m6 9 6 6 6-6"${_scopeId}></path></svg></button>`);
												if (unref(openDropdowns).includes(item.label)) {
													_push(`<div class="ml-8 mt-2 space-y-1"${_scopeId}><!--[-->`);
													ssrRenderList(item.children, (child) => {
														_push(ssrRenderComponent(_component_NuxtLink, {
															key: child.label,
															to: child.to,
															class: "block py-3 text-sm text-brand-grey hover:text-brand-red transition-colors",
															onClick: close
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(`${ssrInterpolate(child.label)}`);
																else return [createTextVNode(toDisplayString(child.label), 1)];
															}),
															_: 2
														}, _parent, _scopeId));
													});
													_push(`<!--]--></div>`);
												} else _push(`<!---->`);
												_push(`</div>`);
											}
											_push(`</li>`);
										});
										_push(`<!--]--></ul></nav><div class="border-t border-brand-grey/20 px-6 py-6"${_scopeId}>`);
										_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent, _scopeId));
										_push(`</div>`);
									} else return [
										createVNode("div", { class: "flex items-center justify-between border-b border-brand-grey/20 px-6 py-4" }, [createVNode(_component_NuxtLink, {
											to: "/",
											class: "flex items-center",
											onClick: close
										}, {
											default: withCtx(() => [createVNode("img", {
												src: _virtual_public__2FNPB_20Logo_default,
												alt: "Nairobi Powerbikes",
												class: "h-10 w-auto"
											})]),
											_: 1
										}), createVNode("button", {
											class: "flex h-10 w-10 items-center justify-center text-brand-grey hover:text-white transition-colors",
											onClick: close,
											"aria-label": "Close menu"
										}, [(openBlock(), createBlock("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											"stroke-width": "2",
											"stroke-linecap": "round",
											"stroke-linejoin": "round"
										}, [createVNode("path", { d: "M18 6 6 18" }), createVNode("path", { d: "m6 6 12 12" })]))])]),
										createVNode("nav", { class: "flex-1 overflow-y-auto px-6 py-6" }, [createVNode("ul", { class: "space-y-1" }, [(openBlock(), createBlock(Fragment, null, renderList(navItems, (item) => {
											return createVNode("li", { key: item.label }, [!item.children ? (openBlock(), createBlock(_component_NuxtLink, {
												key: 0,
												to: item.to,
												class: ["flex items-center gap-3 py-4 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors border-b border-brand-grey/10", { "text-brand-red": isActive(item.to) }],
												onClick: close
											}, {
												default: withCtx(() => [createVNode("span", {
													innerHTML: item.icon,
													class: "h-5 w-5 shrink-0"
												}, null, 8, ["innerHTML"]), createTextVNode(" " + toDisplayString(item.label), 1)]),
												_: 2
											}, 1032, ["to", "class"])) : (openBlock(), createBlock("div", {
												key: 1,
												class: "border-b border-brand-grey/10 py-3"
											}, [createVNode("button", {
												class: "flex w-full items-center justify-between py-1 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors",
												onClick: ($event) => toggleDropdown(item.label)
											}, [createVNode("span", { class: "flex items-center gap-3" }, [createVNode("span", {
												innerHTML: item.icon,
												class: "h-5 w-5 shrink-0"
											}, null, 8, ["innerHTML"]), createTextVNode(" " + toDisplayString(item.label), 1)]), (openBlock(), createBlock("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												"stroke-width": "2",
												"stroke-linecap": "round",
												"stroke-linejoin": "round",
												class: ["transition-transform duration-200", { "rotate-180": unref(openDropdowns).includes(item.label) }]
											}, [createVNode("path", { d: "m6 9 6 6 6-6" })], 2))], 8, ["onClick"]), unref(openDropdowns).includes(item.label) ? (openBlock(), createBlock("div", {
												key: 0,
												class: "ml-8 mt-2 space-y-1"
											}, [(openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
												return openBlock(), createBlock(_component_NuxtLink, {
													key: child.label,
													to: child.to,
													class: "block py-3 text-sm text-brand-grey hover:text-brand-red transition-colors",
													onClick: close
												}, {
													default: withCtx(() => [createTextVNode(toDisplayString(child.label), 1)]),
													_: 2
												}, 1032, ["to"]);
											}), 128))])) : createCommentVNode("", true)]))]);
										}), 64))])]),
										createVNode("div", { class: "border-t border-brand-grey/20 px-6 py-6" }, [createVNode(_component_ClientOnly, null, {
											default: withCtx(() => [unref(auth).isAuthenticated ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_NuxtLink, {
												to: unref(auth).getDashboardRoute(),
												class: "btn-primary w-full justify-center text-sm",
												onClick: close
											}, {
												default: withCtx(() => [createTextVNode(" Dashboard ")]),
												_: 1
											}, 8, ["to"]), createVNode("button", {
												class: "mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm text-brand-grey hover:text-brand-red transition-colors",
												onClick: handleSignOut
											}, " Sign Out ")], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [createVNode(_component_NuxtLink, {
												to: "/login",
												class: "btn-primary w-full justify-center text-sm",
												onClick: close
											}, {
												default: withCtx(() => [createTextVNode(" Sign In ")]),
												_: 1
											}), createVNode(_component_NuxtLink, {
												to: "/register",
												class: "btn-secondary mt-3 w-full justify-center text-sm",
												onClick: close
											}, {
												default: withCtx(() => [createTextVNode(" Create Account ")]),
												_: 1
											})], 64))]),
											_: 1
										})])
									];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						else return [__props.modelValue ? (openBlock(), createBlock("div", {
							key: 0,
							class: "fixed inset-0 z-50 flex"
						}, [createVNode(unref(motion).div, {
							class: "fixed inset-0 bg-brand-black/80 backdrop-blur-sm",
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							onClick: close
						}), createVNode(unref(motion).div, {
							class: "relative ml-auto flex h-full w-full max-w-sm flex-col bg-brand-black border-l border-brand-grey/20",
							initial: { x: "100%" },
							animate: { x: 0 },
							exit: { x: "100%" },
							transition: {
								type: "spring",
								damping: 30,
								stiffness: 300
							}
						}, {
							default: withCtx(() => [
								createVNode("div", { class: "flex items-center justify-between border-b border-brand-grey/20 px-6 py-4" }, [createVNode(_component_NuxtLink, {
									to: "/",
									class: "flex items-center",
									onClick: close
								}, {
									default: withCtx(() => [createVNode("img", {
										src: _virtual_public__2FNPB_20Logo_default,
										alt: "Nairobi Powerbikes",
										class: "h-10 w-auto"
									})]),
									_: 1
								}), createVNode("button", {
									class: "flex h-10 w-10 items-center justify-center text-brand-grey hover:text-white transition-colors",
									onClick: close,
									"aria-label": "Close menu"
								}, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									"stroke-width": "2",
									"stroke-linecap": "round",
									"stroke-linejoin": "round"
								}, [createVNode("path", { d: "M18 6 6 18" }), createVNode("path", { d: "m6 6 12 12" })]))])]),
								createVNode("nav", { class: "flex-1 overflow-y-auto px-6 py-6" }, [createVNode("ul", { class: "space-y-1" }, [(openBlock(), createBlock(Fragment, null, renderList(navItems, (item) => {
									return createVNode("li", { key: item.label }, [!item.children ? (openBlock(), createBlock(_component_NuxtLink, {
										key: 0,
										to: item.to,
										class: ["flex items-center gap-3 py-4 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors border-b border-brand-grey/10", { "text-brand-red": isActive(item.to) }],
										onClick: close
									}, {
										default: withCtx(() => [createVNode("span", {
											innerHTML: item.icon,
											class: "h-5 w-5 shrink-0"
										}, null, 8, ["innerHTML"]), createTextVNode(" " + toDisplayString(item.label), 1)]),
										_: 2
									}, 1032, ["to", "class"])) : (openBlock(), createBlock("div", {
										key: 1,
										class: "border-b border-brand-grey/10 py-3"
									}, [createVNode("button", {
										class: "flex w-full items-center justify-between py-1 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors",
										onClick: ($event) => toggleDropdown(item.label)
									}, [createVNode("span", { class: "flex items-center gap-3" }, [createVNode("span", {
										innerHTML: item.icon,
										class: "h-5 w-5 shrink-0"
									}, null, 8, ["innerHTML"]), createTextVNode(" " + toDisplayString(item.label), 1)]), (openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										"stroke-width": "2",
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										class: ["transition-transform duration-200", { "rotate-180": unref(openDropdowns).includes(item.label) }]
									}, [createVNode("path", { d: "m6 9 6 6 6-6" })], 2))], 8, ["onClick"]), unref(openDropdowns).includes(item.label) ? (openBlock(), createBlock("div", {
										key: 0,
										class: "ml-8 mt-2 space-y-1"
									}, [(openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
										return openBlock(), createBlock(_component_NuxtLink, {
											key: child.label,
											to: child.to,
											class: "block py-3 text-sm text-brand-grey hover:text-brand-red transition-colors",
											onClick: close
										}, {
											default: withCtx(() => [createTextVNode(toDisplayString(child.label), 1)]),
											_: 2
										}, 1032, ["to"]);
									}), 128))])) : createCommentVNode("", true)]))]);
								}), 64))])]),
								createVNode("div", { class: "border-t border-brand-grey/20 px-6 py-6" }, [createVNode(_component_ClientOnly, null, {
									default: withCtx(() => [unref(auth).isAuthenticated ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_NuxtLink, {
										to: unref(auth).getDashboardRoute(),
										class: "btn-primary w-full justify-center text-sm",
										onClick: close
									}, {
										default: withCtx(() => [createTextVNode(" Dashboard ")]),
										_: 1
									}, 8, ["to"]), createVNode("button", {
										class: "mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm text-brand-grey hover:text-brand-red transition-colors",
										onClick: handleSignOut
									}, " Sign Out ")], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [createVNode(_component_NuxtLink, {
										to: "/login",
										class: "btn-primary w-full justify-center text-sm",
										onClick: close
									}, {
										default: withCtx(() => [createTextVNode(" Sign In ")]),
										_: 1
									}), createVNode(_component_NuxtLink, {
										to: "/register",
										class: "btn-secondary mt-3 w-full justify-center text-sm",
										onClick: close
									}, {
										default: withCtx(() => [createTextVNode(" Create Account ")]),
										_: 1
									})], 64))]),
									_: 1
								})])
							]),
							_: 1
						})])) : createCommentVNode("", true)];
					}),
					_: 1
				}, _parent));
			}, "body", false, _parent);
		};
	}
});
//#endregion
//#region app/components/layout/MobileMenu.vue
var _sfc_setup$3 = MobileMenu_vue_vue_type_script_setup_true_lang_default.setup;
MobileMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/MobileMenu.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var MobileMenu_default = Object.assign(MobileMenu_vue_vue_type_script_setup_true_lang_default, { __name: "MobileMenu" });
//#endregion
//#region app/components/layout/Navbar.vue?vue&type=script&setup=true&lang.ts
var Navbar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Navbar",
	__ssrInlineRender: true,
	setup(__props) {
		useAuthStore();
		const route = useRoute$1();
		const headerRef = ref(null);
		const scrolled = ref(false);
		const activeDropdown = ref(null);
		const mobileOpen = ref(false);
		ref(null);
		const navItems = [
			{
				label: "Home",
				to: "/"
			},
			{
				label: "Motorcycles",
				to: "/motorcycles",
				children: [
					{
						label: "All Motorcycles",
						to: "/motorcycles"
					},
					{
						label: "Brands",
						to: "/brands"
					},
					{
						label: "Compare",
						to: "/motorcycles/compare"
					}
				]
			},
			{
				label: "New Arrivals",
				to: "/new-arrivals"
			},
			{
				label: "Accessories",
				to: "/accessories"
			},
			{
				label: "Apparel",
				to: "/apparel"
			},
			{
				label: "Service",
				to: "/service/booking",
				children: [{
					label: "Book a Service",
					to: "/service/booking"
				}, {
					label: "Book a Test Ride",
					to: "/service/test-ride"
				}]
			},
			{
				label: "Finance",
				to: "/finance"
			},
			{
				label: "About",
				to: "/about"
			},
			{
				label: "Contact Us",
				to: "/contact"
			}
		];
		function isActive(path) {
			if (path === "/") return route.path === "/";
			return route.path.startsWith(path.split("?")[0]);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_ClientOnly = ClientOnly;
			const _component_MobileMenu = MobileMenu_default;
			_push(`<header${ssrRenderAttrs(mergeProps({
				ref_key: "headerRef",
				ref: headerRef,
				class: ["fixed top-0 left-0 right-0 z-40 transition-all duration-300", unref(scrolled) ? "bg-brand-black/90 backdrop-blur-md shadow-lg shadow-brand-black/50" : "bg-brand-black/30 backdrop-blur-sm"]
			}, _attrs))} data-v-8de0d9e3><div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" data-v-8de0d9e3>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "flex items-center py-4 shrink-0"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2FNPB_20Logo_default)} alt="Nairobi Powerbikes" class="h-12 w-auto" data-v-8de0d9e3${_scopeId}>`);
					else return [createVNode("img", {
						src: _virtual_public__2FNPB_20Logo_default,
						alt: "Nairobi Powerbikes",
						class: "h-12 w-auto"
					})];
				}),
				_: 1
			}, _parent));
			_push(`<nav class="hidden lg:flex items-center gap-1" data-v-8de0d9e3><!--[-->`);
			ssrRenderList(navItems, (item) => {
				_push(`<div class="relative" data-v-8de0d9e3>`);
				if (item.children) _push(`<button class="flex items-center gap-1 px-3 py-6 text-sm font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors whitespace-nowrap" data-v-8de0d9e3>${ssrInterpolate(item.label)} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${ssrRenderClass([{ "rotate-180": unref(activeDropdown) === item.label }, "transition-transform duration-200"])}" data-v-8de0d9e3><path d="m6 9 6 6 6-6" data-v-8de0d9e3></path></svg></button>`);
				else _push(ssrRenderComponent(_component_NuxtLink, {
					to: item.to || "#",
					class: ["flex items-center gap-1 px-3 py-6 text-sm font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors whitespace-nowrap", { "text-brand-red": isActive(item.to) }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(item.label)}`);
						else return [createTextVNode(toDisplayString(item.label), 1)];
					}),
					_: 2
				}, _parent));
				if (item.children && unref(activeDropdown) === item.label) {
					_push(`<div class="absolute left-0 top-full" data-v-8de0d9e3><div class="w-56 rounded-sm border border-brand-grey/20 bg-brand-black/95 backdrop-blur-lg shadow-xl overflow-hidden" data-v-8de0d9e3><div class="py-2" data-v-8de0d9e3><!--[-->`);
					ssrRenderList(item.children, (child) => {
						_push(ssrRenderComponent(_component_NuxtLink, {
							key: child.label,
							to: child.to,
							class: "block px-4 py-2.5 text-sm text-brand-grey hover:text-brand-red hover:bg-white/5 transition-colors",
							onClick: ($event) => activeDropdown.value = null
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(child.label)}`);
								else return [createTextVNode(toDisplayString(child.label), 1)];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div></div></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></nav><div class="flex items-center gap-3" data-v-8de0d9e3>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(`<button class="lg:hidden flex h-10 w-10 items-center justify-center text-brand-light hover:text-brand-red transition-colors" aria-label="Open menu" data-v-8de0d9e3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-8de0d9e3><line x1="4" x2="20" y1="12" y2="12" data-v-8de0d9e3></line><line x1="4" x2="20" y1="6" y2="6" data-v-8de0d9e3></line><line x1="4" x2="20" y1="18" y2="18" data-v-8de0d9e3></line></svg></button></div></div>`);
			_push(ssrRenderComponent(_component_MobileMenu, {
				modelValue: unref(mobileOpen),
				"onUpdate:modelValue": ($event) => isRef(mobileOpen) ? mobileOpen.value = $event : null
			}, null, _parent));
			_push(`</header>`);
		};
	}
});
//#endregion
//#region app/components/layout/Navbar.vue
var _sfc_setup$2 = Navbar_vue_vue_type_script_setup_true_lang_default.setup;
Navbar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Navbar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Navbar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(Navbar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8de0d9e3"]]), { __name: "Navbar" });
//#endregion
//#region app/components/layout/FooterSection.vue?vue&type=script&setup=true&lang.ts
var FooterSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "FooterSection",
	__ssrInlineRender: true,
	setup(__props) {
		usePB();
		const quickLinks = [
			{
				label: "Home",
				to: "/"
			},
			{
				label: "Motorcycles",
				to: "/motorcycles"
			},
			{
				label: "New Arrivals",
				to: "/new-arrivals"
			},
			{
				label: "Accessories",
				to: "/accessories"
			},
			{
				label: "Apparel",
				to: "/apparel"
			},
			{
				label: "Service",
				to: "/service/booking"
			},
			{
				label: "Finance",
				to: "/finance"
			},
			{
				label: "About",
				to: "/about"
			},
			{
				label: "Contact Us",
				to: "/contact"
			},
			{
				label: "Privacy Policy",
				to: "/privacy"
			},
			{
				label: "Terms of Service",
				to: "/terms"
			}
		];
		const socialLinks = [
			{
				name: "Facebook",
				url: "https://facebook.com/nairobipowerbikes",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/></svg>"
			},
			{
				name: "Instagram",
				url: "https://instagram.com/nairobipowerbikes",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/><line x1=\"17.5\" y1=\"6.5\" x2=\"17.51\" y2=\"6.5\"/></svg>"
			},
			{
				name: "YouTube",
				url: "https://youtube.com/@nairobipowerbikes",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z\"/><polygon points=\"9.75 15.02 15.5 12 9.75 8.98 9.75 15.02\"/></svg>"
			},
			{
				name: "Twitter / X",
				url: "https://x.com/nairobipowerbikes",
				icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M17.232 4.768l-3.464 3.464\"/></svg>"
			}
		];
		const branches = ref([]);
		const loading = ref(true);
		const newsletterEmail = ref("");
		const subscribing = ref(false);
		const subscribeMsg = ref("");
		const subscribeError = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "carbon-fiber border-t border-brand-grey/20" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"><div><h3 class="mb-6 font-heading text-xl text-white">Quick Links</h3><ul class="space-y-3"><!--[-->`);
			ssrRenderList(quickLinks, (link) => {
				_push(`<li>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: link.to,
					class: "text-sm text-brand-grey hover:text-brand-red transition-colors"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(link.label)}`);
						else return [createTextVNode(toDisplayString(link.label), 1)];
					}),
					_: 2
				}, _parent));
				_push(`</li>`);
			});
			_push(`<!--]--></ul></div><div><h3 class="mb-6 font-heading text-xl text-white">Our Branches</h3>`);
			if (unref(loading)) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(2, (i) => {
					_push(`<div class="animate-pulse"><div class="mb-1 h-4 w-32 rounded bg-brand-grey/20"></div><div class="mb-1 h-3 w-48 rounded bg-brand-grey/10"></div><div class="h-3 w-36 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(branches).length) {
				_push(`<div class="space-y-5"><!--[-->`);
				ssrRenderList(unref(branches), (branch) => {
					_push(`<div><p class="text-sm font-semibold text-brand-light">${ssrInterpolate(branch.name)}</p><p class="mt-1 text-xs text-brand-grey">${ssrInterpolate(branch.address)}</p>`);
					if (branch.phone) _push(`<p class="mt-1 text-xs text-brand-grey">${ssrInterpolate(branch.phone)}</p>`);
					else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<p class="text-sm text-brand-grey">No branches listed yet.</p>`);
			_push(`</div><div><h3 class="mb-6 font-heading text-xl text-white">Newsletter</h3><p class="mb-4 text-sm text-brand-grey"> Subscribe for exclusive deals, new arrivals, and moto culture news. </p><form class="space-y-3"><input${ssrRenderAttr("value", unref(newsletterEmail))} type="email" required placeholder="Your email address" class="w-full border border-brand-grey bg-brand-black px-4 py-3 text-sm text-white placeholder:text-brand-grey focus:border-brand-red focus:outline-none transition-colors"><button type="submit"${ssrIncludeBooleanAttr(unref(subscribing)) ? " disabled" : ""} class="btn-primary w-full justify-center text-sm disabled:opacity-50">${ssrInterpolate(unref(subscribing) ? "Subscribing..." : "Subscribe")}</button></form>`);
			if (unref(subscribeMsg)) _push(`<p class="${ssrRenderClass([unref(subscribeError) ? "text-red-400" : "text-green-400", "mt-3 text-xs"])}">${ssrInterpolate(unref(subscribeMsg))}</p>`);
			else _push(`<!---->`);
			_push(`</div><div><h3 class="mb-6 font-heading text-xl text-white">Follow Us</h3><p class="mb-6 text-sm text-brand-grey"> Ride with us on social media </p><div class="flex gap-4"><!--[-->`);
			ssrRenderList(socialLinks, (social) => {
				_push(`<a${ssrRenderAttr("href", social.url)} target="_blank" rel="noopener noreferrer" class="flex h-11 w-11 items-center justify-center border border-brand-grey/30 text-brand-grey hover:border-brand-red hover:text-brand-red transition-all duration-200"${ssrRenderAttr("aria-label", social.name)}>${social.icon ?? ""}</a>`);
			});
			_push(`<!--]--></div></div></div></div><div class="border-t border-brand-grey/10"><div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8"><p class="text-xs text-brand-grey"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Nairobi Powerbikes. All rights reserved. </p><div class="flex gap-6">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/privacy",
				class: "text-xs text-brand-grey hover:text-brand-red transition-colors"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Privacy Policy `);
					else return [createTextVNode(" Privacy Policy ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/terms",
				class: "text-xs text-brand-grey hover:text-brand-red transition-colors"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Terms of Service `);
					else return [createTextVNode(" Terms of Service ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div></footer>`);
		};
	}
});
//#endregion
//#region app/components/layout/FooterSection.vue
var _sfc_setup$1 = FooterSection_vue_vue_type_script_setup_true_lang_default.setup;
FooterSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/FooterSection.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var FooterSection_default = Object.assign(FooterSection_vue_vue_type_script_setup_true_lang_default, { __name: "FooterSection" });
//#endregion
//#region app/layouts/default.vue?vue&type=script&setup=true&lang.ts
var default_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "default",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black text-white" }, _attrs))}>`);
			_push(ssrRenderComponent(Navbar_default, null, null, _parent));
			_push(`<main>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			_push(ssrRenderComponent(FooterSection_default, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/layouts/default.vue
var _sfc_setup = default_vue_vue_type_script_setup_true_lang_default.setup;
default_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = default_vue_vue_type_script_setup_true_lang_default;

export { default_default as default };
//# sourceMappingURL=default-Ma96jx5j.mjs.map
