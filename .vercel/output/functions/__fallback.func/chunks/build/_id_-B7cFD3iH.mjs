import { u as useHead$1, b as useRoute$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ShoppingCart, Heart } from 'lucide-vue-next';
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

//#region app/pages/apparel/[id].vue?vue&type=script&setup=true&lang.ts
var _id__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Apparel Details - Nairobi Powerbikes" });
		const pb = usePB();
		useRoute$1();
		const loading = ref(true);
		const item = ref(null);
		const selectedSize = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			if (unref(loading)) _push(`<div class="animate-pulse"><div class="aspect-[3/4] w-full max-w-lg rounded-sm bg-brand-grey/10"></div><div class="mt-6 h-8 w-96 rounded bg-brand-grey/10"></div><div class="mt-3 h-4 w-64 rounded bg-brand-grey/10"></div><div class="mt-4 h-24 rounded bg-brand-grey/10"></div></div>`);
			else if (unref(item)) _push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					y: 30
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .5 },
				class: "grid gap-8 lg:grid-cols-2"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="overflow-hidden rounded-sm bg-brand-black"${_scopeId}>`);
						if (unref(item).image) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(unref(item), unref(item).image))}${ssrRenderAttr("alt", unref(item).name)} class="w-full object-cover"${_scopeId}>`);
						else _push(`<!---->`);
						_push(`</div><div${_scopeId}><p class="font-display text-sm tracking-display text-brand-red uppercase"${_scopeId}>${ssrInterpolate(unref(item).category)}</p><h1 class="font-display text-display-xl leading-[var(--leading-display)] text-white"${_scopeId}>${ssrInterpolate(unref(item).name)}</h1><p class="mt-4 text-3xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate(Number(unref(item).price).toLocaleString())}</p>`);
						if (unref(item).original_price) _push(`<p class="mt-1 text-sm text-brand-grey/60 line-through"${_scopeId}>KES ${ssrInterpolate(Number(unref(item).original_price).toLocaleString())}</p>`);
						else _push(`<!---->`);
						if (unref(item).description) _push(`<p class="mt-6 leading-relaxed text-brand-grey"${_scopeId}>${ssrInterpolate(unref(item).description)}</p>`);
						else _push(`<!---->`);
						if (unref(item).sizes?.length) {
							_push(`<div class="mt-6"${_scopeId}><h3 class="font-display text-lg text-white"${_scopeId}>Sizes</h3><div class="mt-2 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
							ssrRenderList(unref(item).sizes, (s) => {
								_push(`<button class="${ssrRenderClass([{ "border-brand-red bg-brand-red/10 text-brand-red": unref(selectedSize) === s }, "rounded-sm border border-brand-grey/20 px-4 py-2 text-sm text-brand-grey transition-all hover:border-brand-red hover:text-brand-red"])}"${_scopeId}>${ssrInterpolate(s)}</button>`);
							});
							_push(`<!--]--></div></div>`);
						} else _push(`<!---->`);
						_push(`<div class="mt-8 flex flex-wrap gap-3"${_scopeId}><button class="btn-primary"${ssrIncludeBooleanAttr(!unref(selectedSize) && !!unref(item).sizes?.length) ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(ShoppingCart), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`Add to Cart</button><button class="btn-secondary"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Heart), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`Add to Wishlist</button></div></div>`);
					} else return [createVNode("div", { class: "overflow-hidden rounded-sm bg-brand-black" }, [unref(item).image ? (openBlock(), createBlock("img", {
						key: 0,
						src: unref(pb).files.getURL(unref(item), unref(item).image),
						alt: unref(item).name,
						class: "w-full object-cover"
					}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", null, [
						createVNode("p", { class: "font-display text-sm tracking-display text-brand-red uppercase" }, toDisplayString(unref(item).category), 1),
						createVNode("h1", { class: "font-display text-display-xl leading-[var(--leading-display)] text-white" }, toDisplayString(unref(item).name), 1),
						createVNode("p", { class: "mt-4 text-3xl font-bold text-brand-red" }, "KES " + toDisplayString(Number(unref(item).price).toLocaleString()), 1),
						unref(item).original_price ? (openBlock(), createBlock("p", {
							key: 0,
							class: "mt-1 text-sm text-brand-grey/60 line-through"
						}, "KES " + toDisplayString(Number(unref(item).original_price).toLocaleString()), 1)) : createCommentVNode("", true),
						unref(item).description ? (openBlock(), createBlock("p", {
							key: 1,
							class: "mt-6 leading-relaxed text-brand-grey"
						}, toDisplayString(unref(item).description), 1)) : createCommentVNode("", true),
						unref(item).sizes?.length ? (openBlock(), createBlock("div", {
							key: 2,
							class: "mt-6"
						}, [createVNode("h3", { class: "font-display text-lg text-white" }, "Sizes"), createVNode("div", { class: "mt-2 flex flex-wrap gap-2" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(item).sizes, (s) => {
							return openBlock(), createBlock("button", {
								key: s,
								class: ["rounded-sm border border-brand-grey/20 px-4 py-2 text-sm text-brand-grey transition-all hover:border-brand-red hover:text-brand-red", { "border-brand-red bg-brand-red/10 text-brand-red": unref(selectedSize) === s }],
								onClick: ($event) => selectedSize.value = s
							}, toDisplayString(s), 11, ["onClick"]);
						}), 128))])])) : createCommentVNode("", true),
						createVNode("div", { class: "mt-8 flex flex-wrap gap-3" }, [createVNode("button", {
							class: "btn-primary",
							disabled: !unref(selectedSize) && !!unref(item).sizes?.length
						}, [createVNode(unref(ShoppingCart), { class: "h-5 w-5" }), createTextVNode("Add to Cart")], 8, ["disabled"]), createVNode("button", { class: "btn-secondary" }, [createVNode(unref(Heart), { class: "h-5 w-5" }), createTextVNode("Add to Wishlist")])])
					])];
				}),
				_: 1
			}, _parent));
			else {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-2xl tracking-display text-brand-grey">Apparel Not Found</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/apparel",
					class: "btn-primary mt-6 inline-flex"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Browse All Apparel`);
						else return [createTextVNode("Browse All Apparel")];
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
//#region app/pages/apparel/[id].vue
var _sfc_setup = _id__vue_vue_type_script_setup_true_lang_default.setup;
_id__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/apparel/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = _id__vue_vue_type_script_setup_true_lang_default;

export { _id__default as default };
//# sourceMappingURL=_id_-B7cFD3iH.mjs.map
