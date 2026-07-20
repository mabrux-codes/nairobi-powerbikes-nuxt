import { u as useHead$1 } from '../virtual/entry.mjs';
import { m as motion } from './motion-iPcKg62k.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import 'framer-motion/dom';
import '@vueuse/core';
import 'motion-dom';
import 'hey-listen';
import 'motion-utils';

//#region app/pages/privacy.vue?vue&type=script&setup=true&lang.ts
var privacy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "privacy",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Privacy Policy - Nairobi Powerbikes",
			meta: [{
				name: "description",
				content: "Nairobi Powerbikes privacy policy explains how we collect, use, and protect your personal information."
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-brand-black pt-24" }, _attrs))}><div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">`);
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
					if (_push) _push(`<h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl"${_scopeId}>Privacy <span class="text-brand-red"${_scopeId}>Policy</span></h1><div class="mt-2 h-1 w-24 bg-brand-red"${_scopeId}></div><p class="mt-4 text-sm text-brand-grey/60"${_scopeId}>Last updated: January 1, 2025</p>`);
					else return [
						createVNode("h1", { class: "font-heading text-4xl text-white sm:text-5xl lg:text-display-xl" }, [createTextVNode("Privacy "), createVNode("span", { class: "text-brand-red" }, "Policy")]),
						createVNode("div", { class: "mt-2 h-1 w-24 bg-brand-red" }),
						createVNode("p", { class: "mt-4 text-sm text-brand-grey/60" }, "Last updated: January 1, 2025")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(motion).div, {
				class: "mt-10 space-y-8 text-brand-grey",
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
					if (_push) _push(`<section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>1. Introduction</h2><p class="mt-3 leading-relaxed"${_scopeId}>Nairobi Powerbikes (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>2. Information We Collect</h2><p class="mt-3 leading-relaxed"${_scopeId}>We may collect personal information that you voluntarily provide to us when you:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"${_scopeId}><li${_scopeId}>Fill out a contact form</li><li${_scopeId}>Book a service or test ride</li><li${_scopeId}>Apply for financing</li><li${_scopeId}>Register for an account</li><li${_scopeId}>Subscribe to our newsletter</li><li${_scopeId}>Make a purchase</li></ul><p class="mt-3 leading-relaxed"${_scopeId}>This information may include your name, email address, phone number, postal address, payment information, and any other details you provide.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>3. How We Use Your Information</h2><p class="mt-3 leading-relaxed"${_scopeId}>We use the collected information for the following purposes:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"${_scopeId}><li${_scopeId}>To process and manage your bookings, orders, and service requests</li><li${_scopeId}>To communicate with you about your inquiries and appointments</li><li${_scopeId}>To send marketing communications (with your consent)</li><li${_scopeId}>To improve our website and services</li><li${_scopeId}>To comply with legal obligations</li></ul></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>4. Data Protection</h2><p class="mt-3 leading-relaxed"${_scopeId}>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and secure data storage.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>5. Data Retention</h2><p class="mt-3 leading-relaxed"${_scopeId}>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. When we no longer need your information, we will securely delete or anonymize it.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>6. Your Rights</h2><p class="mt-3 leading-relaxed"${_scopeId}>Under applicable data protection laws, you have the right to:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"${_scopeId}><li${_scopeId}>Access your personal data</li><li${_scopeId}>Correct inaccurate data</li><li${_scopeId}>Delete your data</li><li${_scopeId}>Object to processing of your data</li><li${_scopeId}>Data portability</li><li${_scopeId}>Withdraw consent at any time</li></ul></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>7. Third-Party Services</h2><p class="mt-3 leading-relaxed"${_scopeId}>We may use third-party service providers to facilitate our services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>8. Cookies</h2><p class="mt-3 leading-relaxed"${_scopeId}>Our website uses cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. Please note that disabling cookies may affect certain features of our website.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>9. Changes to This Policy</h2><p class="mt-3 leading-relaxed"${_scopeId}>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p></section><section${_scopeId}><h2 class="font-display font-bold text-white text-xl"${_scopeId}>10. Contact Us</h2><p class="mt-3 leading-relaxed"${_scopeId}>If you have any questions about this Privacy Policy or our data practices, please contact us:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"${_scopeId}><li${_scopeId}>Email: privacy@nairobipowerbikes.com</li><li${_scopeId}>Phone: +254 712 345 678</li><li${_scopeId}>Address: Moi Avenue, Nairobi CBD</li></ul></section>`);
					else return [
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "1. Introduction"), createVNode("p", { class: "mt-3 leading-relaxed" }, "Nairobi Powerbikes (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.")]),
						createVNode("section", null, [
							createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "2. Information We Collect"),
							createVNode("p", { class: "mt-3 leading-relaxed" }, "We may collect personal information that you voluntarily provide to us when you:"),
							createVNode("ul", { class: "mt-3 list-disc space-y-1.5 pl-6" }, [
								createVNode("li", null, "Fill out a contact form"),
								createVNode("li", null, "Book a service or test ride"),
								createVNode("li", null, "Apply for financing"),
								createVNode("li", null, "Register for an account"),
								createVNode("li", null, "Subscribe to our newsletter"),
								createVNode("li", null, "Make a purchase")
							]),
							createVNode("p", { class: "mt-3 leading-relaxed" }, "This information may include your name, email address, phone number, postal address, payment information, and any other details you provide.")
						]),
						createVNode("section", null, [
							createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "3. How We Use Your Information"),
							createVNode("p", { class: "mt-3 leading-relaxed" }, "We use the collected information for the following purposes:"),
							createVNode("ul", { class: "mt-3 list-disc space-y-1.5 pl-6" }, [
								createVNode("li", null, "To process and manage your bookings, orders, and service requests"),
								createVNode("li", null, "To communicate with you about your inquiries and appointments"),
								createVNode("li", null, "To send marketing communications (with your consent)"),
								createVNode("li", null, "To improve our website and services"),
								createVNode("li", null, "To comply with legal obligations")
							])
						]),
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "4. Data Protection"), createVNode("p", { class: "mt-3 leading-relaxed" }, "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and secure data storage.")]),
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "5. Data Retention"), createVNode("p", { class: "mt-3 leading-relaxed" }, "We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. When we no longer need your information, we will securely delete or anonymize it.")]),
						createVNode("section", null, [
							createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "6. Your Rights"),
							createVNode("p", { class: "mt-3 leading-relaxed" }, "Under applicable data protection laws, you have the right to:"),
							createVNode("ul", { class: "mt-3 list-disc space-y-1.5 pl-6" }, [
								createVNode("li", null, "Access your personal data"),
								createVNode("li", null, "Correct inaccurate data"),
								createVNode("li", null, "Delete your data"),
								createVNode("li", null, "Object to processing of your data"),
								createVNode("li", null, "Data portability"),
								createVNode("li", null, "Withdraw consent at any time")
							])
						]),
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "7. Third-Party Services"), createVNode("p", { class: "mt-3 leading-relaxed" }, "We may use third-party service providers to facilitate our services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.")]),
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "8. Cookies"), createVNode("p", { class: "mt-3 leading-relaxed" }, "Our website uses cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. Please note that disabling cookies may affect certain features of our website.")]),
						createVNode("section", null, [createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "9. Changes to This Policy"), createVNode("p", { class: "mt-3 leading-relaxed" }, "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the \"Last updated\" date.")]),
						createVNode("section", null, [
							createVNode("h2", { class: "font-display font-bold text-white text-xl" }, "10. Contact Us"),
							createVNode("p", { class: "mt-3 leading-relaxed" }, "If you have any questions about this Privacy Policy or our data practices, please contact us:"),
							createVNode("ul", { class: "mt-3 list-disc space-y-1.5 pl-6" }, [
								createVNode("li", null, "Email: privacy@nairobipowerbikes.com"),
								createVNode("li", null, "Phone: +254 712 345 678"),
								createVNode("li", null, "Address: Moi Avenue, Nairobi CBD")
							])
						])
					];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/privacy.vue
var _sfc_setup = privacy_vue_vue_type_script_setup_true_lang_default.setup;
privacy_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var privacy_default = privacy_vue_vue_type_script_setup_true_lang_default;

export { privacy_default as default };
//# sourceMappingURL=privacy-CZnICsvV.mjs.map
