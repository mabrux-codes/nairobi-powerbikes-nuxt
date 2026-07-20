import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/apparel/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Apparel - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Shop premium motorcycle apparel in Nairobi. Jackets, helmets, boots, gloves, and more."
			}]
		});
		const pb = usePB();
		const loading = ref(true);
		const apparel = ref([]);
		const categories = [
			"All",
			"Jackets",
			"Helmets",
			"Boots",
			"Gloves",
			"Pants",
			"Base Layers",
			"Rain Gear",
			"Casual",
			"Other"
		];
		const activeCategory = ref("All");
		const filtered = computed(() => activeCategory.value === "All" ? apparel.value : apparel.value.filter((a) => a.category === activeCategory.value));
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Apparel</h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Ride in style with our premium apparel collection.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, "Apparel"),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Ride in style with our premium apparel collection.")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="mt-8 flex flex-wrap gap-3"><!--[-->`);
			ssrRenderList(categories, (cat) => {
				_push(`<button class="${ssrRenderClass([unref(activeCategory) === cat ? "border-brand-red bg-brand-red/10 text-brand-red" : "border-brand-grey/20 text-brand-grey hover:border-brand-red/40", "rounded-sm border px-4 py-2 text-xs font-display tracking-display uppercase transition-all duration-200"])}">${ssrInterpolate(cat)}</button>`);
			});
			_push(`<!--]--></div>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(8, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[3/4] w-full rounded-sm bg-brand-grey/10"></div><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filtered).length) {
				_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(filtered), (item, i) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: item.id,
						to: `/apparel/${item.id}`
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40",
								initial: {
									opacity: 0,
									y: 20
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i % 8 * .04,
									duration: .35
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="aspect-[3/4] overflow-hidden bg-brand-black"${_scopeId}>`);
										if (item.image) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(item, item.image))}${ssrRenderAttr("alt", item.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"${_scopeId}>`);
										else _push(`<!---->`);
										_push(`</div><div class="p-4"${_scopeId}><p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase"${_scopeId}>${ssrInterpolate(item.category)}</p><h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(item.name)}</h3><p class="mt-1 text-xs text-brand-grey line-clamp-2"${_scopeId}>${ssrInterpolate(item.description)}</p><p class="mt-2 text-xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate(Number(item.price).toLocaleString())}</p></div>`);
									} else return [createVNode("div", { class: "aspect-[3/4] overflow-hidden bg-brand-black" }, [item.image ? (openBlock(), createBlock("img", {
										key: 0,
										src: unref(pb).files.getURL(item, item.image),
										alt: item.name,
										class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
									}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-4" }, [
										createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(item.category), 1),
										createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(item.name), 1),
										createVNode("p", { class: "mt-1 text-xs text-brand-grey line-clamp-2" }, toDisplayString(item.description), 1),
										createVNode("p", { class: "mt-2 text-xl font-bold text-brand-red" }, "KES " + toDisplayString(Number(item.price).toLocaleString()), 1)
									])];
								}),
								_: 2
							}, _parent, _scopeId));
							else return [createVNode(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40",
								initial: {
									opacity: 0,
									y: 20
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i % 8 * .04,
									duration: .35
								}
							}, {
								default: withCtx(() => [createVNode("div", { class: "aspect-[3/4] overflow-hidden bg-brand-black" }, [item.image ? (openBlock(), createBlock("img", {
									key: 0,
									src: unref(pb).files.getURL(item, item.image),
									alt: item.name,
									class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
								}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-4" }, [
									createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(item.category), 1),
									createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(item.name), 1),
									createVNode("p", { class: "mt-1 text-xs text-brand-grey line-clamp-2" }, toDisplayString(item.description), 1),
									createVNode("p", { class: "mt-2 text-xl font-bold text-brand-red" }, "KES " + toDisplayString(Number(item.price).toLocaleString()), 1)
								])]),
								_: 2
							}, 1032, ["transition"])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-xl tracking-display text-brand-grey">No Apparel Found</p><p class="mt-2 text-sm text-brand-grey/60">Try selecting a different category</p></div>`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/apparel/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/apparel/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var apparel_default = index_vue_vue_type_script_setup_true_lang_default;

export { apparel_default as default };
//# sourceMappingURL=apparel-g47evnOT.mjs.map
