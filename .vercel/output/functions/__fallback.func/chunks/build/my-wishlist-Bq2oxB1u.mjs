import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Heart } from 'lucide-vue-next';
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

//#region app/pages/dashboard/my-wishlist.vue?vue&type=script&setup=true&lang.ts
var my_wishlist_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "my-wishlist",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "My Favorites - Nairobi Powerbikes" });
		const pb = usePB();
		useAuthStore();
		const loading = ref(true);
		const motorcycles = ref([]);
		function bikePath(m) {
			return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Favorites</span></h1><p class="mt-1 text-sm text-brand-grey">Saved motorcycles</p></div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mb-3 aspect-[4/3] rounded-sm bg-brand-grey/10"></div><div class="h-5 w-3/4 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(motorcycles).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Heart), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Favorites Yet</p><p class="mt-2 text-sm text-brand-grey/60">Browse motorcycles and save your favorites here</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/",
					class: "mt-4 inline-block"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_component_Button, null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Browse Motorcycles`);
								else return [createTextVNode("Browse Motorcycles")];
							}),
							_: 1
						}, _parent, _scopeId));
						else return [createVNode(_component_Button, null, {
							default: withCtx(() => [createTextVNode("Browse Motorcycles")]),
							_: 1
						})];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(motorcycles), (m) => {
					_push(`<div class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 overflow-hidden transition-all duration-200 hover:border-brand-red/30"><div class="aspect-[4/3] overflow-hidden bg-brand-black">`);
					if (m.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(m, m.images[0]))}${ssrRenderAttr("alt", m.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105">`);
					else _push(`<!---->`);
					_push(`</div><div class="p-4"><p class="text-xs font-display tracking-display text-brand-grey/60 uppercase">${ssrInterpolate(m.brand_name)}</p><h3 class="font-bold text-2xl tracking-[var(--tracking-display)] text-white">${ssrInterpolate(m.name)}</h3><p class="text-xs text-brand-grey">${ssrInterpolate(m.year || "")} · ${ssrInterpolate(m.engine_cc || "")}cc · ${ssrInterpolate(m.type || "")}</p><div class="mt-2 flex items-baseline gap-2"><p class="text-xl font-bold text-brand-red">KES ${ssrInterpolate((m.sale_price || m.price || 0).toLocaleString())}</p>`);
					if (m.sale_price) _push(`<p class="text-xs font-bold text-brand-grey/60 line-through">KES ${ssrInterpolate(Number(m.price).toLocaleString())}</p>`);
					else _push(`<!---->`);
					_push(`</div><div class="mt-3">`);
					_push(ssrRenderComponent(_component_NuxtLink, { to: bikePath(m) }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_Button, {
								variant: "outline",
								size: "sm",
								class: "w-full"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`View Details`);
									else return [createTextVNode("View Details")];
								}),
								_: 2
							}, _parent, _scopeId));
							else return [createVNode(_component_Button, {
								variant: "outline",
								size: "sm",
								class: "w-full"
							}, {
								default: withCtx(() => [createTextVNode("View Details")]),
								_: 1
							})];
						}),
						_: 2
					}, _parent));
					_push(`</div></div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/my-wishlist.vue
var _sfc_setup = my_wishlist_vue_vue_type_script_setup_true_lang_default.setup;
my_wishlist_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-wishlist.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var my_wishlist_default = my_wishlist_vue_vue_type_script_setup_true_lang_default;

export { my_wishlist_default as default };
//# sourceMappingURL=my-wishlist-Bq2oxB1u.mjs.map
