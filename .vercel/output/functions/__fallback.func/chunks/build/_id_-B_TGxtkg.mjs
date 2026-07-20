import { u as useHead$1, b as useRoute$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/brands/[id].vue?vue&type=script&setup=true&lang.ts
var _id__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Brand Details - Nairobi Powerbikes" });
		function bikePath(b) {
			return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`;
		}
		const pb = usePB();
		useRoute$1();
		const loading = ref(true);
		const brand = ref(null);
		const motorcyclesLoading = ref(true);
		const motorcycles = ref([]);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			if (unref(loading)) {
				_push(`<div class="animate-pulse space-y-6"><div class="h-8 w-64 rounded bg-brand-grey/10"></div><div class="h-4 w-96 rounded bg-brand-grey/10"></div><div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="h-64 rounded-sm bg-brand-grey/10"></div>`);
				});
				_push(`<!--]--></div></div>`);
			} else if (unref(brand)) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(unref(motion).div, {
					initial: {
						opacity: 0,
						y: 30
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .5 }
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex items-center gap-4"${_scopeId}>`);
							if (unref(brand).logo) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(unref(brand), unref(brand).logo))}${ssrRenderAttr("alt", unref(brand).name)} class="h-14 max-w-[160px] object-contain"${_scopeId}>`);
							else _push(`<!---->`);
							_push(`<div${_scopeId}><h1 class="font-display text-display-lg leading-[var(--leading-display)] text-white"${_scopeId}>${ssrInterpolate(unref(brand).name)}</h1>`);
							if (unref(brand).tagline) _push(`<p class="mt-1 text-brand-grey"${_scopeId}>${ssrInterpolate(unref(brand).tagline)}</p>`);
							else _push(`<!---->`);
							_push(`</div></div><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div>`);
							if (unref(brand).description) _push(`<p class="mt-6 max-w-3xl leading-relaxed text-brand-grey"${_scopeId}>${ssrInterpolate(unref(brand).description)}</p>`);
							else _push(`<!---->`);
						} else return [
							createVNode("div", { class: "flex items-center gap-4" }, [unref(brand).logo ? (openBlock(), createBlock("img", {
								key: 0,
								src: unref(pb).files.getURL(unref(brand), unref(brand).logo),
								alt: unref(brand).name,
								class: "h-14 max-w-[160px] object-contain"
							}, null, 8, ["src", "alt"])) : createCommentVNode("", true), createVNode("div", null, [createVNode("h1", { class: "font-display text-display-lg leading-[var(--leading-display)] text-white" }, toDisplayString(unref(brand).name), 1), unref(brand).tagline ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 text-brand-grey"
							}, toDisplayString(unref(brand).tagline), 1)) : createCommentVNode("", true)])]),
							createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
							unref(brand).description ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-6 max-w-3xl leading-relaxed text-brand-grey"
							}, toDisplayString(unref(brand).description), 1)) : createCommentVNode("", true)
						];
					}),
					_: 1
				}, _parent));
				_push(`<div class="mt-12"><h2 class="font-display text-display-md leading-[var(--leading-display)] text-white">${ssrInterpolate(unref(brand).name)} Motorcycles</h2>`);
				if (unref(motorcyclesLoading)) {
					_push(`<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
					ssrRenderList(6, (i) => {
						_push(`<div class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10"></div><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
					});
					_push(`<!--]--></div>`);
				} else if (unref(motorcycles).length) {
					_push(`<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
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
										delay: i * .06,
										duration: .4
									}
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<div class="aspect-[4/3] overflow-hidden bg-brand-black"${_scopeId}>`);
											if (bike.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(bike, bike.images[0]))}${ssrRenderAttr("alt", bike.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"${_scopeId}>`);
											else _push(`<!---->`);
											_push(`</div><div class="p-4"${_scopeId}><h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(bike.name)}</h3><p class="text-xs text-brand-grey"${_scopeId}>${ssrInterpolate(bike.year)} · ${ssrInterpolate(bike.engine_cc)}cc</p><p class="mt-2 text-xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate(Number(bike.price).toLocaleString())}</p></div>`);
										} else return [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black" }, [bike.images?.length ? (openBlock(), createBlock("img", {
											key: 0,
											src: unref(pb).files.getURL(bike, bike.images[0]),
											alt: bike.name,
											class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
										}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-4" }, [
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
										delay: i * .06,
										duration: .4
									}
								}, {
									default: withCtx(() => [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black" }, [bike.images?.length ? (openBlock(), createBlock("img", {
										key: 0,
										src: unref(pb).files.getURL(bike, bike.images[0]),
										alt: bike.name,
										class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
									}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-4" }, [
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
				} else _push(`<div class="mt-8 rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><p class="font-display text-xl tracking-display text-brand-grey">No motorcycles listed yet</p><p class="mt-2 text-sm text-brand-grey/60">Check back soon for new arrivals</p></div>`);
				_push(`</div><!--]-->`);
			} else {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-2xl tracking-display text-brand-grey">Brand Not Found</p><p class="mt-2 text-sm text-brand-grey/60">The brand you&#39;re looking for doesn&#39;t exist.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/brands",
					class: "btn-primary mt-6 inline-flex"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Browse All Brands`);
						else return [createTextVNode("Browse All Brands")];
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
//#region app/pages/brands/[id].vue
var _sfc_setup = _id__vue_vue_type_script_setup_true_lang_default.setup;
_id__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/brands/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = _id__vue_vue_type_script_setup_true_lang_default;

export { _id__default as default };
//# sourceMappingURL=_id_-B_TGxtkg.mjs.map
