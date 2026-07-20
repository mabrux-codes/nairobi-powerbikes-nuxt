import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/brands/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Motorcycle Brands - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Browse our selection of motorcycle brands available at Nairobi Powerbikes — Tekken, Taro GP, Voge, Loncin, QJ Motor."
			}]
		});
		const pb = usePB();
		const loading = ref(true);
		const brands = ref([]);
		const brandGradients = [
			"from-red-700 to-red-500",
			"from-orange-600 to-red-500",
			"from-teal-600 to-emerald-500",
			"from-blue-900 to-slate-700",
			"from-amber-600 to-yellow-500"
		];
		function getBrandGradient(i) {
			return brandGradients[i % brandGradients.length];
		}
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Our <span class="text-brand-red"${_scopeId}>Brands</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Explore our portfolio of world-class motorcycle brands.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Our "), createVNode("span", { class: "text-brand-red" }, "Brands")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Explore our portfolio of world-class motorcycle brands.")
					];
				}),
				_: 1
			}, _parent));
			if (unref(loading)) {
				_push(`<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/10 p-6"><div class="mx-auto mb-4 h-16 w-32 rounded bg-brand-grey/10"></div><div class="mx-auto h-5 w-24 rounded bg-brand-grey/10"></div><div class="mx-auto mt-2 h-4 w-48 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(brands), (brand, i) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: brand.id,
						to: `/brands/${brand.id}`
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-8 text-center transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-red/5",
								initial: {
									opacity: 0,
									y: 30
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i * .08,
									duration: .4
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										if (brand.logo) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(brand, brand.logo))}${ssrRenderAttr("alt", brand.name)} class="mx-auto mb-5 h-20 max-w-[140px] object-contain transition-all duration-300 group-hover:scale-110"${_scopeId}>`);
										else _push(`<div class="${ssrRenderClass([getBrandGradient(i), "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br"])}"${_scopeId}><span class="font-display text-xl text-white"${_scopeId}>${ssrInterpolate(brand.name.slice(0, 2).toUpperCase())}</span></div>`);
										_push(`<h2 class="font-display text-xl tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(brand.name)}</h2>`);
										if (brand.tagline) _push(`<p class="mt-2 text-sm text-brand-grey"${_scopeId}>${ssrInterpolate(brand.tagline)}</p>`);
										else _push(`<!---->`);
									} else return [
										brand.logo ? (openBlock(), createBlock("img", {
											key: 0,
											src: unref(pb).files.getURL(brand, brand.logo),
											alt: brand.name,
											class: "mx-auto mb-5 h-20 max-w-[140px] object-contain transition-all duration-300 group-hover:scale-110"
										}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
											key: 1,
											class: ["mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br", getBrandGradient(i)]
										}, [createVNode("span", { class: "font-display text-xl text-white" }, toDisplayString(brand.name.slice(0, 2).toUpperCase()), 1)], 2)),
										createVNode("h2", { class: "font-display text-xl tracking-[var(--tracking-display)] text-white" }, toDisplayString(brand.name), 1),
										brand.tagline ? (openBlock(), createBlock("p", {
											key: 2,
											class: "mt-2 text-sm text-brand-grey"
										}, toDisplayString(brand.tagline), 1)) : createCommentVNode("", true)
									];
								}),
								_: 2
							}, _parent, _scopeId));
							else return [createVNode(unref(motion).div, {
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-8 text-center transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-red/5",
								initial: {
									opacity: 0,
									y: 30
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: i * .08,
									duration: .4
								}
							}, {
								default: withCtx(() => [
									brand.logo ? (openBlock(), createBlock("img", {
										key: 0,
										src: unref(pb).files.getURL(brand, brand.logo),
										alt: brand.name,
										class: "mx-auto mb-5 h-20 max-w-[140px] object-contain transition-all duration-300 group-hover:scale-110"
									}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
										key: 1,
										class: ["mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br", getBrandGradient(i)]
									}, [createVNode("span", { class: "font-display text-xl text-white" }, toDisplayString(brand.name.slice(0, 2).toUpperCase()), 1)], 2)),
									createVNode("h2", { class: "font-display text-xl tracking-[var(--tracking-display)] text-white" }, toDisplayString(brand.name), 1),
									brand.tagline ? (openBlock(), createBlock("p", {
										key: 2,
										class: "mt-2 text-sm text-brand-grey"
									}, toDisplayString(brand.tagline), 1)) : createCommentVNode("", true)
								]),
								_: 2
							}, 1032, ["transition"])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/brands/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/brands/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var brands_default = index_vue_vue_type_script_setup_true_lang_default;

export { brands_default as default };
//# sourceMappingURL=brands-OizSh40U.mjs.map
