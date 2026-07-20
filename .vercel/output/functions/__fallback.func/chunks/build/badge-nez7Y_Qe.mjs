import { c as cn } from './cn-BcpkRy0X.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

//#region app/components/ui/badge.vue?vue&type=script&setup=true&lang.ts
var badge_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "badge",
	__ssrInlineRender: true,
	props: { variant: { default: "default" } },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({ class: unref(cn)("inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-display tracking-display uppercase transition-colors duration-200", __props.variant === "default" && "bg-brand-red text-white", __props.variant === "secondary" && "bg-blue-500/20 text-blue-400", __props.variant === "outline" && "border border-brand-grey/40 text-brand-grey", __props.variant === "success" && "bg-emerald-500/20 text-emerald-400", __props.variant === "warning" && "bg-amber-500/20 text-amber-400", __props.variant === "danger" && "bg-red-500/20 text-red-400") }, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</span>`);
		};
	}
});
//#endregion
//#region app/components/ui/badge.vue
var _sfc_setup = badge_vue_vue_type_script_setup_true_lang_default.setup;
badge_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/badge.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var badge_default = Object.assign(badge_vue_vue_type_script_setup_true_lang_default, { __name: "Badge" });

export { badge_default as b };
//# sourceMappingURL=badge-nez7Y_Qe.mjs.map
