import { u as useHead$1 } from '../virtual/entry.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Eye, Target, Heart, Handshake } from 'lucide-vue-next';
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

//#region app/components/home/AnimatedCounter.vue?vue&type=script&setup=true&lang.ts
var AnimatedCounter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AnimatedCounter",
	__ssrInlineRender: true,
	props: {
		target: {},
		suffix: { default: "" },
		label: { default: "" },
		duration: { default: 2 }
	},
	setup(__props) {
		const elRef = ref(null);
		const displayedValue = ref(null);
		function formatNumber(value) {
			return value.toLocaleString("en-KE");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "elRef",
				ref: elRef,
				class: "flex flex-col items-center"
			}, _attrs))}>`);
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
				transition: { duration: .5 }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="relative overflow-hidden"${_scopeId}><span class="font-display text-5xl leading-none text-brand-red sm:text-6xl lg:text-7xl"${_scopeId}>`);
						if (unref(displayedValue) !== null) _push(`<span${_scopeId}>${ssrInterpolate(formatNumber(unref(displayedValue)))}</span>`);
						else _push(`<span${_scopeId}>${ssrInterpolate(formatNumber(__props.target))}</span>`);
						if (__props.suffix) _push(`<span class="ml-1"${_scopeId}>${ssrInterpolate(__props.suffix)}</span>`);
						else _push(`<!---->`);
						_push(`</span></div><span class="mt-2 text-sm text-brand-grey uppercase tracking-display"${_scopeId}>${ssrInterpolate(__props.label)}</span>`);
					} else return [createVNode("div", { class: "relative overflow-hidden" }, [createVNode("span", { class: "font-display text-5xl leading-none text-brand-red sm:text-6xl lg:text-7xl" }, [unref(displayedValue) !== null ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatNumber(unref(displayedValue))), 1)) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(formatNumber(__props.target)), 1)), __props.suffix ? (openBlock(), createBlock("span", {
						key: 2,
						class: "ml-1"
					}, toDisplayString(__props.suffix), 1)) : createCommentVNode("", true)])]), createVNode("span", { class: "mt-2 text-sm text-brand-grey uppercase tracking-display" }, toDisplayString(__props.label), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/home/AnimatedCounter.vue
var _sfc_setup$1 = AnimatedCounter_vue_vue_type_script_setup_true_lang_default.setup;
AnimatedCounter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/AnimatedCounter.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AnimatedCounter_default = Object.assign(AnimatedCounter_vue_vue_type_script_setup_true_lang_default, { __name: "AnimatedCounter" });
//#endregion
//#region app/pages/about.vue?vue&type=script&setup=true&lang.ts
var about_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "about",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "About Us - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Learn about Nairobi Powerbikes' story, mission, team, and journey. Nairobi's premier motorcycle dealership since 2017."
			}]
		});
		usePB();
		const teamLoading = ref(true);
		const team = ref([]);
		const milestoneLoading = ref(true);
		const milestones = ref([]);
		const visionValues = [
			{
				title: "Our Vision",
				desc: "To become East Africa's premier destination for affordable Power Bikes & Accessories, taking the spirit of riding to exhilarating new heights.",
				icon: Eye
			},
			{
				title: "Our Mission",
				desc: "To inspire and empower motorcycle enthusiasts of all levels — offering sales, comprehensive servicing, spare parts, stylish apparel, and a thriving community hub.",
				icon: Target
			},
			{
				title: "Our Passion",
				desc: "We live and breathe motorcycling. Every decision is driven by our love for two wheels and the open road.",
				icon: Heart
			},
			{
				title: "Our Promise",
				desc: "Integrity, transparency, and excellence in everything we do. No shortcuts, no compromises.",
				icon: Handshake
			}
		];
		const stats = ref([
			{
				value: 5e3,
				suffix: "+",
				label: "Bikes Sold"
			},
			{
				value: 12,
				suffix: "",
				label: "Brands"
			},
			{
				value: 15e3,
				suffix: "+",
				label: "Services Done"
			},
			{
				value: 98,
				suffix: "%",
				label: "Satisfaction"
			}
		]);
		function getInitials(name) {
			return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AnimatedCounter = AnimatedCounter_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">`);
			_push(ssrRenderComponent(unref(motion).section, {
				class: "relative mb-16 overflow-hidden rounded-sm",
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
					if (_push) _push(`<div class="carbon-fiber absolute inset-0"${_scopeId}></div><div class="relative z-10 px-8 py-16 sm:px-12 sm:py-20"${_scopeId}><h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>About Nairobi<br${_scopeId}><span class="text-brand-red"${_scopeId}>Powerbikes</span></h1><p class="mt-4 max-w-2xl text-lg text-brand-grey"${_scopeId}>Nairobi&#39;s premier destination for premium motorcycles, expert service, and riding culture since 2017.</p></div>`);
					else return [createVNode("div", { class: "carbon-fiber absolute inset-0" }), createVNode("div", { class: "relative z-10 px-8 py-16 sm:px-12 sm:py-20" }, [createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [
						createTextVNode("About Nairobi"),
						createVNode("br"),
						createVNode("span", { class: "text-brand-red" }, "Powerbikes")
					]), createVNode("p", { class: "mt-4 max-w-2xl text-lg text-brand-grey" }, "Nairobi's premier destination for premium motorcycles, expert service, and riding culture since 2017.")])];
				}),
				_: 1
			}, _parent));
			_push(`<div class="grid gap-12 lg:grid-cols-2">`);
			_push(ssrRenderComponent(unref(motion).div, {
				initial: {
					opacity: 0,
					x: -30
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					delay: .2,
					duration: .6
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Our Story</h2><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-6 leading-relaxed text-brand-grey"${_scopeId}>Founded in 2017, Nairobi Powerbikes LTD has evolved from a modest Motorcycle Accessories Dealer into one of Kenya&#39;s foremost Motorcycle Dealerships. Through strategic global partnerships, we proudly offer the most affordable and highest quality motorcycles in East Africa.</p><p class="mt-4 leading-relaxed text-brand-grey"${_scopeId}>But we&#39;re more than just a dealership. Nairobi Powerbikes LTD is a vibrant community that brings together riders, explorers, and gearheads alike. Whether you&#39;re a seasoned rider or just starting out, we&#39;re passionate about fueling your love for motorcycles and providing a hub for connection, learning, and sharing experiences.</p>`);
					else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, "Our Story"),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-6 leading-relaxed text-brand-grey" }, "Founded in 2017, Nairobi Powerbikes LTD has evolved from a modest Motorcycle Accessories Dealer into one of Kenya's foremost Motorcycle Dealerships. Through strategic global partnerships, we proudly offer the most affordable and highest quality motorcycles in East Africa."),
						createVNode("p", { class: "mt-4 leading-relaxed text-brand-grey" }, "But we're more than just a dealership. Nairobi Powerbikes LTD is a vibrant community that brings together riders, explorers, and gearheads alike. Whether you're a seasoned rider or just starting out, we're passionate about fueling your love for motorcycles and providing a hub for connection, learning, and sharing experiences.")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).div, {
				class: "grid grid-cols-2 gap-4",
				initial: {
					opacity: 0,
					x: 30
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					delay: .3,
					duration: .6
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						ssrRenderList(visionValues, (v, i) => {
							_push(`<div class="rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5"${_scopeId}>`);
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(v.icon), { class: "mb-3 h-6 w-6 text-brand-red" }, null), _parent, _scopeId);
							_push(`<h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(v.title)}</h3><p class="mt-1 text-xs text-brand-grey"${_scopeId}>${ssrInterpolate(v.desc)}</p></div>`);
						});
						_push(`<!--]-->`);
					} else return [(openBlock(), createBlock(Fragment, null, renderList(visionValues, (v, i) => {
						return createVNode("div", {
							key: i,
							class: "rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5"
						}, [
							(openBlock(), createBlock(resolveDynamicComponent(v.icon), { class: "mb-3 h-6 w-6 text-brand-red" })),
							createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(v.title), 1),
							createVNode("p", { class: "mt-1 text-xs text-brand-grey" }, toDisplayString(v.desc), 1)
						]);
					}), 64))];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(unref(motion).section, {
				ref: "journeySection",
				class: "mt-20",
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
					duration: .5
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center"${_scopeId}>Our Journey</h2><div class="mt-2 mx-auto h-1 w-24 bg-brand-red"${_scopeId}></div>`);
						if (unref(milestoneLoading)) {
							_push(`<div class="mt-8 animate-pulse space-y-8"${_scopeId}><!--[-->`);
							ssrRenderList(4, (i) => {
								_push(`<div class="h-20 rounded-sm bg-brand-grey/10"${_scopeId}></div>`);
							});
							_push(`<!--]--></div>`);
						} else {
							_push(`<div class="mt-8 relative"${_scopeId}><div class="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-grey/20 lg:left-1/2 lg:-translate-x-px"${_scopeId}></div><div class="space-y-12"${_scopeId}><!--[-->`);
							ssrRenderList(unref(milestones), (ms, i) => {
								_push(`<div class="${ssrRenderClass([{ "animate-on-scroll": true }, "milestone-item relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2"])}"${_scopeId}>`);
								if (i % 2 === 0) _push(`<div class="hidden lg:block"${_scopeId}></div>`);
								else _push(`<!---->`);
								_push(`<div class="${ssrRenderClass(i % 2 === 0 ? "lg:col-start-2 lg:pl-12" : "lg:pr-12 lg:text-right")}"${_scopeId}>`);
								_push(ssrRenderComponent(unref(motion).div, {
									class: "milestone-card rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5",
									initial: {
										opacity: 0,
										y: 24
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
										delay: .15,
										duration: .5
									}
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<span class="text-xs font-display tracking-display text-brand-red"${_scopeId}>${ssrInterpolate(ms.year)}</span><h3 class="mt-1 font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(ms.title)}</h3><p class="mt-1 text-sm text-brand-grey"${_scopeId}>${ssrInterpolate(ms.desc)}</p>`);
										else return [
											createVNode("span", { class: "text-xs font-display tracking-display text-brand-red" }, toDisplayString(ms.year), 1),
											createVNode("h3", { class: "mt-1 font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(ms.title), 1),
											createVNode("p", { class: "mt-1 text-sm text-brand-grey" }, toDisplayString(ms.desc), 1)
										];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</div>`);
								if (i % 2 !== 0) _push(`<div class="hidden lg:block"${_scopeId}></div>`);
								else _push(`<!---->`);
								_push(`</div>`);
							});
							_push(`<!--]--></div></div>`);
						}
					} else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center" }, "Our Journey"),
						createVNode("div", { class: "mt-2 mx-auto h-1 w-24 bg-brand-red" }),
						unref(milestoneLoading) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-8 animate-pulse space-y-8"
						}, [(openBlock(), createBlock(Fragment, null, renderList(4, (i) => {
							return createVNode("div", {
								key: i,
								class: "h-20 rounded-sm bg-brand-grey/10"
							});
						}), 64))])) : (openBlock(), createBlock("div", {
							key: 1,
							class: "mt-8 relative"
						}, [createVNode("div", {
							ref: "timelineLine",
							class: "absolute left-4 top-0 bottom-0 w-0.5 bg-brand-grey/20 lg:left-1/2 lg:-translate-x-px"
						}, null, 512), createVNode("div", { class: "space-y-12" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(milestones), (ms, i) => {
							return openBlock(), createBlock("div", {
								key: i,
								ref_for: true,
								ref: "milestoneRefs",
								class: ["milestone-item relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2", { "animate-on-scroll": true }]
							}, [
								i % 2 === 0 ? (openBlock(), createBlock("div", {
									key: 0,
									class: "hidden lg:block"
								})) : createCommentVNode("", true),
								createVNode("div", { class: i % 2 === 0 ? "lg:col-start-2 lg:pl-12" : "lg:pr-12 lg:text-right" }, [createVNode(unref(motion).div, {
									class: "milestone-card rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5",
									initial: {
										opacity: 0,
										y: 24
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
										delay: .15,
										duration: .5
									}
								}, {
									default: withCtx(() => [
										createVNode("span", { class: "text-xs font-display tracking-display text-brand-red" }, toDisplayString(ms.year), 1),
										createVNode("h3", { class: "mt-1 font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(ms.title), 1),
										createVNode("p", { class: "mt-1 text-sm text-brand-grey" }, toDisplayString(ms.desc), 1)
									]),
									_: 2
								}, 1024)], 2),
								i % 2 !== 0 ? (openBlock(), createBlock("div", {
									key: 1,
									class: "hidden lg:block"
								})) : createCommentVNode("", true)
							]);
						}), 128))])]))
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).section, {
				class: "mt-20",
				initial: {
					opacity: 0,
					y: 40
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: .5,
					duration: .5
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center"${_scopeId}>By the Numbers</h2><div class="mt-2 mx-auto h-1 w-24 bg-brand-red"${_scopeId}></div><div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
						ssrRenderList(unref(stats), (stat) => {
							_push(ssrRenderComponent(_component_AnimatedCounter, {
								key: stat.label,
								target: stat.value,
								suffix: stat.suffix,
								label: stat.label,
								duration: 2
							}, null, _parent, _scopeId));
						});
						_push(`<!--]--></div>`);
					} else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center" }, "By the Numbers"),
						createVNode("div", { class: "mt-2 mx-auto h-1 w-24 bg-brand-red" }),
						createVNode("div", { class: "mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(stats), (stat) => {
							return openBlock(), createBlock(_component_AnimatedCounter, {
								key: stat.label,
								target: stat.value,
								suffix: stat.suffix,
								label: stat.label,
								duration: 2
							}, null, 8, [
								"target",
								"suffix",
								"label"
							]);
						}), 128))])
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).section, {
				class: "mt-20",
				initial: {
					opacity: 0,
					y: 40
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
					if (_push) {
						_push(`<h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center"${_scopeId}>Meet Our <span class="text-brand-red"${_scopeId}>Team</span></h2><div class="mt-2 mx-auto h-1 w-24 bg-brand-red"${_scopeId}></div>`);
						if (unref(teamLoading)) {
							_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
							ssrRenderList(4, (i) => {
								_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-5"${_scopeId}><div class="mx-auto mb-4 aspect-square w-32 rounded-full bg-brand-grey/10"${_scopeId}></div><div class="mx-auto h-5 w-3/4 rounded bg-brand-grey/10"${_scopeId}></div><div class="mx-auto mt-2 h-4 w-1/2 rounded bg-brand-grey/10"${_scopeId}></div></div>`);
							});
							_push(`<!--]--></div>`);
						} else if (unref(team).length) {
							_push(`<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
							ssrRenderList(unref(team), (member, i) => {
								_push(ssrRenderComponent(unref(motion).div, {
									key: member.id,
									class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-6 text-center transition-all duration-300 hover:border-brand-red/30",
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
											_push(`<div class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10"${_scopeId}><span class="font-display text-3xl text-brand-grey/40"${_scopeId}>${ssrInterpolate(getInitials(member.name))}</span></div><h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white"${_scopeId}>${ssrInterpolate(member.name)}</h3><p class="text-xs font-display tracking-display text-brand-red uppercase"${_scopeId}>${ssrInterpolate(member.role)}</p>`);
											if (member.bio) _push(`<p class="mt-2 text-xs text-brand-grey leading-relaxed"${_scopeId}>${ssrInterpolate(member.bio)}</p>`);
											else _push(`<!---->`);
										} else return [
											createVNode("div", { class: "mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10" }, [createVNode("span", { class: "font-display text-3xl text-brand-grey/40" }, toDisplayString(getInitials(member.name)), 1)]),
											createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(member.name), 1),
											createVNode("p", { class: "text-xs font-display tracking-display text-brand-red uppercase" }, toDisplayString(member.role), 1),
											member.bio ? (openBlock(), createBlock("p", {
												key: 0,
												class: "mt-2 text-xs text-brand-grey leading-relaxed"
											}, toDisplayString(member.bio), 1)) : createCommentVNode("", true)
										];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div>`);
						} else _push(`<div class="mt-8 rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"${_scopeId}><p class="font-display text-2xl tracking-display text-brand-grey"${_scopeId}>Team Coming Soon</p><p class="mt-2 text-sm text-brand-grey/60"${_scopeId}>We&#39;re building our dream team</p></div>`);
					} else return [
						createVNode("h2", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center" }, [createTextVNode("Meet Our "), createVNode("span", { class: "text-brand-red" }, "Team")]),
						createVNode("div", { class: "mt-2 mx-auto h-1 w-24 bg-brand-red" }),
						unref(teamLoading) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
						}, [(openBlock(), createBlock(Fragment, null, renderList(4, (i) => {
							return createVNode("div", {
								key: i,
								class: "animate-pulse rounded-sm border border-brand-grey/20 p-5"
							}, [
								createVNode("div", { class: "mx-auto mb-4 aspect-square w-32 rounded-full bg-brand-grey/10" }),
								createVNode("div", { class: "mx-auto h-5 w-3/4 rounded bg-brand-grey/10" }),
								createVNode("div", { class: "mx-auto mt-2 h-4 w-1/2 rounded bg-brand-grey/10" })
							]);
						}), 64))])) : unref(team).length ? (openBlock(), createBlock("div", {
							key: 1,
							class: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(team), (member, i) => {
							return openBlock(), createBlock(unref(motion).div, {
								key: member.id,
								class: "group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-6 text-center transition-all duration-300 hover:border-brand-red/30",
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
									createVNode("div", { class: "mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10" }, [createVNode("span", { class: "font-display text-3xl text-brand-grey/40" }, toDisplayString(getInitials(member.name)), 1)]),
									createVNode("h3", { class: "font-display text-lg tracking-[var(--tracking-display)] text-white" }, toDisplayString(member.name), 1),
									createVNode("p", { class: "text-xs font-display tracking-display text-brand-red uppercase" }, toDisplayString(member.role), 1),
									member.bio ? (openBlock(), createBlock("p", {
										key: 0,
										class: "mt-2 text-xs text-brand-grey leading-relaxed"
									}, toDisplayString(member.bio), 1)) : createCommentVNode("", true)
								]),
								_: 2
							}, 1032, ["transition"]);
						}), 128))])) : (openBlock(), createBlock("div", {
							key: 2,
							class: "mt-8 rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"
						}, [createVNode("p", { class: "font-display text-2xl tracking-display text-brand-grey" }, "Team Coming Soon"), createVNode("p", { class: "mt-2 text-sm text-brand-grey/60" }, "We're building our dream team")]))
					];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/about.vue
var _sfc_setup = about_vue_vue_type_script_setup_true_lang_default.setup;
about_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var about_default = about_vue_vue_type_script_setup_true_lang_default;

export { about_default as default };
//# sourceMappingURL=about-C_Xyxgsm.mjs.map
