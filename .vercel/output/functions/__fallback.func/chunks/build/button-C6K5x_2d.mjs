import { c as cn } from './cn-BcpkRy0X.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

//#region app/components/ui/button.vue?vue&type=script&setup=true&lang.ts
var button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "button",
	__ssrInlineRender: true,
	props: {
		variant: { default: "primary" },
		size: { default: "md" },
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				class: unref(cn)("inline-flex items-center justify-center gap-2 font-display tracking-display uppercase transition-all duration-200 rounded-sm", __props.variant === "primary" && "btn-primary", __props.variant === "secondary" && "bg-brand-grey/20 text-white border border-brand-grey/40 hover:bg-brand-grey/30", __props.variant === "ghost" && "btn-ghost", __props.variant === "outline" && "border border-brand-red text-brand-red hover:bg-brand-red hover:text-white", __props.size === "sm" && "px-3 py-1.5 text-xs", __props.size === "md" && "px-5 py-2.5 text-sm", __props.size === "lg" && "px-6 py-3 text-base", __props.disabled && "opacity-50 cursor-not-allowed"),
				disabled: __props.disabled
			}, _ctx.$attrs, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</button>`);
		};
	}
});
//#endregion
//#region app/components/ui/button.vue
var _sfc_setup = button_vue_vue_type_script_setup_true_lang_default.setup;
button_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/button.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var button_default = Object.assign(button_vue_vue_type_script_setup_true_lang_default, { __name: "Button" });

export { button_default as b };
//# sourceMappingURL=button-C6K5x_2d.mjs.map
