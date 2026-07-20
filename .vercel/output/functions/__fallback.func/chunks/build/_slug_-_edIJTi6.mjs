import { u as useHead$1, b as useRoute$1, N as NuxtLink, n as navigateTo } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Zap, BadgeDollarSign, Heart, Scale } from 'lucide-vue-next';
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

//#region app/pages/motorcycles/[slug].vue?vue&type=script&setup=true&lang.ts
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Motorcycle Details - Nairobi Powerbikes" });
		const pb = usePB();
		useRoute$1();
		const auth = useAuthStore();
		const loading = ref(true);
		const bike = ref(null);
		const related = ref([]);
		const activeImage = ref(0);
		const isFavorited = ref(false);
		const favoriteId = ref("");
		const favoriteLoading = ref(false);
		const specHighlights = [
			{
				key: "engine_cc",
				label: "Engine"
			},
			{
				key: "horsepower",
				label: "Horsepower"
			},
			{
				key: "transmission",
				label: "Transmission"
			},
			{
				key: "top_speed",
				label: "Top Speed"
			},
			{
				key: "weight",
				label: "Weight"
			},
			{
				key: "fuel_capacity",
				label: "Fuel Capacity"
			}
		];
		const fullSpecs = [
			{
				key: "brand_name",
				label: "Brand"
			},
			{
				key: "year",
				label: "Year"
			},
			{
				key: "type",
				label: "Type"
			},
			{
				key: "engine_cc",
				label: "Engine Displacement"
			},
			{
				key: "horsepower",
				label: "Horsepower"
			},
			{
				key: "torque",
				label: "Torque"
			},
			{
				key: "transmission",
				label: "Transmission"
			},
			{
				key: "fuel_capacity",
				label: "Fuel Capacity"
			},
			{
				key: "weight",
				label: "Weight"
			},
			{
				key: "top_speed",
				label: "Top Speed"
			},
			{
				key: "braking",
				label: "Braking System"
			},
			{
				key: "suspension",
				label: "Suspension"
			},
			{
				key: "colors",
				label: "Available Colors"
			},
			{
				key: "warranty",
				label: "Warranty"
			},
			{
				key: "in_stock",
				label: "In Stock"
			}
		];
		function getSpec(key) {
			if (!bike.value) return "—";
			if (key === "price" || key === "sale_price") {
				const v = bike.value[key];
				return v ? `KES ${Number(v).toLocaleString()}` : "—";
			}
			if (key === "in_stock") {
				if (bike.value.status === "coming_soon") return "Coming Soon";
				return bike.value.in_stock ? "Yes" : "No";
			}
			const v = bike.value[key];
			return v != null && v !== "" ? String(v) : "—";
		}
		function bikePath(m) {
			return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`;
		}
		function openTestRide() {
			navigateTo(`/service/test-ride?motorcycle=${bike.value?.id}`);
		}
		function openFinance() {
			navigateTo(`/finance?motorcycle=${bike.value?.id}`);
		}
		function addToCompare() {
			navigateTo("/motorcycles/compare");
		}
		async function toggleFavorite() {
			if (!auth.isAuthenticated || !auth.isCustomer || !bike.value) return;
			favoriteLoading.value = true;
			try {
				if (isFavorited.value && favoriteId.value) {
					await pb.collection("favorites").delete(favoriteId.value);
					isFavorited.value = false;
					favoriteId.value = "";
				} else {
					const record = await pb.collection("favorites").create({
						user: auth.user?.id,
						motorcycle: bike.value.id
					});
					isFavorited.value = true;
					favoriteId.value = record.id;
				}
			} catch (e) {
				console.error(e);
			} finally {
				favoriteLoading.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			if (unref(loading)) {
				_push(`<div class="animate-pulse"><div class="aspect-[16/9] w-full rounded-sm bg-brand-grey/10"></div><div class="mt-6 h-8 w-96 rounded bg-brand-grey/10"></div><div class="mt-3 h-4 w-64 rounded bg-brand-grey/10"></div><div class="mt-8 grid grid-cols-3 gap-4"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="h-16 rounded bg-brand-grey/10"></div>`);
				});
				_push(`<!--]--></div></div>`);
			} else if (unref(bike)) {
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
							_push(`<div class="grid gap-8 lg:grid-cols-2"${_scopeId}><div class="relative overflow-hidden rounded-sm bg-brand-black"${_scopeId}>`);
							if (unref(bike).images?.length) _push(`<div class="aspect-[4/3]"${_scopeId}><img${ssrRenderAttr("src", unref(pb).files.getURL(unref(bike), unref(bike).images[unref(activeImage)]))}${ssrRenderAttr("alt", unref(bike).name)} class="h-full w-full object-cover transition-all duration-300"${_scopeId}></div>`);
							else _push(`<!---->`);
							if (unref(bike).images && unref(bike).images.length > 1) {
								_push(`<div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"${_scopeId}><!--[-->`);
								ssrRenderList(unref(bike).images, (_, idx) => {
									_push(`<button class="${ssrRenderClass([idx === unref(activeImage) ? "bg-brand-red w-6" : "bg-white/50 hover:bg-white/80", "h-2 w-2 rounded-full transition-all"])}"${_scopeId}></button>`);
								});
								_push(`<!--]--></div>`);
							} else _push(`<!---->`);
							if (unref(bike).status === "coming_soon") _push(`<div class="absolute top-3 left-3 rounded-sm bg-amber-500 px-3 py-1 text-xs font-display tracking-display text-white uppercase"${_scopeId}>Coming Soon</div>`);
							else if (unref(bike).new_arrival) _push(`<div class="absolute top-3 left-3 rounded-sm bg-brand-red px-3 py-1 text-xs font-display tracking-display text-white uppercase"${_scopeId}>New Arrival</div>`);
							else _push(`<!---->`);
							if (unref(bike).sale_price) _push(`<div class="absolute top-3 right-3 rounded-sm bg-green-600 px-3 py-1 text-xs font-display tracking-display text-white uppercase"${_scopeId}>Sale</div>`);
							else _push(`<!---->`);
							_push(`</div><div${_scopeId}><p class="font-display text-sm tracking-display text-brand-red uppercase"${_scopeId}>${ssrInterpolate(unref(bike).brand_name)}</p><h1 class="font-bold text-5xl leading-[1.1] text-white"${_scopeId}>${ssrInterpolate(unref(bike).name)}</h1><p class="mt-1 text-sm text-brand-grey"${_scopeId}>${ssrInterpolate(unref(bike).year)} · ${ssrInterpolate(unref(bike).engine_cc)}cc · ${ssrInterpolate(unref(bike).type)}</p><div class="mt-4 flex items-baseline gap-3"${_scopeId}><p class="text-3xl font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate((unref(bike).sale_price || unref(bike).price).toLocaleString())}</p>`);
							if (unref(bike).sale_price) _push(`<p class="text-lg font-bold text-brand-grey/60 line-through"${_scopeId}>KES ${ssrInterpolate(Number(unref(bike).price).toLocaleString())}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if (unref(bike).description) _push(`<p class="mt-6 leading-relaxed text-brand-grey"${_scopeId}>${ssrInterpolate(unref(bike).description)}</p>`);
							else _push(`<!---->`);
							_push(`<div class="mt-6 grid grid-cols-2 gap-3 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5"${_scopeId}><!--[-->`);
							ssrRenderList(specHighlights, (s) => {
								_push(`<div class="text-center"${_scopeId}><p class="text-xs font-display tracking-display text-brand-grey uppercase"${_scopeId}>${ssrInterpolate(s.label)}</p><p class="text-lg font-display text-white"${_scopeId}>${ssrInterpolate(getSpec(s.key))}</p></div>`);
							});
							_push(`<!--]--></div><div class="mt-6 flex flex-wrap gap-3"${_scopeId}>`);
							if (unref(bike).status !== "sold" && unref(bike).status !== "coming_soon") {
								_push(`<button class="btn-primary"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Zap), { class: "h-5 w-5" }, null, _parent, _scopeId));
								_push(`Book Test Ride</button>`);
							} else _push(`<!---->`);
							_push(`<button class="btn-secondary"${_scopeId}>`);
							_push(ssrRenderComponent(unref(BadgeDollarSign), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`Finance Options</button>`);
							if (unref(auth).isAuthenticated && unref(auth).isCustomer) {
								_push(`<button class="${ssrRenderClass([{ "text-brand-red": unref(isFavorited) }, "btn-ghost"])}"${ssrIncludeBooleanAttr(unref(favoriteLoading)) ? " disabled" : ""}${_scopeId}>`);
								_push(ssrRenderComponent(unref(Heart), { class: ["h-5 w-5", { "fill-brand-red": unref(isFavorited) }] }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(isFavorited) ? "Saved" : "Save")}</button>`);
							} else _push(`<!---->`);
							_push(`<button class="btn-ghost"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Scale), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`Compare</button></div></div></div>`);
						} else return [createVNode("div", { class: "grid gap-8 lg:grid-cols-2" }, [createVNode("div", { class: "relative overflow-hidden rounded-sm bg-brand-black" }, [
							unref(bike).images?.length ? (openBlock(), createBlock("div", {
								key: 0,
								class: "aspect-[4/3]"
							}, [createVNode("img", {
								src: unref(pb).files.getURL(unref(bike), unref(bike).images[unref(activeImage)]),
								alt: unref(bike).name,
								class: "h-full w-full object-cover transition-all duration-300"
							}, null, 8, ["src", "alt"])])) : createCommentVNode("", true),
							unref(bike).images && unref(bike).images.length > 1 ? (openBlock(), createBlock("div", {
								key: 1,
								class: "absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(bike).images, (_, idx) => {
								return openBlock(), createBlock("button", {
									key: idx,
									class: ["h-2 w-2 rounded-full transition-all", idx === unref(activeImage) ? "bg-brand-red w-6" : "bg-white/50 hover:bg-white/80"],
									onClick: ($event) => activeImage.value = idx
								}, null, 10, ["onClick"]);
							}), 128))])) : createCommentVNode("", true),
							unref(bike).status === "coming_soon" ? (openBlock(), createBlock("div", {
								key: 2,
								class: "absolute top-3 left-3 rounded-sm bg-amber-500 px-3 py-1 text-xs font-display tracking-display text-white uppercase"
							}, "Coming Soon")) : unref(bike).new_arrival ? (openBlock(), createBlock("div", {
								key: 3,
								class: "absolute top-3 left-3 rounded-sm bg-brand-red px-3 py-1 text-xs font-display tracking-display text-white uppercase"
							}, "New Arrival")) : createCommentVNode("", true),
							unref(bike).sale_price ? (openBlock(), createBlock("div", {
								key: 4,
								class: "absolute top-3 right-3 rounded-sm bg-green-600 px-3 py-1 text-xs font-display tracking-display text-white uppercase"
							}, "Sale")) : createCommentVNode("", true)
						]), createVNode("div", null, [
							createVNode("p", { class: "font-display text-sm tracking-display text-brand-red uppercase" }, toDisplayString(unref(bike).brand_name), 1),
							createVNode("h1", { class: "font-bold text-5xl leading-[1.1] text-white" }, toDisplayString(unref(bike).name), 1),
							createVNode("p", { class: "mt-1 text-sm text-brand-grey" }, toDisplayString(unref(bike).year) + " · " + toDisplayString(unref(bike).engine_cc) + "cc · " + toDisplayString(unref(bike).type), 1),
							createVNode("div", { class: "mt-4 flex items-baseline gap-3" }, [createVNode("p", { class: "text-3xl font-bold text-brand-red" }, "KES " + toDisplayString((unref(bike).sale_price || unref(bike).price).toLocaleString()), 1), unref(bike).sale_price ? (openBlock(), createBlock("p", {
								key: 0,
								class: "text-lg font-bold text-brand-grey/60 line-through"
							}, "KES " + toDisplayString(Number(unref(bike).price).toLocaleString()), 1)) : createCommentVNode("", true)]),
							unref(bike).description ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-6 leading-relaxed text-brand-grey"
							}, toDisplayString(unref(bike).description), 1)) : createCommentVNode("", true),
							createVNode("div", { class: "mt-6 grid grid-cols-2 gap-3 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5" }, [(openBlock(), createBlock(Fragment, null, renderList(specHighlights, (s) => {
								return createVNode("div", {
									key: s.key,
									class: "text-center"
								}, [createVNode("p", { class: "text-xs font-display tracking-display text-brand-grey uppercase" }, toDisplayString(s.label), 1), createVNode("p", { class: "text-lg font-display text-white" }, toDisplayString(getSpec(s.key)), 1)]);
							}), 64))]),
							createVNode("div", { class: "mt-6 flex flex-wrap gap-3" }, [
								unref(bike).status !== "sold" && unref(bike).status !== "coming_soon" ? (openBlock(), createBlock("button", {
									key: 0,
									class: "btn-primary",
									onClick: openTestRide
								}, [createVNode(unref(Zap), { class: "h-5 w-5" }), createTextVNode("Book Test Ride")])) : createCommentVNode("", true),
								createVNode("button", {
									class: "btn-secondary",
									onClick: openFinance
								}, [createVNode(unref(BadgeDollarSign), { class: "h-5 w-5" }), createTextVNode("Finance Options")]),
								unref(auth).isAuthenticated && unref(auth).isCustomer ? (openBlock(), createBlock("button", {
									key: 1,
									class: ["btn-ghost", { "text-brand-red": unref(isFavorited) }],
									onClick: toggleFavorite,
									disabled: unref(favoriteLoading)
								}, [createVNode(unref(Heart), { class: ["h-5 w-5", { "fill-brand-red": unref(isFavorited) }] }, null, 8, ["class"]), createTextVNode(toDisplayString(unref(isFavorited) ? "Saved" : "Save"), 1)], 10, ["disabled"])) : createCommentVNode("", true),
								createVNode("button", {
									class: "btn-ghost",
									onClick: addToCompare
								}, [createVNode(unref(Scale), { class: "h-5 w-5" }), createTextVNode("Compare")])
							])
						])])];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(unref(motion).div, {
					class: "mt-12",
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: {
						delay: .3,
						duration: .5
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<h2 class="font-display text-display-md leading-[var(--leading-display)] text-white"${_scopeId}>Full Specifications</h2><div class="mt-6 rounded-sm border border-brand-grey/10"${_scopeId}><table class="w-full"${_scopeId}><tbody${_scopeId}><!--[-->`);
							ssrRenderList(fullSpecs, (spec, i) => {
								_push(`<tr class="${ssrRenderClass([{ "bg-brand-grey/5": i % 2 === 0 }, "border-b border-brand-grey/10 last:border-b-0"])}"${_scopeId}><td class="px-5 py-3 text-sm font-display tracking-display text-brand-grey w-1/3"${_scopeId}>${ssrInterpolate(spec.label)}</td><td class="px-5 py-3 text-sm text-white"${_scopeId}>${ssrInterpolate(getSpec(spec.key))}</td></tr>`);
							});
							_push(`<!--]--></tbody></table></div>`);
						} else return [createVNode("h2", { class: "font-display text-display-md leading-[var(--leading-display)] text-white" }, "Full Specifications"), createVNode("div", { class: "mt-6 rounded-sm border border-brand-grey/10" }, [createVNode("table", { class: "w-full" }, [createVNode("tbody", null, [(openBlock(), createBlock(Fragment, null, renderList(fullSpecs, (spec, i) => {
							return createVNode("tr", {
								key: spec.key,
								class: ["border-b border-brand-grey/10 last:border-b-0", { "bg-brand-grey/5": i % 2 === 0 }]
							}, [createVNode("td", { class: "px-5 py-3 text-sm font-display tracking-display text-brand-grey w-1/3" }, toDisplayString(spec.label), 1), createVNode("td", { class: "px-5 py-3 text-sm text-white" }, toDisplayString(getSpec(spec.key)), 1)], 2);
						}), 64))])])])];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(unref(motion).div, {
					class: "mt-12",
					initial: {
						opacity: 0,
						y: 30
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						delay: .4,
						duration: .5
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<h2 class="font-display text-display-md leading-[var(--leading-display)] text-white"${_scopeId}>Related Motorcycles</h2>`);
							if (unref(related).length) {
								_push(`<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
								ssrRenderList(unref(related), (r) => {
									_push(ssrRenderComponent(_component_NuxtLink, {
										key: r.id,
										to: bikePath(r)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40"${_scopeId}><div class="aspect-[4/3] overflow-hidden bg-brand-black"${_scopeId}>`);
												if (r.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(r, r.images[0]))}${ssrRenderAttr("alt", r.name)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"${_scopeId}>`);
												else _push(`<!---->`);
												_push(`</div><div class="p-3"${_scopeId}><p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase"${_scopeId}>${ssrInterpolate(r.brand_name)}</p><h3 class="font-bold text-base text-white"${_scopeId}>${ssrInterpolate(r.name)}</h3><p class="text-xs font-bold text-brand-red"${_scopeId}>KES ${ssrInterpolate(Number(r.price).toLocaleString())}</p></div></div>`);
											} else return [createVNode("div", { class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40" }, [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black" }, [r.images?.length ? (openBlock(), createBlock("img", {
												key: 0,
												src: unref(pb).files.getURL(r, r.images[0]),
												alt: r.name,
												class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
											}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-3" }, [
												createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(r.brand_name), 1),
												createVNode("h3", { class: "font-bold text-base text-white" }, toDisplayString(r.name), 1),
												createVNode("p", { class: "text-xs font-bold text-brand-red" }, "KES " + toDisplayString(Number(r.price).toLocaleString()), 1)
											])])];
										}),
										_: 2
									}, _parent, _scopeId));
								});
								_push(`<!--]--></div>`);
							} else _push(`<!---->`);
						} else return [createVNode("h2", { class: "font-display text-display-md leading-[var(--leading-display)] text-white" }, "Related Motorcycles"), unref(related).length ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(related), (r) => {
							return openBlock(), createBlock(_component_NuxtLink, {
								key: r.id,
								to: bikePath(r)
							}, {
								default: withCtx(() => [createVNode("div", { class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40" }, [createVNode("div", { class: "aspect-[4/3] overflow-hidden bg-brand-black" }, [r.images?.length ? (openBlock(), createBlock("img", {
									key: 0,
									src: unref(pb).files.getURL(r, r.images[0]),
									alt: r.name,
									class: "h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
								}, null, 8, ["src", "alt"])) : createCommentVNode("", true)]), createVNode("div", { class: "p-3" }, [
									createVNode("p", { class: "text-[10px] font-display tracking-display text-brand-grey/60 uppercase" }, toDisplayString(r.brand_name), 1),
									createVNode("h3", { class: "font-bold text-base text-white" }, toDisplayString(r.name), 1),
									createVNode("p", { class: "text-xs font-bold text-brand-red" }, "KES " + toDisplayString(Number(r.price).toLocaleString()), 1)
								])])]),
								_: 2
							}, 1032, ["to"]);
						}), 128))])) : createCommentVNode("", true)];
					}),
					_: 1
				}, _parent));
				_push(`<!--]-->`);
			} else {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center"><p class="font-display text-2xl tracking-display text-brand-grey">Motorcycle Not Found</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/motorcycles",
					class: "btn-primary mt-6 inline-flex"
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
//#region app/pages/motorcycles/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/motorcycles/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;

export { _slug__default as default };
//# sourceMappingURL=_slug_-_edIJTi6.mjs.map
