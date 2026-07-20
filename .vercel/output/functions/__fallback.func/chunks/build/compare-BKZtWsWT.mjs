import { u as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { X } from 'lucide-vue-next';
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

//#region app/pages/motorcycles/compare.vue?vue&type=script&setup=true&lang.ts
var compare_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "compare",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Compare Motorcycles - Nairobi Powerbikes" });
		const pb = usePB();
		const allMotorcycles = ref([]);
		const selected = ref([
			"",
			"",
			""
		]);
		const compareList = computed(() => allMotorcycles.value.filter((b) => selected.value.includes(b.id)));
		const specRows = [
			{
				key: "brand_name",
				label: "Brand",
				highlight: false
			},
			{
				key: "year",
				label: "Year",
				highlight: false
			},
			{
				key: "type",
				label: "Type",
				highlight: true
			},
			{
				key: "engine_cc",
				label: "Engine (cc)",
				highlight: false
			},
			{
				key: "horsepower",
				label: "Horsepower (hp)",
				highlight: true
			},
			{
				key: "torque",
				label: "Torque (Nm)",
				highlight: false
			},
			{
				key: "transmission",
				label: "Transmission",
				highlight: true
			},
			{
				key: "fuel_capacity",
				label: "Fuel Capacity (L)",
				highlight: false
			},
			{
				key: "weight",
				label: "Weight (kg)",
				highlight: true
			},
			{
				key: "top_speed",
				label: "Top Speed (km/h)",
				highlight: false
			},
			{
				key: "braking",
				label: "Braking System",
				highlight: true
			},
			{
				key: "suspension",
				label: "Suspension",
				highlight: false
			},
			{
				key: "price",
				label: "Price",
				highlight: true
			},
			{
				key: "sale_price",
				label: "Sale Price",
				highlight: false
			},
			{
				key: "colors",
				label: "Available Colors",
				highlight: false
			},
			{
				key: "warranty",
				label: "Warranty",
				highlight: true
			},
			{
				key: "in_stock",
				label: "In Stock",
				highlight: false
			}
		];
		function getSpecValue(bike, key) {
			if (key === "price" || key === "sale_price") {
				const v = bike[key];
				return v ? `KES ${Number(v).toLocaleString()}` : "—";
			}
			if (key === "in_stock") return bike.in_stock ? "Yes" : "No";
			const v = bike[key];
			return v != null && v !== "" ? String(v) : "—";
		}
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Compare <span class="text-brand-red"${_scopeId}>Motorcycles</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Select up to 3 motorcycles to compare side by side.</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Compare "), createVNode("span", { class: "text-brand-red" }, "Motorcycles")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Select up to 3 motorcycles to compare side by side.")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="mt-8 flex flex-wrap gap-3"><!--[-->`);
			ssrRenderList(3, (slot) => {
				_push(`<div class="relative min-w-[200px] flex-1"><select class="input-field w-full appearance-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selected)[slot - 1]) ? ssrLooseContain(unref(selected)[slot - 1], "") : ssrLooseEqual(unref(selected)[slot - 1], "")) ? " selected" : ""}>Select motorcycle ${ssrInterpolate(slot)}</option><!--[-->`);
				ssrRenderList(unref(allMotorcycles), (b) => {
					_push(`<option${ssrRenderAttr("value", b.id)}${ssrIncludeBooleanAttr(unref(selected).includes(b.id) && unref(selected)[slot - 1] !== b.id) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(unref(selected)[slot - 1]) ? ssrLooseContain(unref(selected)[slot - 1], b.id) : ssrLooseEqual(unref(selected)[slot - 1], b.id)) ? " selected" : ""}>${ssrInterpolate(b.brand_name)} ${ssrInterpolate(b.name)} (${ssrInterpolate(b.year)})</option>`);
				});
				_push(`<!--]--></select>`);
				if (unref(selected)[slot - 1]) {
					_push(`<button class="absolute right-2 top-1/2 -translate-y-1/2 text-brand-grey/50 hover:text-brand-red">`);
					_push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
					_push(`</button>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></div>`);
			if (unref(compareList).length >= 2) {
				_push(`<div class="mt-10 overflow-x-auto"><table class="w-full min-w-[600px] border-collapse"><thead><tr class="border-b border-brand-grey/20"><th class="py-3 pr-6 text-left text-xs font-display tracking-display text-brand-grey uppercase w-40">Specification</th><!--[-->`);
				ssrRenderList(unref(compareList), (bike) => {
					_push(`<th class="p-3 text-center"><div class="aspect-[4/3] mb-3 overflow-hidden rounded-sm bg-brand-black">`);
					if (bike.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(bike, bike.images[0]))}${ssrRenderAttr("alt", bike.name)} class="h-full w-full object-cover">`);
					else _push(`<!---->`);
					_push(`</div>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: bikePath(bike),
						class: "font-display text-lg text-white hover:text-brand-red"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(bike.name)}`);
							else return [createTextVNode(toDisplayString(bike.name), 1)];
						}),
						_: 2
					}, _parent));
					_push(`<p class="text-xs text-brand-grey">${ssrInterpolate(bike.brand_name)}</p></th>`);
				});
				_push(`<!--]--></tr></thead><tbody><!--[-->`);
				ssrRenderList(specRows, (row) => {
					_push(`<tr class="${ssrRenderClass([{ "bg-brand-grey/5": row.highlight }, "border-b border-brand-grey/10"])}"><td class="py-3 pr-6 text-sm font-display tracking-display text-brand-grey">${ssrInterpolate(row.label)}</td><!--[-->`);
					ssrRenderList(unref(compareList), (bike) => {
						_push(`<td class="p-3 text-center text-sm text-white">${ssrInterpolate(getSpecValue(bike, row.key))}</td>`);
					});
					_push(`<!--]--></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			} else if (unref(compareList).length === 1) _push(`<div class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-xl tracking-display text-brand-grey">Select at least 2 motorcycles to compare</p></div>`);
			else _push(`<div class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-xl tracking-display text-brand-grey">No Motorcycles Selected</p><p class="mt-2 text-sm text-brand-grey/60">Use the dropdowns above to pick motorcycles for comparison</p></div>`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/motorcycles/compare.vue
var _sfc_setup = compare_vue_vue_type_script_setup_true_lang_default.setup;
compare_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/motorcycles/compare.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var compare_default = compare_vue_vue_type_script_setup_true_lang_default;

export { compare_default as default };
//# sourceMappingURL=compare-BKZtWsWT.mjs.map
