import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Search, SearchX } from 'lucide-vue-next';
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

//#region app/pages/motorcycles/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Motorcycles - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Browse our full collection of new and used motorcycles for sale in Nairobi."
			}]
		});
		const pb = usePB();
		const loading = ref(true);
		const motorcycles = ref([]);
		const brands = ref([]);
		const bikeTypes = [
			"Sport",
			"Cruiser",
			"Touring",
			"Adventure",
			"Naked",
			"Dirt",
			"Scooter",
			"Electric"
		];
		const filters = reactive({
			search: "",
			brand: "",
			type: "",
			sort: "-created",
			inStock: false
		});
		const filteredMotorcycles = computed(() => {
			let result = [...motorcycles.value];
			if (filters.search) {
				const q = filters.search.toLowerCase();
				result = result.filter((b) => b.name.toLowerCase().includes(q) || b.brand_name?.toLowerCase().includes(q));
			}
			if (filters.brand) result = result.filter((b) => b.brand === filters.brand);
			if (filters.type) result = result.filter((b) => b.type === filters.type);
			if (filters.inStock) result = result.filter((b) => b.in_stock);
			result = result.filter((b) => b.status !== "sold");
			const [sortKey, sortDir] = filters.sort.startsWith("-") ? [filters.sort.slice(1), -1] : [filters.sort, 1];
			result.sort((a, b) => {
				const va = a[sortKey] ?? "";
				const vb = b[sortKey] ?? "";
				return va > vb ? sortDir : va < vb ? -sortDir : 0;
			});
			return result;
		});
		function bikePath(b) {
			return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`;
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Motorcycles</h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Browse our full collection of performance motorcycles.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, "Motorcycles"),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Browse our full collection of performance motorcycles.")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="mt-8 flex flex-wrap gap-4"><div class="relative flex-1 min-w-[200px]">`);
			_push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/50" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="Search motorcycles..." class="input-field w-full pl-10"></div><select class="input-field min-w-[140px] appearance-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).brand) ? ssrLooseContain(unref(filters).brand, "") : ssrLooseEqual(unref(filters).brand, "")) ? " selected" : ""}>All Brands</option><!--[-->`);
			ssrRenderList(unref(brands), (b) => {
				_push(`<option${ssrRenderAttr("value", b.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).brand) ? ssrLooseContain(unref(filters).brand, b.id) : ssrLooseEqual(unref(filters).brand, b.id)) ? " selected" : ""}>${ssrInterpolate(b.name)}</option>`);
			});
			_push(`<!--]--></select><select class="input-field min-w-[140px] appearance-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "") : ssrLooseEqual(unref(filters).type, "")) ? " selected" : ""}>All Types</option><!--[-->`);
			ssrRenderList(bikeTypes, (t) => {
				_push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, t) : ssrLooseEqual(unref(filters).type, t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
			});
			_push(`<!--]--></select><label class="flex cursor-pointer items-center gap-2 rounded-sm border border-brand-grey/20 px-4 py-2 text-sm text-brand-grey hover:border-brand-red/40"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).inStock) ? ssrLooseContain(unref(filters).inStock, null) : unref(filters).inStock) ? " checked" : ""} type="checkbox" class="accent-brand-red"> In Stock Only</label><select class="input-field min-w-[150px] appearance-none"><option value="-created"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "-created") : ssrLooseEqual(unref(filters).sort, "-created")) ? " selected" : ""}>Newest</option><option value="price"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "price") : ssrLooseEqual(unref(filters).sort, "price")) ? " selected" : ""}>Price: Low to High</option><option value="-price"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "-price") : ssrLooseEqual(unref(filters).sort, "-price")) ? " selected" : ""}>Price: High to Low</option><option value="name"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "name") : ssrLooseEqual(unref(filters).sort, "name")) ? " selected" : ""}>Name: A-Z</option><option value="-year"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "-year") : ssrLooseEqual(unref(filters).sort, "-year")) ? " selected" : ""}>Year: Newest</option></select></div>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(8, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10"></div><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filteredMotorcycles).length) {
				_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(filteredMotorcycles), (bike, i) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: bike.id,
						to: bikePath(bike)
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
										_push(`<div class="aspect-[4/3] overflow-hidden bg-brand-black relative"${_scopeId}>`);
										if (bike.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(bike, bike.images[0]))}${ssrRenderAttr("alt", bike.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"${_scopeId}>`);
										else _push(`<!---->`);
										if (bike.status === "coming_soon") _push(`<div class="absolute top-2 left-2 rounded-sm bg-amber-500 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"${_scopeId}>Coming Soon</div>`);
										else if (bike.new_arrival) _push(`<div class="absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"${_scopeId}>New</div>`);
										else _push(`<!---->`);
										if (bike.sale_price) _push(`<div class="absolute top-2 right-2 rounded-sm bg-green-600 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"${_scopeId}>Sale</div>`);
										else _push(`<!---->`);
										_push(`</div><div class="p-4"${_scopeId}><p class="text-xs font-display tracking-display text-brand-grey/60 uppercase"${_scopeId}>${ssrInterpolate(bike.brand_name)}</p><h3 class="font-bold text-2xl tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(bike.name)}</h3><p class="text-xs text-brand-grey"${_scopeId}>${ssrInterpolate(bike.year)} · ${ssrInterpolate(bike.engine_cc)}cc · ${ssrInterpolate(bike.type)}</p><div class="mt-2 flex items-baseline gap-2"${_scopeId}><p class="text-xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate((bike.sale_price || bike.price).toLocaleString())}</p>`);
										if (bike.sale_price) _push(`<p class="text-xs font-bold text-brand-grey/60 line-through"${_scopeId}>KES ${ssrInterpolate(Number(bike.price).toLocaleString())}</p>`);
										else _push(`<!---->`);
										_push(`</div></div>`);
									} else return [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black relative" }, [
										bike.images?.length ? (openBlock(), createBlock("img", {
											key: 0,
											src: unref(pb).files.getURL(bike, bike.images[0]),
											alt: bike.name,
											class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
										}, null, 8, ["src", "alt"])) : createCommentVNode("", true),
										bike.status === "coming_soon" ? (openBlock(), createBlock("div", {
											key: 1,
											class: "absolute top-2 left-2 rounded-sm bg-amber-500 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
										}, "Coming Soon")) : bike.new_arrival ? (openBlock(), createBlock("div", {
											key: 2,
											class: "absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
										}, "New")) : createCommentVNode("", true),
										bike.sale_price ? (openBlock(), createBlock("div", {
											key: 3,
											class: "absolute top-2 right-2 rounded-sm bg-green-600 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
										}, "Sale")) : createCommentVNode("", true)
									]), createVNode("div", { class: "p-4" }, [
										createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(bike.brand_name), 1),
										createVNode("h3", { class: "font-bold text-2xl tracking-[var(--tracking-display)] text-white" }, toDisplayString(bike.name), 1),
										createVNode("p", { class: "text-xs text-brand-grey" }, toDisplayString(bike.year) + " · " + toDisplayString(bike.engine_cc) + "cc · " + toDisplayString(bike.type), 1),
										createVNode("div", { class: "mt-2 flex items-baseline gap-2" }, [createVNode("p", { class: "text-xl font-bold text-brand-red" }, "KES " + toDisplayString((bike.sale_price || bike.price).toLocaleString()), 1), bike.sale_price ? (openBlock(), createBlock("p", {
											key: 0,
											class: "text-xs font-bold text-brand-grey/60 line-through"
										}, "KES " + toDisplayString(Number(bike.price).toLocaleString()), 1)) : createCommentVNode("", true)])
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
								default: withCtx(() => [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black relative" }, [
									bike.images?.length ? (openBlock(), createBlock("img", {
										key: 0,
										src: unref(pb).files.getURL(bike, bike.images[0]),
										alt: bike.name,
										class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
									}, null, 8, ["src", "alt"])) : createCommentVNode("", true),
									bike.status === "coming_soon" ? (openBlock(), createBlock("div", {
										key: 1,
										class: "absolute top-2 left-2 rounded-sm bg-amber-500 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
									}, "Coming Soon")) : bike.new_arrival ? (openBlock(), createBlock("div", {
										key: 2,
										class: "absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
									}, "New")) : createCommentVNode("", true),
									bike.sale_price ? (openBlock(), createBlock("div", {
										key: 3,
										class: "absolute top-2 right-2 rounded-sm bg-green-600 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase"
									}, "Sale")) : createCommentVNode("", true)
								]), createVNode("div", { class: "p-4" }, [
									createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(bike.brand_name), 1),
									createVNode("h3", { class: "font-bold text-2xl tracking-[var(--tracking-display)] text-white" }, toDisplayString(bike.name), 1),
									createVNode("p", { class: "text-xs text-brand-grey" }, toDisplayString(bike.year) + " · " + toDisplayString(bike.engine_cc) + "cc · " + toDisplayString(bike.type), 1),
									createVNode("div", { class: "mt-2 flex items-baseline gap-2" }, [createVNode("p", { class: "text-xl font-bold text-brand-red" }, "KES " + toDisplayString((bike.sale_price || bike.price).toLocaleString()), 1), bike.sale_price ? (openBlock(), createBlock("p", {
										key: 0,
										class: "text-xs font-bold text-brand-grey/60 line-through"
									}, "KES " + toDisplayString(Number(bike.price).toLocaleString()), 1)) : createCommentVNode("", true)])
								])]),
								_: 2
							}, 1032, ["transition"])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">`);
				_push(ssrRenderComponent(unref(SearchX), { class: "mx-auto mb-4 h-12 w-12 text-brand-grey/30" }, null, _parent));
				_push(`<p class="font-display text-xl tracking-display text-brand-grey">No Motorcycles Found</p><p class="mt-2 text-sm text-brand-grey/60">Try adjusting your filters</p><button class="btn-ghost mt-4">Clear Filters</button></div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/motorcycles/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/motorcycles/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var motorcycles_default = index_vue_vue_type_script_setup_true_lang_default;

export { motorcycles_default as default };
//# sourceMappingURL=motorcycles-C5wdI1Aw.mjs.map
