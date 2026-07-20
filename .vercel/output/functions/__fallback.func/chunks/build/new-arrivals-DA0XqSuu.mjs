import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
import 'framer-motion/dom';
import '@vueuse/core';
import 'motion-dom';
import 'hey-listen';
import 'motion-utils';

//#region app/pages/new-arrivals.vue?vue&type=script&setup=true&lang.ts
var new_arrivals_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "new-arrivals",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "New Arrivals - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Check out the latest motorcycle arrivals at Nairobi Powerbikes. Be the first to ride the newest models."
			}]
		});
		function bikePath(b) {
			return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`;
		}
		const pb = usePB();
		const loading = ref(true);
		const motorcycles = ref([]);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					y: 40
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>New <span class="text-brand-red"${_scopeId}>Arrivals</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Be the first to ride the latest models to hit our showroom floor.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("New "), createVNode("span", { class: "text-brand-red" }, "Arrivals")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Be the first to ride the latest models to hit our showroom floor.")
					];
				}),
				_: 1
			}, _parent));
			if (unref(loading)) {
				_push(`<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(8, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10"></div><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(motorcycles).length) {
				_push(`<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(motorcycles), (bike, i) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: bike.id,
						to: bikePath(bike)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40",
								initial: {
									opacity: 0,
									y: 24
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i * .05,
									duration: .4
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="aspect-[4/3] overflow-hidden bg-brand-black relative"${_scopeId}>`);
										if (bike.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(bike, bike.images[0]))}${ssrRenderAttr("alt", bike.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"${_scopeId}>`);
										else _push(`<!---->`);
										_push(`<div class="absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"${_scopeId}>New</div></div><div class="p-4"${_scopeId}><p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase"${_scopeId}>${ssrInterpolate(bike.brand_name)}</p><h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(bike.name)}</h3><p class="text-xs text-brand-grey"${_scopeId}>${ssrInterpolate(bike.year)} · ${ssrInterpolate(bike.engine_cc)}cc</p><p class="mt-2 text-xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate(Number(bike.price).toLocaleString())}</p></div>`);
									} else return [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black relative" }, [bike.images?.length ? (openBlock(), createBlock("img", {
										key: 0,
										src: unref(pb).files.getURL(bike, bike.images[0]),
										alt: bike.name,
										class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
									}, null, 8, ["src", "alt"])) : createCommentVNode("", true), createVNode("div", { class: "absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase" }, "New")]), createVNode("div", { class: "p-4" }, [
										createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(bike.brand_name), 1),
										createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(bike.name), 1),
										createVNode("p", { class: "text-xs text-brand-grey" }, toDisplayString(bike.year) + " · " + toDisplayString(bike.engine_cc) + "cc", 1),
										createVNode("p", { class: "mt-2 text-xl font-bold text-brand-red" }, "KES " + toDisplayString(Number(bike.price).toLocaleString()), 1)
									])];
								}),
								_: 2
							}, _parent, _scopeId));
							else return [createVNode(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40",
								initial: {
									opacity: 0,
									y: 24
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i * .05,
									duration: .4
								}
							}, {
								default: withCtx(() => [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black relative" }, [bike.images?.length ? (openBlock(), createBlock("img", {
									key: 0,
									src: unref(pb).files.getURL(bike, bike.images[0]),
									alt: bike.name,
									class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
								}, null, 8, ["src", "alt"])) : createCommentVNode("", true), createVNode("div", { class: "absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase" }, "New")]), createVNode("div", { class: "p-4" }, [
									createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(bike.brand_name), 1),
									createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(bike.name), 1),
									createVNode("p", { class: "text-xs text-brand-grey" }, toDisplayString(bike.year) + " · " + toDisplayString(bike.engine_cc) + "cc", 1),
									createVNode("p", { class: "mt-2 text-xl font-bold text-brand-red" }, "KES " + toDisplayString(Number(bike.price).toLocaleString()), 1)
								])]),
								_: 2
							}, 1032, ["transition"])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-2xl tracking-display text-brand-grey">No New Arrivals</p><p class="mt-2 text-sm text-brand-grey/60">Check back soon for the latest models</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/motorcycles",
					class: "btn-ghost mt-4"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Browse All Motorcycles`);
						else return [createTextVNode("Browse All Motorcycles")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/new-arrivals.vue
var _sfc_setup = new_arrivals_vue_vue_type_script_setup_true_lang_default.setup;
new_arrivals_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/new-arrivals.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var new_arrivals_default = new_arrivals_vue_vue_type_script_setup_true_lang_default;

export { new_arrivals_default as default };
//# sourceMappingURL=new-arrivals-DA0XqSuu.mjs.map
