import { e as appDiagnostics, c as useRouter, b as useRoute$1, N as NuxtLink } from '../virtual/entry.mjs';
import { c as cn } from './cn-BcpkRy0X.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { g as getPB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { _ as _virtual_public__2FNPB_20Logo_default } from './_virtual_public-BZ2lbPvU.mjs';
import { u as useAuth } from './useAuth-CUdaXvut.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderTeleport, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
import 'clsx';
import 'tailwind-merge';
import 'pocketbase';

//#region node_modules/nuxt/dist/app/compat/interval.js
var setInterval = (() => {
	appDiagnostics.NUXT_E1004();
});

//#region app/composables/useDashRoute.ts
var dashRoutes = [
	{
		label: "Dashboard",
		to: "/dashboard",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\" /></svg>",
		roles: ["admin", "customer"]
	},
	{
		label: "Content",
		to: "/dashboard/content",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Brands",
		to: "/dashboard/brands",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Categories",
		to: "/dashboard/categories",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 6h16M4 10h16M4 14h16M4 18h16\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Motorcycles",
		to: "/dashboard/motorcycles",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 10V3L4 14h7v7l9-11h-7z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Accessories",
		to: "/dashboard/accessories",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Apparel",
		to: "/dashboard/apparel",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Test Rides",
		to: "/dashboard/test-rides",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Service Bookings",
		to: "/dashboard/service-bookings",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Contacts",
		to: "/dashboard/contacts",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Staff",
		to: "/dashboard/staff",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Subscribers",
		to: "/dashboard/subscribers",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Team Members",
		to: "/dashboard/team-members",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Branches",
		to: "/dashboard/branches",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 11a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Notifications",
		to: "/dashboard/notifications",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Messages",
		to: "/dashboard/messages",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "Settings",
		to: "/dashboard/settings",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["admin"]
	},
	{
		label: "My Bookings",
		to: "/dashboard/my-bookings",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "My Test Rides",
		to: "/dashboard/my-test-rides",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 10V3L4 14h7v7l9-11h-7z\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Service Requests",
		to: "/dashboard/my-services",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Wishlist",
		to: "/dashboard/my-wishlist",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Notifications",
		to: "/dashboard/my-notifications",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Messages",
		to: "/dashboard/my-messages",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Profile",
		to: "/dashboard/profile",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z\" /></svg>",
		roles: ["customer"]
	},
	{
		label: "Settings",
		to: "/dashboard/my-settings",
		icon: "<svg class=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>",
		roles: ["customer"]
	}
];
function useDashRoute() {
	const auth = useAuthStore();
	const role = computed(() => auth.userRole);
	return { routes: computed(() => dashRoutes.filter((r) => r.roles.includes(role.value || ""))) };
}
//#endregion
//#region app/components/dashboard/DashboardSidebar.vue?vue&type=script&setup=true&lang.ts
var DashboardSidebar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "DashboardSidebar",
	__ssrInlineRender: true,
	props: { isOpen: { type: Boolean } },
	emits: ["close"],
	setup(__props) {
		const route = useRoute$1();
		const auth = useAuthStore();
		useAuth();
		const { routes } = useDashRoute();
		const user = computed(() => auth.user);
		const initials = computed(() => {
			if (!user.value) return "?";
			return (user.value.name || user.value.email).slice(0, 2).toUpperCase();
		});
		const roleBadgeClass = computed(() => {
			if (user.value?.role === "admin") return "bg-brand-red text-white";
			return "bg-brand-grey/40 text-brand-light";
		});
		const navItems = computed(() => routes.value);
		function isActive(to) {
			if (to === "/dashboard") return route.path === "/dashboard";
			return route.path.startsWith(to + "/") || route.path === to;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<!--[--><aside class="${ssrRenderClass(unref(cn)("fixed top-0 left-0 z-40 h-screen w-64 bg-brand-black border-r border-brand-grey/30 flex flex-col transition-transform duration-300 lg:translate-x-0", __props.isOpen ? "translate-x-0" : "-translate-x-full"))}"><div class="hidden lg:flex items-center justify-center h-16 border-b border-brand-grey/30 shrink-0">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "flex items-center"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2FNPB_20Logo_default)} alt="Nairobi Powerbikes" class="h-10 w-auto"${_scopeId}>`);
					else return [createVNode("img", {
						src: _virtual_public__2FNPB_20Logo_default,
						alt: "Nairobi Powerbikes",
						class: "h-10 w-auto"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div><nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1"><!--[-->`);
			ssrRenderList(unref(navItems), (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: unref(cn)("flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 group", isActive(item.to) ? "text-white bg-white/5 border-l-2 border-brand-red pl-[10px]" : "text-brand-grey hover:text-white hover:bg-white/5")
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="w-5 h-5 shrink-0"${_scopeId}>${item.icon ?? ""}</span><span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
						else return [createVNode("span", {
							class: "w-5 h-5 shrink-0",
							innerHTML: item.icon
						}, null, 8, ["innerHTML"]), createVNode("span", null, toDisplayString(item.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav><div class="border-t border-brand-grey/30 p-4 shrink-0">`);
			if (unref(user)) _push(`<div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-full bg-brand-grey/30 flex items-center justify-center text-xs font-bold text-brand-light shrink-0">${ssrInterpolate(unref(initials))}</div><div class="min-w-0 flex-1"><p class="text-sm font-medium text-white truncate">${ssrInterpolate(unref(user).name || unref(user).email)}</p><span class="${ssrRenderClass([unref(roleBadgeClass), "inline-block px-2 py-0.5 text-[10px] font-display tracking-display uppercase rounded-sm"])}">${ssrInterpolate(unref(user).role)}</span></div></div>`);
			else _push(`<!---->`);
			_push(`<button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-brand-grey hover:text-white hover:bg-white/5 rounded-sm transition-all duration-200"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg><span>Sign Out</span></button></div></aside>`);
			if (__props.isOpen) _push(`<div class="fixed inset-0 z-30 bg-black/50 lg:hidden"></div>`);
			else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region app/components/dashboard/DashboardSidebar.vue
var _sfc_setup$2 = DashboardSidebar_vue_vue_type_script_setup_true_lang_default.setup;
DashboardSidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardSidebar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var DashboardSidebar_default = Object.assign(DashboardSidebar_vue_vue_type_script_setup_true_lang_default, { __name: "DashboardSidebar" });
//#endregion
//#region app/components/dashboard/DashboardHeader.vue?vue&type=script&setup=true&lang.ts
var DashboardHeader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "DashboardHeader",
	__ssrInlineRender: true,
	emits: ["toggle-sidebar"],
	setup(__props) {
		const route = useRoute$1();
		const auth = useAuthStore();
		useAuth();
		const dropdownOpen = ref(false);
		ref(null);
		const user = computed(() => auth.user);
		const initials = computed(() => {
			if (!user.value) return "?";
			return (user.value.name || user.value.email).slice(0, 2).toUpperCase();
		});
		computed(() => {
			const path = route.path;
			if (path === "/dashboard/admin") return "Admin Dashboard";
			if (path === "/dashboard/manager") return "Manager Dashboard";
			if (path === "/dashboard/sales") return "Sales Dashboard";
			if (path === "/dashboard/mechanic") return "Mechanic Dashboard";
			if (path === "/dashboard/customer") return "My Dashboard";
			return (path.split("/").pop() || "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "h-16 bg-brand-black/80 backdrop-blur-sm border-b border-brand-grey/30 flex items-center justify-between px-4 lg:px-6 shrink-0" }, _attrs))}><div class="flex items-center gap-3"><button class="lg:hidden p-2 text-brand-grey hover:text-white transition-colors"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "flex items-center lg:hidden"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2FNPB_20Logo_default)} alt="Nairobi Powerbikes" class="h-8 w-auto"${_scopeId}>`);
					else return [createVNode("img", {
						src: _virtual_public__2FNPB_20Logo_default,
						alt: "Nairobi Powerbikes",
						class: "h-8 w-auto"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="flex items-center gap-3"><button class="relative p-2 text-brand-grey hover:text-white transition-colors"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[9px] font-bold flex items-center justify-center rounded-full">3</span></button><div class="relative"><button class="flex items-center gap-2 p-1.5 text-brand-grey hover:text-white transition-colors rounded-sm hover:bg-white/5"><div class="w-8 h-8 rounded-full bg-brand-grey/30 flex items-center justify-center text-xs font-bold text-brand-light">${ssrInterpolate(unref(initials))}</div><span class="hidden sm:block text-sm font-medium">${ssrInterpolate(unref(user)?.name || unref(user)?.email)}</span><svg class="w-4 h-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button>`);
			if (unref(dropdownOpen)) _push(`<div class="absolute right-0 top-full mt-2 w-48 bg-brand-black border border-brand-grey/30 rounded-sm shadow-xl z-50 py-1"><button class="w-full text-left px-4 py-2 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"> Sign Out </button></div>`);
			else _push(`<!---->`);
			_push(`</div></div></header>`);
		};
	}
});
//#endregion
//#region app/components/dashboard/DashboardHeader.vue
var _sfc_setup$1 = DashboardHeader_vue_vue_type_script_setup_true_lang_default.setup;
DashboardHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardHeader.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var DashboardHeader_default = Object.assign(DashboardHeader_vue_vue_type_script_setup_true_lang_default, { __name: "DashboardHeader" });
//#endregion
//#region app/composables/useInactivityLogout.ts
var INACTIVITY_TIMEOUT = 900 * 1e3;
var WARNING_TIMEOUT = 840 * 1e3;
var inactivityTimer = null;
function useInactivityLogout() {
	const auth = useAuthStore();
	const pb = getPB();
	const router = useRouter();
	const showWarning = ref(false);
	const warningCountdown = ref(60);
	let countdownTimer = null;
	function resetTimer() {
		if (inactivityTimer) clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(showWarningModal, WARNING_TIMEOUT);
	}
	function showWarningModal() {
		if (!auth.isAuthenticated) return;
		showWarning.value = true;
		warningCountdown.value = 60;
		countdownTimer = setInterval();
		inactivityTimer = setTimeout(forceLogout, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);
	}
	function forceLogout() {
		if (countdownTimer) clearInterval(countdownTimer);
		countdownTimer = null;
		showWarning.value = false;
		pb.authStore.clear();
		auth.clear();
		router.push("/login");
	}
	function stayLoggedIn() {
		if (countdownTimer) clearInterval(countdownTimer);
		countdownTimer = null;
		showWarning.value = false;
		if (inactivityTimer) clearTimeout(inactivityTimer);
		resetTimer();
	}
	function setupListeners() {}
	return {
		showWarning,
		warningCountdown,
		setupListeners,
		stayLoggedIn,
		forceLogout
	};
}
//#endregion
//#region app/layouts/dashboard.vue?vue&type=script&setup=true&lang.ts
var dashboard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "dashboard",
	__ssrInlineRender: true,
	setup(__props) {
		const sidebarOpen = ref(false);
		const { showWarning, warningCountdown, stayLoggedIn, forceLogout } = useInactivityLogout();
		const inactivityWarning = computed(() => showWarning.value);
		const countdown = computed(() => warningCountdown.value);
		function logoutNow() {
			forceLogout();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black text-white flex" }, _attrs))}>`);
			_push(ssrRenderComponent(DashboardSidebar_default, {
				isOpen: unref(sidebarOpen),
				onClose: ($event) => sidebarOpen.value = false
			}, null, _parent));
			_push(`<div class="flex-1 flex flex-col min-h-screen lg:ml-64">`);
			_push(ssrRenderComponent(DashboardHeader_default, { onToggleSidebar: ($event) => sidebarOpen.value = !unref(sidebarOpen) }, null, _parent));
			_push(`<main class="flex-1 p-4 sm:p-6">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(inactivityWarning)) {
					_push(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"><div class="w-full max-w-sm rounded-sm border border-brand-grey/30 bg-brand-black p-8 text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h2 class="font-display text-xl tracking-display text-white">Inactivity Warning</h2><p class="mt-2 text-sm text-brand-grey">You&#39;ve been inactive for a while. For your security, you&#39;ll be automatically logged out in <span class="text-amber-400 font-bold">${ssrInterpolate(unref(countdown))}</span> seconds.</p><div class="mt-6 flex gap-3 justify-center">`);
					_push(ssrRenderComponent(_component_Button, { onClick: unref(stayLoggedIn) }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Stay Logged In`);
							else return [createTextVNode("Stay Logged In")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						onClick: logoutNow
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Log Out Now`);
							else return [createTextVNode("Log Out Now")];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/layouts/dashboard.vue
var _sfc_setup = dashboard_vue_vue_type_script_setup_true_lang_default.setup;
dashboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = dashboard_vue_vue_type_script_setup_true_lang_default;

export { dashboard_default as default };
//# sourceMappingURL=dashboard-BxnJDYb5.mjs.map
