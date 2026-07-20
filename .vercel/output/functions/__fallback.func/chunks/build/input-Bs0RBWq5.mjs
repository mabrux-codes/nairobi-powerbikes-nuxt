import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

//#region app/components/ui/input.vue?vue&type=script&setup=true&lang.ts
var input_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "input",
	__ssrInlineRender: true,
	props: {
		label: {},
		type: { default: "text" },
		placeholder: {},
		modelValue: { default: "" }
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const inputId = `input-${Math.random().toString(36).slice(2, 8)}`;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			if (__props.label) _push(`<label${ssrRenderAttr("for", inputId)} class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">${ssrInterpolate(__props.label)}</label>`);
			else _push(`<!---->`);
			_push(`<input${ssrRenderAttr("id", inputId)}${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrRenderAttr("value", __props.modelValue)} class="input-field"></div>`);
		};
	}
});
//#endregion
//#region app/components/ui/input.vue
var _sfc_setup = input_vue_vue_type_script_setup_true_lang_default.setup;
input_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/input.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var input_default = Object.assign(input_vue_vue_type_script_setup_true_lang_default, { __name: "Input" });

export { input_default as i };
//# sourceMappingURL=input-Bs0RBWq5.mjs.map
