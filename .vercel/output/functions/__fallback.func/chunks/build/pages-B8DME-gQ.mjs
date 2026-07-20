import { u as useHead$1, _ as _plugin_vue_export_helper_default, N as NuxtLink, C as ClientOnly } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, unref, mergeProps, withCtx, createVNode, createTextVNode, ref, computed, openBlock, createBlock, Fragment, renderList, createCommentVNode, toDisplayString, resolveDynamicComponent, withModifiers, withDirectives, isRef, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderVNode, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { ArrowRight, Calendar, ShieldCheck, BadgeDollarSign, Wrench, Package, LoaderCircle, CalendarCheck, Mail, Send, MapPin, Phone, Clock } from 'lucide-vue-next';
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
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

//#region app/components/home/HeroSection.vue?vue&type=script&setup=true&lang.ts
var HeroSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "HeroSection",
	__ssrInlineRender: true,
	setup(__props) {
		const pb = usePB();
		ref(null);
		const tickerDuration = ref(30);
		const heroImages = ref([]);
		const currentImage = ref(0);
		ref(false);
		const desktopHovered = ref(false);
		const fallbackImages = [
			"tekken.jpg",
			"tekken-2.jpeg",
			"tekken-3.jpg",
			"taro.jpg",
			"qj-motor.jpeg"
		];
		const bikeImageUrls = computed(() => {
			if (heroImages.value.length) return heroImages.value.map((h) => pb.files.getURL(h, h.image, { thumb: "0x800" }));
			return fallbackImages.map((f) => `/images/bikes/${f}`);
		});
		const featuredBikes = ref([]);
		function formatPrice(amount) {
			return amount.toLocaleString("en-KE");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "relative h-screen w-full overflow-hidden" }, _attrs))} data-v-6c77e91d><div class="absolute inset-0 lg:hidden" data-v-6c77e91d><!--[-->`);
			ssrRenderList(unref(bikeImageUrls), (url, i) => {
				_push(`<img${ssrRenderAttr("src", url)} class="${ssrRenderClass([i === unref(currentImage) ? "opacity-100" : "opacity-0", "absolute inset-0 h-full w-full object-cover transition-opacity duration-700"])}"${ssrRenderAttr("alt", `Bike ${i + 1}`)} data-v-6c77e91d>`);
			});
			_push(`<!--]--><div class="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/50 to-brand-black/80" data-v-6c77e91d></div></div><div class="asphalt-grid absolute inset-0 bg-brand-black max-lg:hidden" data-v-6c77e91d></div><div class="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8" data-v-6c77e91d><div class="flex flex-1 flex-col items-center justify-center gap-8 text-center lg:flex-row lg:text-left lg:items-center" data-v-6c77e91d>`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "z-20 w-full lg:w-1/2 lg:pr-12",
				initial: {
					opacity: 0,
					x: -60
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					duration: .8,
					ease: "easeOut"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(motion).p, {
							class: "mb-2 font-display text-sm tracking-[0.3em] text-red-400 lg:text-brand-red",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .2,
								duration: .5
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` NAIROBI&#39;S PREMIER MOTO DEALERSHIP `);
								else return [createTextVNode(" NAIROBI'S PREMIER MOTO DEALERSHIP ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(motion).h1, {
							class: "font-heading text-6xl text-white sm:text-[6rem] lg:text-[7rem] xl:text-[8rem]",
							initial: {
								opacity: 0,
								y: 40
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .4,
								duration: .6
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` RIDE THE <br data-v-6c77e91d${_scopeId}><span class="text-brand-red" data-v-6c77e91d${_scopeId}>POWER</span>`);
								else return [
									createTextVNode(" RIDE THE "),
									createVNode("br"),
									createVNode("span", { class: "text-brand-red" }, "POWER")
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(motion).p, {
							class: "mx-auto mt-4 max-w-md font-display text-lg tracking-display text-gray-300 lg:text-brand-grey lg:mx-0",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .6,
								duration: .5
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Explore Nairobi&#39;s finest collection of performance motorcycles. From street machines to adventure tourers — find your next ride. `);
								else return [createTextVNode(" Explore Nairobi's finest collection of performance motorcycles. From street machines to adventure tourers — find your next ride. ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(motion).div, {
							class: "mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .8,
								duration: .5
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_component_NuxtLink, {
										to: "/motorcycles",
										class: "btn-primary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(ArrowRight), { class: "h-5 w-5" }, null, _parent, _scopeId));
												_push(` Browse Motorcycles `);
											} else return [createVNode(unref(ArrowRight), { class: "h-5 w-5" }), createTextVNode(" Browse Motorcycles ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_NuxtLink, {
										to: "/service/test-ride",
										class: "btn-secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5" }, null, _parent, _scopeId));
												_push(` Book a Test Ride `);
											} else return [createVNode(unref(Calendar), { class: "h-5 w-5" }), createTextVNode(" Book a Test Ride ")];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(_component_NuxtLink, {
									to: "/motorcycles",
									class: "btn-primary"
								}, {
									default: withCtx(() => [createVNode(unref(ArrowRight), { class: "h-5 w-5" }), createTextVNode(" Browse Motorcycles ")]),
									_: 1
								}), createVNode(_component_NuxtLink, {
									to: "/service/test-ride",
									class: "btn-secondary"
								}, {
									default: withCtx(() => [createVNode(unref(Calendar), { class: "h-5 w-5" }), createTextVNode(" Book a Test Ride ")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(motion).p, {
							class: "mb-2 font-display text-sm tracking-[0.3em] text-red-400 lg:text-brand-red",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .2,
								duration: .5
							}
						}, {
							default: withCtx(() => [createTextVNode(" NAIROBI'S PREMIER MOTO DEALERSHIP ")]),
							_: 1
						}),
						createVNode(unref(motion).h1, {
							class: "font-heading text-6xl text-white sm:text-[6rem] lg:text-[7rem] xl:text-[8rem]",
							initial: {
								opacity: 0,
								y: 40
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .4,
								duration: .6
							}
						}, {
							default: withCtx(() => [
								createTextVNode(" RIDE THE "),
								createVNode("br"),
								createVNode("span", { class: "text-brand-red" }, "POWER")
							]),
							_: 1
						}),
						createVNode(unref(motion).p, {
							class: "mx-auto mt-4 max-w-md font-display text-lg tracking-display text-gray-300 lg:text-brand-grey lg:mx-0",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .6,
								duration: .5
							}
						}, {
							default: withCtx(() => [createTextVNode(" Explore Nairobi's finest collection of performance motorcycles. From street machines to adventure tourers — find your next ride. ")]),
							_: 1
						}),
						createVNode(unref(motion).div, {
							class: "mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start",
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .8,
								duration: .5
							}
						}, {
							default: withCtx(() => [createVNode(_component_NuxtLink, {
								to: "/motorcycles",
								class: "btn-primary"
							}, {
								default: withCtx(() => [createVNode(unref(ArrowRight), { class: "h-5 w-5" }), createTextVNode(" Browse Motorcycles ")]),
								_: 1
							}), createVNode(_component_NuxtLink, {
								to: "/service/test-ride",
								class: "btn-secondary"
							}, {
								default: withCtx(() => [createVNode(unref(Calendar), { class: "h-5 w-5" }), createTextVNode(" Book a Test Ride ")]),
								_: 1
							})]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="relative hidden w-full lg:block lg:w-1/2 lg:h-[70vh]" data-v-6c77e91d>`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "relative h-full w-full",
				initial: {
					opacity: 0,
					y: 40,
					scale: .96
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				transition: {
					duration: .7,
					ease: "easeOut"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="relative h-full w-full" data-v-6c77e91d${_scopeId}>`);
						_push(ssrRenderComponent(unref(motion).div, {
							class: "absolute inset-0 bg-black",
							animate: {
								x: unref(desktopHovered) ? 28 : 20,
								y: unref(desktopHovered) ? 28 : 20
							},
							transition: {
								duration: .35,
								ease: "easeOut"
							}
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(motion).div, {
							class: "relative h-full w-full border-[12px] border-[#E30613] overflow-hidden",
							animate: { y: unref(desktopHovered) ? -10 : 0 },
							transition: {
								duration: .35,
								ease: "easeOut"
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="relative h-full w-full overflow-hidden" data-v-6c77e91d${_scopeId}><!--[-->`);
									ssrRenderList(unref(bikeImageUrls), (url, i) => {
										_push(`<img${ssrRenderAttr("src", url)} class="${ssrRenderClass([[i === unref(currentImage) ? "opacity-100" : "opacity-0", unref(desktopHovered) ? "scale-[1.03]" : "scale-100"], "absolute inset-0 h-full w-full object-cover transition-all duration-[350ms] ease-out"])}"${ssrRenderAttr("alt", `Bike ${i + 1}`)} data-v-6c77e91d${_scopeId}>`);
									});
									_push(`<!--]--></div>`);
								} else return [createVNode("div", { class: "relative h-full w-full overflow-hidden" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(bikeImageUrls), (url, i) => {
									return openBlock(), createBlock("img", {
										key: i,
										src: url,
										class: ["absolute inset-0 h-full w-full object-cover transition-all duration-[350ms] ease-out", [i === unref(currentImage) ? "opacity-100" : "opacity-0", unref(desktopHovered) ? "scale-[1.03]" : "scale-100"]],
										alt: `Bike ${i + 1}`
									}, null, 10, ["src", "alt"]);
								}), 128))])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<div class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2" data-v-6c77e91d${_scopeId}><!--[-->`);
						ssrRenderList(unref(bikeImageUrls), (url, i) => {
							_push(`<button class="${ssrRenderClass([i === unref(currentImage) ? "w-6 bg-[#E30613]" : "w-2 bg-white/40 hover:bg-white/70", "h-2 transition-all duration-300"])}"${ssrRenderAttr("aria-label", `Go to slide ${i + 1}`)} data-v-6c77e91d${_scopeId}></button>`);
						});
						_push(`<!--]--></div></div>`);
					} else return [createVNode("div", { class: "relative h-full w-full" }, [
						createVNode(unref(motion).div, {
							class: "absolute inset-0 bg-black",
							animate: {
								x: unref(desktopHovered) ? 28 : 20,
								y: unref(desktopHovered) ? 28 : 20
							},
							transition: {
								duration: .35,
								ease: "easeOut"
							}
						}, null, 8, ["animate"]),
						createVNode(unref(motion).div, {
							class: "relative h-full w-full border-[12px] border-[#E30613] overflow-hidden",
							animate: { y: unref(desktopHovered) ? -10 : 0 },
							transition: {
								duration: .35,
								ease: "easeOut"
							}
						}, {
							default: withCtx(() => [createVNode("div", { class: "relative h-full w-full overflow-hidden" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(bikeImageUrls), (url, i) => {
								return openBlock(), createBlock("img", {
									key: i,
									src: url,
									class: ["absolute inset-0 h-full w-full object-cover transition-all duration-[350ms] ease-out", [i === unref(currentImage) ? "opacity-100" : "opacity-0", unref(desktopHovered) ? "scale-[1.03]" : "scale-100"]],
									alt: `Bike ${i + 1}`
								}, null, 10, ["src", "alt"]);
							}), 128))])]),
							_: 1
						}, 8, ["animate"]),
						createVNode("div", { class: "absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(bikeImageUrls), (url, i) => {
							return openBlock(), createBlock("button", {
								key: i,
								class: ["h-2 transition-all duration-300", i === unref(currentImage) ? "w-6 bg-[#E30613]" : "w-2 bg-white/40 hover:bg-white/70"],
								onClick: ($event) => currentImage.value = i,
								"aria-label": `Go to slide ${i + 1}`
							}, null, 10, ["onClick", "aria-label"]);
						}), 128))])
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div><div class="absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:hidden" data-v-6c77e91d><!--[-->`);
			ssrRenderList(unref(bikeImageUrls), (url, i) => {
				_push(`<button class="${ssrRenderClass([i === unref(currentImage) ? "w-6 bg-brand-red" : "w-2 bg-white/40 hover:bg-white/70", "h-2 rounded-full transition-all duration-300"])}"${ssrRenderAttr("aria-label", `Go to slide ${i + 1}`)} data-v-6c77e91d></button>`);
			});
			_push(`<!--]--></div><div class="absolute bottom-0 left-0 right-0 z-20 border-t border-brand-grey/10 bg-brand-black/80 backdrop-blur-md" data-v-6c77e91d><div class="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8" data-v-6c77e91d><div class="flex whitespace-nowrap py-4" data-v-6c77e91d><div class="flex animate-marquee gap-16" style="${ssrRenderStyle({ animationDuration: `${unref(tickerDuration)}s` })}" data-v-6c77e91d><!--[-->`);
			ssrRenderList([...unref(featuredBikes), ...unref(featuredBikes)], (bike, i) => {
				_push(`<div class="flex items-center gap-6" data-v-6c77e91d><span class="font-display text-lg tracking-display text-white" data-v-6c77e91d>${ssrInterpolate(bike.name)}</span><span class="text-sm text-brand-grey" data-v-6c77e91d>${ssrInterpolate(bike.cc)}cc</span><span class="h-4 w-px bg-brand-grey/20" data-v-6c77e91d></span><span class="text-lg font-bold text-brand-red" data-v-6c77e91d>KSh ${ssrInterpolate(formatPrice(bike.price))}</span><span class="h-4 w-px bg-brand-grey/20" data-v-6c77e91d></span></div>`);
			});
			_push(`<!--]--></div></div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/home/HeroSection.vue
var _sfc_setup$7 = HeroSection_vue_vue_type_script_setup_true_lang_default.setup;
HeroSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HeroSection.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var HeroSection_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(HeroSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6c77e91d"]]), { __name: "HeroSection" });
//#endregion
//#region app/components/home/FeaturedBikes.vue?vue&type=script&setup=true&lang.ts
var FeaturedBikes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "FeaturedBikes",
	__ssrInlineRender: true,
	setup(__props) {
		const pb = usePB();
		const loading = ref(true);
		const bikes = ref([]);
		function bikePath(b) {
			return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`;
		}
		function formatPrice(amount) {
			return amount.toLocaleString("en-KE");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-brand-black py-20" }, _attrs))}><div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mb-16 text-center",
				initial: {
					opacity: 0,
					y: 40
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Featured <span class="text-brand-red"${_scopeId}>Machines</span></h2><div class="mx-auto mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Hand-picked motorcycles ready to conquer Nairobi&#39;s streets</p>`);
					else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Featured "), createVNode("span", { class: "text-brand-red" }, "Machines")]),
						createVNode("div", { class: "mx-auto mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Hand-picked motorcycles ready to conquer Nairobi's streets")
					];
				}),
				_: 1
			}, _parent));
			if (unref(loading)) {
				_push(`<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (i) => {
					_push(`<div class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80"><div class="aspect-[4/5] animate-pulse bg-zinc-800/50"></div><div class="space-y-4 p-6"><div class="h-3 w-20 animate-pulse rounded bg-zinc-800/50"></div><div class="h-6 w-3/4 animate-pulse rounded bg-zinc-800/50"></div><div class="h-4 w-full animate-pulse rounded bg-zinc-800/50"></div><div class="h-4 w-2/3 animate-pulse rounded bg-zinc-800/50"></div><div class="h-8 w-1/2 animate-pulse rounded bg-zinc-800/50"></div></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(bikes).length) {
				_push(`<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(bikes), (bike, index) => {
					_push(ssrRenderComponent(unref(motion).div, {
						key: bike.id,
						class: "group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:-translate-y-2 hover:border-brand-red/60 hover:shadow-2xl hover:shadow-brand-red/10",
						initial: {
							opacity: 0,
							y: 40
						},
						"while-in-view": {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							margin: "-50px"
						},
						transition: {
							delay: index * .1,
							duration: .5
						}
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="aspect-[4/5] overflow-hidden bg-zinc-900 relative"${_scopeId}>`);
								if (bike.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(bike, bike.images[0]))}${ssrRenderAttr("alt", bike.name)} class="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"${_scopeId}>`);
								else _push(`<div class="flex h-full w-full items-center justify-center bg-zinc-900"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-600"${_scopeId}><circle cx="5.5" cy="17.5" r="3.5"${_scopeId}></circle><circle cx="18.5" cy="17.5" r="3.5"${_scopeId}></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4"${_scopeId}></path><line x1="15" y1="6" x2="18.5" y2="17.5"${_scopeId}></line></svg></div>`);
								if (bike.sale_price || bike.offer_price) _push(`<div class="absolute top-3 right-3 rounded-sm bg-green-600 px-2 py-1 text-[10px] font-display tracking-display text-white uppercase"${_scopeId}>Sale</div>`);
								else _push(`<!---->`);
								_push(`</div><div class="flex flex-col gap-5 p-6"${_scopeId}><p class="text-xs uppercase tracking-widest text-zinc-500"${_scopeId}>${ssrInterpolate(bike.expand?.brand?.name || bike.brand || "Motorcycle")}</p><h3 class="text-3xl font-bold text-white"${_scopeId}>${ssrInterpolate(bike.name)}</h3>`);
								if (bike.description) _push(`<p class="line-clamp-2 text-sm leading-relaxed text-zinc-400"${_scopeId}>${ssrInterpolate(bike.description)}</p>`);
								else _push(`<!---->`);
								_push(`<p class="text-2xl font-bold text-brand-red"${_scopeId}>KSh ${ssrInterpolate(formatPrice(bike.sale_price || bike.offer_price || bike.price))}</p>`);
								if (bike.sale_price || bike.offer_price) _push(`<p class="-mt-3 text-sm text-zinc-500 line-through"${_scopeId}>KSh ${ssrInterpolate(formatPrice(bike.price))}</p>`);
								else _push(`<!---->`);
								_push(ssrRenderComponent(_component_NuxtLink, {
									to: bikePath(bike),
									class: "mt-auto rounded-xl bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 group-hover:shadow-lg group-hover:shadow-brand-red/20"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(` View Details `);
											_push(ssrRenderComponent(unref(ArrowRight), { class: "ml-1.5 inline-block h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" }, null, _parent, _scopeId));
										} else return [createTextVNode(" View Details "), createVNode(unref(ArrowRight), { class: "ml-1.5 inline-block h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" })];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "aspect-[4/5] overflow-hidden bg-zinc-900 relative" }, [bike.images?.length ? (openBlock(), createBlock("img", {
								key: 0,
								src: unref(pb).files.getURL(bike, bike.images[0]),
								alt: bike.name,
								class: "h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
							}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
								key: 1,
								class: "flex h-full w-full items-center justify-center bg-zinc-900"
							}, [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "40",
								height: "40",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "1",
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								class: "text-zinc-600"
							}, [
								createVNode("circle", {
									cx: "5.5",
									cy: "17.5",
									r: "3.5"
								}),
								createVNode("circle", {
									cx: "18.5",
									cy: "17.5",
									r: "3.5"
								}),
								createVNode("path", { d: "M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4" }),
								createVNode("line", {
									x1: "15",
									y1: "6",
									x2: "18.5",
									y2: "17.5"
								})
							]))])), bike.sale_price || bike.offer_price ? (openBlock(), createBlock("div", {
								key: 2,
								class: "absolute top-3 right-3 rounded-sm bg-green-600 px-2 py-1 text-[10px] font-display tracking-display text-white uppercase"
							}, "Sale")) : createCommentVNode("", true)]), createVNode("div", { class: "flex flex-col gap-5 p-6" }, [
								createVNode("p", { class: "text-xs uppercase tracking-widest text-zinc-500" }, toDisplayString(bike.expand?.brand?.name || bike.brand || "Motorcycle"), 1),
								createVNode("h3", { class: "text-3xl font-bold text-white" }, toDisplayString(bike.name), 1),
								bike.description ? (openBlock(), createBlock("p", {
									key: 0,
									class: "line-clamp-2 text-sm leading-relaxed text-zinc-400"
								}, toDisplayString(bike.description), 1)) : createCommentVNode("", true),
								createVNode("p", { class: "text-2xl font-bold text-brand-red" }, "KSh " + toDisplayString(formatPrice(bike.sale_price || bike.offer_price || bike.price)), 1),
								bike.sale_price || bike.offer_price ? (openBlock(), createBlock("p", {
									key: 1,
									class: "-mt-3 text-sm text-zinc-500 line-through"
								}, "KSh " + toDisplayString(formatPrice(bike.price)), 1)) : createCommentVNode("", true),
								createVNode(_component_NuxtLink, {
									to: bikePath(bike),
									class: "mt-auto rounded-xl bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 group-hover:shadow-lg group-hover:shadow-brand-red/20"
								}, {
									default: withCtx(() => [createTextVNode(" View Details "), createVNode(unref(ArrowRight), { class: "ml-1.5 inline-block h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" })]),
									_: 1
								}, 8, ["to"])
							])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="rounded-sm border border-zinc-800 p-16 text-center"><p class="font-display text-2xl tracking-display text-zinc-400">No featured machines yet</p><p class="mt-2 text-sm text-zinc-600">Check back soon for our latest arrivals</p></div>`);
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/components/home/FeaturedBikes.vue
var _sfc_setup$6 = FeaturedBikes_vue_vue_type_script_setup_true_lang_default.setup;
FeaturedBikes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedBikes.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var FeaturedBikes_default = Object.assign(FeaturedBikes_vue_vue_type_script_setup_true_lang_default, { __name: "FeaturedBikes" });
//#endregion
//#region app/components/home/BrandsSection.vue?vue&type=script&setup=true&lang.ts
var BrandsSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BrandsSection",
	__ssrInlineRender: true,
	setup(__props) {
		const pb = usePB();
		const loading = ref(true);
		const brands = ref([]);
		const excludedBrands = [
			"BMW",
			"Ducati",
			"Honda",
			"Suzuki",
			"Yamaha"
		];
		const displayBrands = computed(() => brands.value.filter((b) => !excludedBrands.includes(b.name)));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "carbon-fiber py-20 overflow-hidden" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mb-12 text-center",
				initial: {
					opacity: 0,
					y: 40
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Our <span class="text-brand-red"${_scopeId}>Brands</span></h2><div class="mx-auto mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Trusted names in performance motorcycling</p>`);
					else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Our "), createVNode("span", { class: "text-brand-red" }, "Brands")]),
						createVNode("div", { class: "mx-auto mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Trusted names in performance motorcycling")
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) {
				_push(`<div class="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:flex lg:flex-nowrap lg:justify-center lg:gap-6"><!--[-->`);
				ssrRenderList(5, (i) => {
					_push(`<div class="h-28 animate-pulse rounded-sm border border-brand-grey/20 bg-brand-grey/5 lg:h-32 lg:w-48"></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6 lg:flex lg:flex-nowrap lg:justify-center lg:gap-10"><!--[-->`);
				ssrRenderList(unref(displayBrands), (brand) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: brand.id,
						to: `/brands/${brand.slug || brand.id}`,
						class: "group flex h-28 flex-col items-center justify-center rounded-sm border border-brand-grey/20 bg-brand-black/50 p-4 transition-all duration-300 hover:border-brand-red hover:bg-brand-black hover:shadow-lg hover:shadow-brand-red/5 sm:p-5 lg:h-32 lg:w-48"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								if (brand.logo) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(brand, brand.logo))}${ssrRenderAttr("alt", brand.name)} class="mb-2 h-11 max-w-full object-contain transition-all duration-300 group-hover:scale-110 sm:h-14"${_scopeId}>`);
								else _push(`<span class="mb-2 font-display text-2xl tracking-display text-brand-grey/60 transition-colors duration-300 group-hover:text-brand-red sm:text-3xl"${_scopeId}>${ssrInterpolate(brand.name.slice(0, 2).toUpperCase())}</span>`);
								_push(`<span class="text-center font-display text-xs tracking-display text-brand-light transition-colors duration-300 group-hover:text-white sm:text-sm"${_scopeId}>${ssrInterpolate(brand.name)}</span>`);
							} else return [brand.logo ? (openBlock(), createBlock("img", {
								key: 0,
								src: unref(pb).files.getURL(brand, brand.logo),
								alt: brand.name,
								class: "mb-2 h-11 max-w-full object-contain transition-all duration-300 group-hover:scale-110 sm:h-14"
							}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
								key: 1,
								class: "mb-2 font-display text-2xl tracking-display text-brand-grey/60 transition-colors duration-300 group-hover:text-brand-red sm:text-3xl"
							}, toDisplayString(brand.name.slice(0, 2).toUpperCase()), 1)), createVNode("span", { class: "text-center font-display text-xs tracking-display text-brand-light transition-colors duration-300 group-hover:text-white sm:text-sm" }, toDisplayString(brand.name), 1)];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/components/home/BrandsSection.vue
var _sfc_setup$5 = BrandsSection_vue_vue_type_script_setup_true_lang_default.setup;
BrandsSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/BrandsSection.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var BrandsSection_default = Object.assign(BrandsSection_vue_vue_type_script_setup_true_lang_default, { __name: "BrandsSection" });
//#endregion
//#region app/components/home/WhyChooseUs.vue?vue&type=script&setup=true&lang.ts
var WhyChooseUs_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "WhyChooseUs",
	__ssrInlineRender: true,
	setup(__props) {
		const valueProps = [
			{
				title: "Warranty Coverage",
				description: "Every motorcycle sold comes with a comprehensive warranty package, giving you peace of mind on every ride through Nairobi and beyond.",
				icon: ShieldCheck
			},
			{
				title: "Flexible Financing",
				description: "Affordable payment plans tailored to your budget. Get on your dream bike with competitive rates and quick approval.",
				icon: BadgeDollarSign
			},
			{
				title: "Certified Mechanics",
				description: "Our factory-trained technicians use specialized diagnostic equipment to keep your machine performing at its peak.",
				icon: Wrench
			},
			{
				title: "Genuine Parts",
				description: "We stock only OEM and certified aftermarket parts. No counterfeits, no shortcuts — just quality components.",
				icon: Package
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden" }, _attrs))}><div class="carbon-fiber absolute inset-0"></div><div class="section-diagonal relative z-10"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mb-16 text-center",
				initial: {
					opacity: 0,
					y: 40
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Why Choose <span class="text-brand-red"${_scopeId}>Us</span></h2><div class="mx-auto mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mx-auto mt-4 max-w-xl text-brand-grey"${_scopeId}>Built for riders who demand more from their machine and their dealer</p>`);
					else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Why Choose "), createVNode("span", { class: "text-brand-red" }, "Us")]),
						createVNode("div", { class: "mx-auto mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mx-auto mt-4 max-w-xl text-brand-grey" }, "Built for riders who demand more from their machine and their dealer")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="grid gap-6 sm:grid-cols-2 lg:gap-8"><!--[-->`);
			ssrRenderList(valueProps, (prop, index) => {
				_push(ssrRenderComponent(unref(motion).div, {
					key: prop.title,
					class: ["group relative overflow-hidden rounded-sm border border-brand-grey/10 bg-brand-black/60 p-8 backdrop-blur-sm transition-all duration-500 hover:border-brand-red/40 hover:bg-brand-black/80", { "lg:translate-y-8": index % 2 === 0 }],
					initial: {
						opacity: 0,
						y: 60
					},
					"while-in-view": {
						opacity: 1,
						y: 0
					},
					viewport: {
						once: true,
						margin: "-50px"
					},
					transition: {
						delay: index * .15,
						duration: .5
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 ring-1 ring-brand-red/30 transition-all duration-300 group-hover:bg-brand-red group-hover:ring-brand-red"${_scopeId}>`);
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(prop.icon), { class: "h-7 w-7 text-brand-red transition-colors duration-300 group-hover:text-white" }, null), _parent, _scopeId);
							_push(`</div><h3 class="font-display text-2xl tracking-display text-white"${_scopeId}>${ssrInterpolate(prop.title)}</h3><p class="mt-3 text-sm leading-relaxed text-brand-grey"${_scopeId}>${ssrInterpolate(prop.description)}</p><div class="mt-6 h-px w-0 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 group-hover:w-full"${_scopeId}></div>`);
						} else return [
							createVNode("div", { class: "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 ring-1 ring-brand-red/30 transition-all duration-300 group-hover:bg-brand-red group-hover:ring-brand-red" }, [(openBlock(), createBlock(resolveDynamicComponent(prop.icon), { class: "h-7 w-7 text-brand-red transition-colors duration-300 group-hover:text-white" }))]),
							createVNode("h3", { class: "font-display text-2xl tracking-display text-white" }, toDisplayString(prop.title), 1),
							createVNode("p", { class: "mt-3 text-sm leading-relaxed text-brand-grey" }, toDisplayString(prop.description), 1),
							createVNode("div", { class: "mt-6 h-px w-0 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 group-hover:w-full" })
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/home/WhyChooseUs.vue
var _sfc_setup$4 = WhyChooseUs_vue_vue_type_script_setup_true_lang_default.setup;
WhyChooseUs_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/WhyChooseUs.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var WhyChooseUs_default = Object.assign(WhyChooseUs_vue_vue_type_script_setup_true_lang_default, { __name: "WhyChooseUs" });
//#endregion
//#region app/components/home/ServiceBookingWidget.vue?vue&type=script&setup=true&lang.ts
var ServiceBookingWidget_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ServiceBookingWidget",
	__ssrInlineRender: true,
	setup(__props) {
		const pb = usePB();
		const showSuccess = ref(false);
		const submitError = ref("");
		const submittedEmail = ref("");
		const bookedTimes = ref(/* @__PURE__ */ new Set());
		const selectedDate = ref("");
		function closeSuccess() {
			showSuccess.value = false;
			submittedEmail.value = "";
		}
		const allTimeSlots = [
			"08:00",
			"09:00",
			"10:00",
			"11:00",
			"12:00",
			"13:00",
			"14:00",
			"15:00",
			"16:00"
		];
		const minDate = computed(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		const availableTimeSlots = computed(() => {
			const now = /* @__PURE__ */ new Date();
			return allTimeSlots.filter((slot) => {
				const [h] = slot.split(":").map(Number);
				if (selectedDate.value === now.toISOString().split("T")[0] && h <= now.getHours()) return false;
				return true;
			});
		});
		const serviceTypes = [
			{
				value: "routine",
				label: "Routine Service"
			},
			{
				value: "major",
				label: "Major Service"
			},
			{
				value: "repair",
				label: "Repair"
			},
			{
				value: "inspection",
				label: "Pre-Purchase Inspection"
			},
			{
				value: "customization",
				label: "Customization"
			}
		];
		const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
			validationSchema: toTypedSchema(z.object({
				name: z.string().min(2, "Name required"),
				phone: z.string().min(8, "Valid phone required"),
				email: z.string().email("Valid email required"),
				bikeModel: z.string().min(2, "Bike model required"),
				serviceType: z.string().min(1, "Select service type"),
				date: z.string().min(1, "Select date"),
				time: z.string().min(1, "Select time"),
				branch: z.string().min(1)
			})),
			initialValues: {
				name: "",
				phone: "",
				email: "",
				bikeModel: "",
				serviceType: "",
				date: "",
				time: "",
				branch: "mombasa-road"
			}
		});
		async function onDateChange(e) {
			const date = e.target.value;
			selectedDate.value = date;
			if (!date) {
				bookedTimes.value = /* @__PURE__ */ new Set();
				return;
			}
			try {
				const res = await pb.collection("service_bookings").getList(1, 50, {
					filter: `preferred_date = "${date}"`,
					fields: "preferred_time"
				});
				bookedTimes.value = new Set(res.items.map((b) => b.preferred_time));
			} catch {
				bookedTimes.value = /* @__PURE__ */ new Set();
			}
		}
		handleSubmit(async (values) => {
			showSuccess.value = false;
			submitError.value = "";
			try {
				if ((await pb.collection("service_bookings").getList(1, 1, { filter: `preferred_date = "${values.date}" && preferred_time = "${values.time}" && type = "service"` })).totalItems > 0) {
					setFieldError("time", "This time slot is already booked");
					submitError.value = "This time slot has already been taken. Please choose another.";
					return;
				}
				await pb.collection("service_bookings").create({
					type: "service",
					name: values.name,
					phone: values.phone,
					email: values.email,
					motorcycle: values.bikeModel,
					service_type: values.serviceType,
					branch: "Mombasa Road Branch",
					preferred_date: values.date,
					preferred_time: values.time,
					status: "pending"
				});
				submittedEmail.value = values.email;
				showSuccess.value = true;
				selectedDate.value = "";
				bookedTimes.value = /* @__PURE__ */ new Set();
				resetForm();
			} catch (err) {
				submitError.value = err?.data?.message || err?.message || "Booking failed. Please try again.";
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8"><form class="space-y-5"><div class="grid gap-5 sm:grid-cols-2"><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Full Name</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "name" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
							type: "text",
							placeholder: "John Doe",
							class: ["input-field h-11", { "border-brand-red": errorMessage }]
						}))}${_scopeId}>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("input", mergeProps(componentField, {
						type: "text",
						placeholder: "John Doe",
						class: ["input-field h-11", { "border-brand-red": errorMessage }]
					}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Phone</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "phone" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
							type: "tel",
							placeholder: "+254 7XX XXX XXX",
							class: ["input-field h-11", { "border-brand-red": errorMessage }]
						}))}${_scopeId}>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("input", mergeProps(componentField, {
						type: "tel",
						placeholder: "+254 7XX XXX XXX",
						class: ["input-field h-11", { "border-brand-red": errorMessage }]
					}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div></div><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Email</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "email" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
							type: "email",
							placeholder: "john@example.com",
							class: ["input-field h-11", { "border-brand-red": errorMessage }]
						}))}${_scopeId}>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("input", mergeProps(componentField, {
						type: "email",
						placeholder: "john@example.com",
						class: ["input-field h-11", { "border-brand-red": errorMessage }]
					}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="grid gap-5 sm:grid-cols-2"><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Bike Model</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "bikeModel" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
							type: "text",
							placeholder: "e.g. Kawasaki Ninja 650",
							class: ["input-field h-11", { "border-brand-red": errorMessage }]
						}))}${_scopeId}>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("input", mergeProps(componentField, {
						type: "text",
						placeholder: "e.g. Kawasaki Ninja 650",
						class: ["input-field h-11", { "border-brand-red": errorMessage }]
					}), null, 16), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Service Type</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "serviceType" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }))}${_scopeId}><option value="" disabled${_scopeId}>Select service</option><!--[-->`);
						ssrRenderList(serviceTypes, (s) => {
							_push(`<option${ssrRenderAttr("value", s.value)}${_scopeId}>${ssrInterpolate(s.label)}</option>`);
						});
						_push(`<!--]--></select>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
						value: "",
						disabled: ""
					}, "Select service"), (openBlock(), createBlock(Fragment, null, renderList(serviceTypes, (s) => {
						return createVNode("option", {
							key: s.value,
							value: s.value
						}, toDisplayString(s.label), 9, ["value"]);
					}), 64))], 16), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div></div><div class="grid gap-5 sm:grid-cols-2"><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Preferred Date</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "date" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps(componentField, {
							type: "date",
							class: ["input-field h-11", { "border-brand-red": errorMessage }],
							min: unref(minDate)
						}))}${_scopeId}>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
					} else return [createVNode("input", mergeProps(componentField, {
						type: "date",
						class: ["input-field h-11", { "border-brand-red": errorMessage }],
						min: unref(minDate),
						onChange: onDateChange
					}), null, 16, ["min"]), errorMessage ? (openBlock(), createBlock("p", {
						key: 0,
						class: "mt-1 text-xs text-brand-red"
					}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Preferred Time</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "time" }, {
				default: withCtx(({ componentField, errorMessage }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }))}${_scopeId}><option value="" disabled${_scopeId}>Select time</option><!--[-->`);
						ssrRenderList(unref(availableTimeSlots), (slot) => {
							_push(`<option${ssrRenderAttr("value", slot)}${ssrIncludeBooleanAttr(unref(bookedTimes).has(slot)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(slot)}</option>`);
						});
						_push(`<!--]--></select>`);
						if (errorMessage) _push(`<p class="mt-1 text-xs text-brand-red"${_scopeId}>${ssrInterpolate(errorMessage)}</p>`);
						else _push(`<!---->`);
						if (unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s))) _push(`<p class="mt-1 text-xs text-amber-400"${_scopeId}>Fully booked for this date</p>`);
						else _push(`<!---->`);
					} else return [
						createVNode("select", mergeProps(componentField, { class: ["input-field h-11 appearance-none", { "border-brand-red": errorMessage }] }), [createVNode("option", {
							value: "",
							disabled: ""
						}, "Select time"), (openBlock(true), createBlock(Fragment, null, renderList(unref(availableTimeSlots), (slot) => {
							return openBlock(), createBlock("option", {
								key: slot,
								value: slot,
								disabled: unref(bookedTimes).has(slot)
							}, toDisplayString(slot), 9, ["value", "disabled"]);
						}), 128))], 16),
						errorMessage ? (openBlock(), createBlock("p", {
							key: 0,
							class: "mt-1 text-xs text-brand-red"
						}, toDisplayString(errorMessage), 1)) : createCommentVNode("", true),
						unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s)) ? (openBlock(), createBlock("p", {
							key: 1,
							class: "mt-1 text-xs text-amber-400"
						}, "Fully booked for this date")) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
			_push(`</div></div><div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Branch</label>`);
			_push(ssrRenderComponent(unref(Field), { name: "branch" }, {
				default: withCtx(({ componentField }, _push, _parent, _scopeId) => {
					if (_push) _push(`<select${ssrRenderAttrs(mergeProps(componentField, { class: "input-field h-11 appearance-none" }))}${_scopeId}><option value="mombasa-road"${_scopeId}>Mombasa Road Branch</option></select>`);
					else return [createVNode("select", mergeProps(componentField, { class: "input-field h-11 appearance-none" }), [createVNode("option", { value: "mombasa-road" }, "Mombasa Road Branch")], 16)];
				}),
				_: 1
			}, _parent));
			_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting) || unref(selectedDate) && unref(availableTimeSlots).length > 0 && unref(availableTimeSlots).every((s) => unref(bookedTimes).has(s))) ? " disabled" : ""} class="btn-primary mt-2 w-full justify-center h-12 disabled:opacity-50">`);
			if (unref(isSubmitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent));
			else _push(ssrRenderComponent(unref(CalendarCheck), { class: "h-5 w-5" }, null, _parent));
			_push(`${ssrInterpolate(unref(isSubmitting) ? "Booking..." : "Book Appointment")}</button></form>`);
			if (unref(submitError)) _push(`<div class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"><p class="text-sm text-brand-red">${ssrInterpolate(unref(submitError))}</p></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showSuccess)) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">`);
					_push(ssrRenderComponent(unref(motion).div, {
						initial: {
							opacity: 0,
							scale: .9
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						class: "relative w-full max-w-md rounded-sm border border-green-500/30 bg-brand-black p-8 text-center shadow-2xl"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"${_scopeId}>`);
								_push(ssrRenderComponent(unref(CalendarCheck), { class: "h-8 w-8 text-green-400" }, null, _parent, _scopeId));
								_push(`</div><h2 class="font-heading text-2xl text-white"${_scopeId}>Booking Submitted!</h2><p class="mt-3 text-sm leading-relaxed text-brand-grey"${_scopeId}> Your service booking has been received. We will send a confirmation with your appointment details to <span class="font-medium text-white"${_scopeId}>${ssrInterpolate(unref(submittedEmail))}</span>. </p><button class="btn-primary mt-6 w-full justify-center"${_scopeId}>Got it</button>`);
							} else return [
								createVNode("div", { class: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20" }, [createVNode(unref(CalendarCheck), { class: "h-8 w-8 text-green-400" })]),
								createVNode("h2", { class: "font-heading text-2xl text-white" }, "Booking Submitted!"),
								createVNode("p", { class: "mt-3 text-sm leading-relaxed text-brand-grey" }, [
									createTextVNode(" Your service booking has been received. We will send a confirmation with your appointment details to "),
									createVNode("span", { class: "font-medium text-white" }, toDisplayString(unref(submittedEmail)), 1),
									createTextVNode(". ")
								]),
								createVNode("button", {
									onClick: closeSuccess,
									class: "btn-primary mt-6 w-full justify-center"
								}, "Got it")
							];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region app/components/home/ServiceBookingWidget.vue
var _sfc_setup$3 = ServiceBookingWidget_vue_vue_type_script_setup_true_lang_default.setup;
ServiceBookingWidget_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/ServiceBookingWidget.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var ServiceBookingWidget_default = Object.assign(ServiceBookingWidget_vue_vue_type_script_setup_true_lang_default, { __name: "ServiceBookingWidget" });
//#endregion
//#region app/components/home/SubscriptionSection.vue?vue&type=script&setup=true&lang.ts
var SubscriptionSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SubscriptionSection",
	__ssrInlineRender: true,
	setup(__props) {
		const pb = usePB();
		const email = ref("");
		const submitting = ref(false);
		const subscribed = ref(false);
		const error = ref("");
		async function handleSubmit() {
			if (!email.value.trim()) return;
			submitting.value = true;
			error.value = "";
			subscribed.value = false;
			try {
				await pb.collection("subscribers").create({
					email: email.value,
					subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
					source: "homepage"
				});
				subscribed.value = true;
				email.value = "";
			} catch (err) {
				error.value = err?.data?.message || "Something went wrong. Try again later.";
			} finally {
				submitting.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden border-t border-brand-grey/10" }, _attrs))}><div class="asphalt-grid absolute inset-0 bg-brand-black"></div><div class="section-diagonal-reverse relative z-10"><div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					y: 30
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Stay in the <span class="text-brand-red"${_scopeId}>Loop</span></h2><p class="mx-auto mt-4 max-w-md text-brand-grey"${_scopeId}>Get first dibs on new arrivals, exclusive deals, and Nairobi moto culture news.</p>`);
					else return [createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Stay in the "), createVNode("span", { class: "text-brand-red" }, "Loop")]), createVNode("p", { class: "mx-auto mt-4 max-w-md text-brand-grey" }, "Get first dibs on new arrivals, exclusive deals, and Nairobi moto culture news.")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mx-auto mt-8 max-w-xl",
				initial: {
					opacity: 0,
					y: 20
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: {
					delay: .2,
					duration: .5
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(subscribed)) {
							_push(`<form class="flex flex-col gap-3 sm:flex-row"${_scopeId}><div class="relative flex-1"${_scopeId}><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="Enter your email" class="${ssrRenderClass([{ "border-brand-red": unref(error) }, "input-field h-12 pr-10"])}"${_scopeId}>`);
							if (!unref(email).length) _push(ssrRenderComponent(unref(Mail), { class: "pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-grey/40" }, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="btn-primary h-12 shrink-0 disabled:opacity-50"${_scopeId}>`);
							if (unref(submitting)) _push(ssrRenderComponent(unref(LoaderCircle), { class: "h-5 w-5 animate-spin" }, null, _parent, _scopeId));
							else _push(ssrRenderComponent(unref(Send), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(submitting) ? "Subscribing..." : "Subscribe")}</button></form>`);
						} else _push(`<!---->`);
						if (unref(subscribed)) {
							_push(`<div class="rounded-sm border border-green-500/30 bg-green-500/10 p-6"${_scopeId}>`);
							_push(ssrRenderComponent(unref(motion).div, {
								initial: {
									opacity: 0,
									scale: .9
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								transition: {
									type: "spring",
									stiffness: 200
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<p class="font-display text-2xl tracking-display text-green-400"${_scopeId}>You&#39;re In!</p><p class="mt-1 text-sm text-green-300"${_scopeId}>Thanks for subscribing. We&#39;ll keep you posted on the latest from Nairobi Powerbikes.</p>`);
									else return [createVNode("p", { class: "font-display text-2xl tracking-display text-green-400" }, "You're In!"), createVNode("p", { class: "mt-1 text-sm text-green-300" }, "Thanks for subscribing. We'll keep you posted on the latest from Nairobi Powerbikes.")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						if (unref(error)) _push(`<p class="mt-3 text-sm text-brand-red"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
						else _push(`<!---->`);
					} else return [
						!unref(subscribed) ? (openBlock(), createBlock("form", {
							key: 0,
							onSubmit: withModifiers(handleSubmit, ["prevent"]),
							class: "flex flex-col gap-3 sm:flex-row"
						}, [createVNode("div", { class: "relative flex-1" }, [withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
							type: "email",
							required: "",
							placeholder: "Enter your email",
							class: ["input-field h-12 pr-10", { "border-brand-red": unref(error) }]
						}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(email)]]), !unref(email).length ? (openBlock(), createBlock(unref(Mail), {
							key: 0,
							class: "pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-grey/40"
						})) : createCommentVNode("", true)]), createVNode("button", {
							type: "submit",
							disabled: unref(submitting),
							class: "btn-primary h-12 shrink-0 disabled:opacity-50"
						}, [unref(submitting) ? (openBlock(), createBlock(unref(LoaderCircle), {
							key: 0,
							class: "h-5 w-5 animate-spin"
						})) : (openBlock(), createBlock(unref(Send), {
							key: 1,
							class: "h-5 w-5"
						})), createTextVNode(toDisplayString(unref(submitting) ? "Subscribing..." : "Subscribe"), 1)], 8, ["disabled"])], 32)) : createCommentVNode("", true),
						unref(subscribed) ? (openBlock(), createBlock("div", {
							key: 1,
							class: "rounded-sm border border-green-500/30 bg-green-500/10 p-6"
						}, [createVNode(unref(motion).div, {
							initial: {
								opacity: 0,
								scale: .9
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							transition: {
								type: "spring",
								stiffness: 200
							}
						}, {
							default: withCtx(() => [createVNode("p", { class: "font-display text-2xl tracking-display text-green-400" }, "You're In!"), createVNode("p", { class: "mt-1 text-sm text-green-300" }, "Thanks for subscribing. We'll keep you posted on the latest from Nairobi Powerbikes.")]),
							_: 1
						})])) : createCommentVNode("", true),
						unref(error) ? (openBlock(), createBlock("p", {
							key: 2,
							class: "mt-3 text-sm text-brand-red"
						}, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/home/SubscriptionSection.vue
var _sfc_setup$2 = SubscriptionSection_vue_vue_type_script_setup_true_lang_default.setup;
SubscriptionSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/SubscriptionSection.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var SubscriptionSection_default = Object.assign(SubscriptionSection_vue_vue_type_script_setup_true_lang_default, { __name: "SubscriptionSection" });
//#endregion
//#region app/components/home/BranchMap.vue?vue&type=script&setup=true&lang.ts
var BranchMap_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BranchMap",
	__ssrInlineRender: true,
	setup(__props) {
		usePB();
		const loading = ref(true);
		const branches = ref([]);
		const fallbackBranches = [{
			name: "Mombasa Road Branch",
			address: "DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi",
			phone: "+254 712 345 678",
			hours: "Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM",
			lat: -1.326078,
			lng: 36.8458795
		}, {
			name: "Kiambu Road Branch",
			address: "TotalEnergies Kiambu Road Service Station, Kiambu Road",
			phone: "+254 723 456 789",
			hours: "Mon-Sat: 8:30 AM - 6:30 PM\nSun: 10:00 AM - 4:00 PM",
			lat: -1.1891417,
			lng: 36.8371582
		}];
		computed(() => {
			if (branches.value.length) return branches.value.filter((b) => b.lat && b.lng).map((b) => ({
				name: b.name,
				address: b.address,
				phone: b.phone,
				hours: b.hours,
				lat: b.lat,
				lng: b.lng
			}));
			return fallbackBranches;
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-brand-black py-20" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mb-12",
				initial: {
					opacity: 0,
					y: 40
				},
				"while-in-view": {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { duration: .6 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Find <span class="text-brand-red"${_scopeId}>Us</span></h2><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-brand-grey"${_scopeId}>Visit any of our branches across Nairobi</p>`);
					else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Find "), createVNode("span", { class: "text-brand-red" }, "Us")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-brand-grey" }, "Visit any of our branches across Nairobi")
					];
				}),
				_: 1
			}, _parent));
			if (unref(loading)) {
				_push(`<div class="space-y-6"><div class="h-[400px] animate-pulse rounded-sm bg-brand-grey/10"></div><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(3, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-2/3 rounded bg-brand-grey/10"></div><div class="mb-2 h-4 w-full rounded bg-brand-grey/10"></div><div class="mb-2 h-4 w-3/4 rounded bg-brand-grey/10"></div><div class="h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div></div>`);
			} else {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="h-[400px] animate-pulse rounded-sm bg-brand-grey/10"${_scopeId}></div>`);
					else return [createVNode("div", { class: "h-[400px] animate-pulse rounded-sm bg-brand-grey/10" })];
				}) }, _parent));
				if (unref(branches).length) {
					_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
					ssrRenderList(unref(branches), (branch, index) => {
						_push(ssrRenderComponent(unref(motion).div, {
							key: branch.id,
							class: "group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-black",
							initial: {
								opacity: 0,
								y: 40
							},
							"while-in-view": {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: {
								delay: index * .1,
								duration: .5
							}
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="mb-4 flex items-start justify-between"${_scopeId}><h3 class="font-display text-xl tracking-[var(--tracking-display)] text-white group-hover:text-brand-red transition-colors"${_scopeId}>${ssrInterpolate(branch.name)}</h3>`);
									_push(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 shrink-0 text-brand-red" }, null, _parent, _scopeId));
									_push(`</div><div class="space-y-3 text-sm text-brand-grey"${_scopeId}><p class="flex items-start gap-2"${_scopeId}>`);
									_push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
									_push(`<span${_scopeId}>${ssrInterpolate(branch.address)}</span></p>`);
									if (branch.phone) {
										_push(`<p class="flex items-center gap-2"${_scopeId}>`);
										_push(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
										_push(`<a${ssrRenderAttr("href", `tel:${branch.phone}`)} class="hover:text-brand-red transition-colors"${_scopeId}>${ssrInterpolate(branch.phone)}</a></p>`);
									} else _push(`<!---->`);
									if (branch.hours) {
										_push(`<div class="flex items-start gap-2"${_scopeId}>`);
										_push(ssrRenderComponent(unref(Clock), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent, _scopeId));
										_push(`<span class="whitespace-pre-line"${_scopeId}>${ssrInterpolate(branch.hours)}</span></div>`);
									} else _push(`<!---->`);
									_push(`</div>`);
								} else return [createVNode("div", { class: "mb-4 flex items-start justify-between" }, [createVNode("h3", { class: "font-display text-xl tracking-[var(--tracking-display)] text-white group-hover:text-brand-red transition-colors" }, toDisplayString(branch.name), 1), createVNode(unref(MapPin), { class: "h-5 w-5 shrink-0 text-brand-red" })]), createVNode("div", { class: "space-y-3 text-sm text-brand-grey" }, [
									createVNode("p", { class: "flex items-start gap-2" }, [createVNode(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }), createVNode("span", null, toDisplayString(branch.address), 1)]),
									branch.phone ? (openBlock(), createBlock("p", {
										key: 0,
										class: "flex items-center gap-2"
									}, [createVNode(unref(Phone), { class: "h-4 w-4 shrink-0 text-brand-grey/50" }), createVNode("a", {
										href: `tel:${branch.phone}`,
										class: "hover:text-brand-red transition-colors"
									}, toDisplayString(branch.phone), 9, ["href"])])) : createCommentVNode("", true),
									branch.hours ? (openBlock(), createBlock("div", {
										key: 1,
										class: "flex items-start gap-2"
									}, [createVNode(unref(Clock), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }), createVNode("span", { class: "whitespace-pre-line" }, toDisplayString(branch.hours), 1)])) : createCommentVNode("", true)
								])];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else {
					_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
					ssrRenderList(fallbackBranches, (fallback) => {
						_push(`<div class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-black"><div class="mb-4 flex items-start justify-between"><h3 class="font-display text-xl tracking-[var(--tracking-display)] text-white group-hover:text-brand-red transition-colors">${ssrInterpolate(fallback.name)}</h3>`);
						_push(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 shrink-0 text-brand-red" }, null, _parent));
						_push(`</div><div class="space-y-3 text-sm text-brand-grey"><p class="flex items-start gap-2">`);
						_push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent));
						_push(`<span>${ssrInterpolate(fallback.address)}</span></p><p class="flex items-center gap-2">`);
						_push(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent));
						_push(`<span>${ssrInterpolate(fallback.phone)}</span></p>`);
						if (fallback.hours) {
							_push(`<p class="flex items-start gap-2">`);
							_push(ssrRenderComponent(unref(Clock), { class: "mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" }, null, _parent));
							_push(`<span class="whitespace-pre-line">${ssrInterpolate(fallback.hours)}</span></p>`);
						} else _push(`<!---->`);
						_push(`</div></div>`);
					});
					_push(`<!--]--></div>`);
				}
				_push(`<!--]-->`);
			}
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/components/home/BranchMap.vue
var _sfc_setup$1 = BranchMap_vue_vue_type_script_setup_true_lang_default.setup;
BranchMap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/BranchMap.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var BranchMap_default = Object.assign(BranchMap_vue_vue_type_script_setup_true_lang_default, { __name: "BranchMap" });
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Nairobi Powerbikes - Premium Motorcycle Dealership",
			meta: [{
				name: "description",
				content: "Nairobi's premier motorcycle dealership. Browse our collection of performance motorcycles, accessories, and apparel. Book a test ride or service today."
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_HeroSection = HeroSection_default;
			const _component_FeaturedBikes = FeaturedBikes_default;
			const _component_BrandsSection = BrandsSection_default;
			const _component_WhyChooseUs = WhyChooseUs_default;
			const _component_ServiceBookingWidget = ServiceBookingWidget_default;
			const _component_SubscriptionSection = SubscriptionSection_default;
			const _component_BranchMap = BranchMap_default;
			_push(ssrRenderComponent(unref(motion).div, mergeProps({
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { duration: .5 }
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_HeroSection, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_FeaturedBikes, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_BrandsSection, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_WhyChooseUs, null, null, _parent, _scopeId));
						_push(`<section class="py-20 bg-brand-black"${_scopeId}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"${_scopeId}><div class="grid gap-10 md:grid-cols-2 md:items-start"${_scopeId}>`);
						_push(ssrRenderComponent(unref(motion).div, {
							class: "pt-8",
							initial: {
								opacity: 0,
								x: -40
							},
							"while-in-view": {
								opacity: 1,
								x: 0
							},
							viewport: { once: true },
							transition: { duration: .6 }
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Book a <span class="text-brand-red"${_scopeId}>Service</span></h2><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-6 max-w-sm text-brand-grey"${_scopeId}>Schedule your next service appointment. Our certified technicians will have your machine running razor-sharp.</p>`);
								else return [
									createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Book a "), createVNode("span", { class: "text-brand-red" }, "Service")]),
									createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
									createVNode("p", { class: "mt-6 max-w-sm text-brand-grey" }, "Schedule your next service appointment. Our certified technicians will have your machine running razor-sharp.")
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(motion).div, {
							initial: {
								opacity: 0,
								x: 40
							},
							"while-in-view": {
								opacity: 1,
								x: 0
							},
							viewport: { once: true },
							transition: { duration: .6 }
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_ServiceBookingWidget, null, null, _parent, _scopeId));
								else return [createVNode(_component_ServiceBookingWidget)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div></section>`);
						_push(ssrRenderComponent(_component_SubscriptionSection, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_BranchMap, null, null, _parent, _scopeId));
					} else return [
						createVNode(_component_HeroSection),
						createVNode(_component_FeaturedBikes),
						createVNode(_component_BrandsSection),
						createVNode(_component_WhyChooseUs),
						createVNode("section", { class: "py-20 bg-brand-black" }, [createVNode("div", { class: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, [createVNode("div", { class: "grid gap-10 md:grid-cols-2 md:items-start" }, [createVNode(unref(motion).div, {
							class: "pt-8",
							initial: {
								opacity: 0,
								x: -40
							},
							"while-in-view": {
								opacity: 1,
								x: 0
							},
							viewport: { once: true },
							transition: { duration: .6 }
						}, {
							default: withCtx(() => [
								createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Book a "), createVNode("span", { class: "text-brand-red" }, "Service")]),
								createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
								createVNode("p", { class: "mt-6 max-w-sm text-brand-grey" }, "Schedule your next service appointment. Our certified technicians will have your machine running razor-sharp.")
							]),
							_: 1
						}), createVNode(unref(motion).div, {
							initial: {
								opacity: 0,
								x: 40
							},
							"while-in-view": {
								opacity: 1,
								x: 0
							},
							viewport: { once: true },
							transition: { duration: .6 }
						}, {
							default: withCtx(() => [createVNode(_component_ServiceBookingWidget)]),
							_: 1
						})])])]),
						createVNode(_component_SubscriptionSection),
						createVNode(_component_BranchMap)
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-B8DME-gQ.mjs.map
