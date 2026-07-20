import { defineComponent, h, ref, useAttrs, watch, getCurrentInstance, Comment, mergeProps, cloneVNode, computed, inject, provide } from 'vue';
import { isMotionValue, inView, distance2D, frameData, frame as frame$1, cancelFrame } from 'framer-motion/dom';
import { isDef } from '@vueuse/core';
import { isVariantLabel, frame, buildSVGAttrs, isSVGTag, camelCaseAttributes, buildHTMLStyles, correctBorderRadius, isAnimationControls, press, hover, addScaleCorrector, correctBoxShadow, HTMLProjectionNode, globalProjectionState, SVGVisualElement, HTMLVisualElement, createBox, eachAxis, measurePageBox, convertBoxToBoundingBox, convertBoundingBoxToBox, addValueToWillChange, animateMotionValue, mixNumber, resolveVariant, calcChildStagger, percent, calcLength, animateVisualElement } from 'motion-dom';
import { invariant } from 'hey-listen';
import { pipe, noop, progress, clamp, secondsToMilliseconds, millisecondsToSeconds } from 'motion-utils';

//#region node_modules/motion-v/dist/es/utils/createContext.mjs
function createContext(providerComponentName, contextName) {
	const symbolDescription = typeof providerComponentName === "string" && !contextName ? `${providerComponentName}Context` : contextName;
	const injectionKey = Symbol(symbolDescription);
	const injectContext = (fallback) => {
		const context = inject(injectionKey, fallback);
		if (context === void 0) throw new Error(`Injection \`${injectionKey.toString()}\` not found. Component must be used within ${Array.isArray(providerComponentName) ? `one of the following components: ${providerComponentName.join(", ")}` : `\`${providerComponentName}\``}`);
		return context;
	};
	const provideContext = (contextValue) => {
		provide(injectionKey, contextValue);
		return contextValue;
	};
	return [
		injectContext,
		provideContext,
		injectionKey
	];
}
//#endregion
//#region node_modules/motion-v/dist/es/utils/resolve-motion-props.mjs
function resolveMotionProps(props, context) {
	const { layoutGroup, presenceContext, config } = context;
	const layoutId = layoutGroup.id && props.layoutId ? `${layoutGroup.id}-${props.layoutId}` : props.layoutId || void 0;
	return {
		...props,
		layoutId,
		transition: props.transition ?? config.transition,
		layoutGroup,
		motionConfig: config,
		inViewOptions: props.inViewOptions ?? config.inViewOptions,
		presenceContext,
		initial: presenceContext.initial === false ? presenceContext.initial : props.initial === true ? void 0 : props.initial
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/utils/get-context-window.mjs
function getContextWindow({ current }) {
	return current ? current.ownerDocument.defaultView : null;
}
//#endregion
//#region node_modules/motion-v/dist/es/components/context.mjs
var [injectMotion, provideMotion] = createContext("Motion");
var [injectLayoutGroup] = createContext("LayoutGroup");
//#endregion
//#region node_modules/motion-v/dist/es/components/motion-config/context.mjs
var defaultConfig = {
	reducedMotion: "never",
	transition: void 0,
	nonce: void 0
};
var [injectMotionConfig] = createContext("MotionConfig");
function useMotionConfig() {
	return injectMotionConfig(computed(() => defaultConfig));
}
//#endregion
//#region node_modules/motion-v/dist/es/config.mjs
var motionGlobalConfig = { motionAttribute: "data-ap" };
//#endregion
//#region node_modules/motion-v/dist/es/features/lazy-features.mjs
var lazyFeatures = [];
function updateLazyFeatures(features) {
	for (const feature of features) if (feature && !lazyFeatures.includes(feature)) lazyFeatures.push(feature);
}
//#endregion
//#region node_modules/motion-v/dist/es/state/utils.mjs
function resolveVariantValue(definition, variants, custom) {
	if (Array.isArray(definition)) return definition.reduce((acc, item) => {
		const resolvedVariant = resolveVariantValue(item, variants, custom);
		return resolvedVariant ? {
			...acc,
			...resolvedVariant
		} : acc;
	}, {});
	else if (typeof definition === "object") return definition;
	else if (definition && variants) {
		const variant = variants[definition];
		return typeof variant === "function" ? variant(custom) : variant;
	}
}
function resolveVariant$1(definition, variants, custom) {
	const resolved = resolveVariantValue(definition, variants, custom);
	if (!resolved) return void 0;
	const { transition, transitionEnd, ...target } = resolved;
	return {
		...target,
		...transitionEnd
	};
}
function resolveInitialValues(options, context) {
	const sources = (options.initial === void 0 && options.variants ? context?.initial : options.initial) === false ? ["initial", "animate"] : ["initial"];
	const custom = options.custom ?? options.presenceContext?.custom;
	return sources.reduce((acc, variant) => {
		return {
			...acc,
			...resolveVariant$1(options[variant] || context?.[variant], options.variants, custom)
		};
	}, {});
}
function shallowCompare(next, prev) {
	const prevLength = prev?.length;
	if (prevLength !== next.length) return false;
	for (let i = 0; i < prevLength; i++) if (prev[i] !== next[i]) return false;
	return true;
}
var svgElementSet = /* @__PURE__ */ new Set([
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"svg",
	"switch",
	"symbol",
	"text",
	"tspan",
	"use",
	"view",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"linearGradient",
	"radialGradient",
	"textPath"
]);
function isSVGElement(as) {
	return svgElementSet.has(as);
}
//#endregion
//#region node_modules/motion-v/dist/es/state/motion-state.mjs
var mountedStates = /* @__PURE__ */ new WeakMap();
var MotionState = class {
	constructor(options, parent) {
		this.element = null;
		this.isExiting = false;
		this.presenceContainer = null;
		this.children = /* @__PURE__ */ new Set();
		this.features = /* @__PURE__ */ new Map();
		this._context = null;
		this.options = options;
		this.parent = parent;
		parent?.children?.add(this);
		this.latestValues = resolveInitialValues(options, this.context);
		this.type = isSVGElement(this.options.as) ? "svg" : "html";
	}
	get context() {
		if (!this._context) this._context = new Proxy({}, { get: (target, prop) => {
			const value = this.options[prop];
			if (isVariantLabel(value) || prop === "initial" && value === false) return value;
			return this.parent?.context[prop];
		} });
		return this._context;
	}
	updateFeatures() {
		if (!this.visualElement) return;
		for (const FeatureCtor of lazyFeatures) {
			if (!this.features.has(FeatureCtor.key)) this.features.set(FeatureCtor.key, new FeatureCtor(this));
			const feature = this.features.get(FeatureCtor.key);
			if (this.isMounted()) if (!feature.isMount) {
				feature.mount();
				feature.isMount = true;
			} else feature.update();
		}
	}
	updateOptions(options) {
		this.options = options;
		this.visualElement?.update({
			...this.options,
			whileTap: this.options.whilePress
		}, this.options.presenceContext ?? null);
	}
	mount(element) {
		invariant(Boolean(element), "Animation state must be mounted with valid Element");
		mountedStates.set(element, this);
		this.element = element;
		const presenceId = this.options.presenceContext?.presenceId;
		if (presenceId !== void 0) element.setAttribute(motionGlobalConfig.motionAttribute, presenceId);
		this.visualElement?.mount(element);
		this.updateFeatures();
	}
	beforeUnmount() {
		this.getSnapshot(this.options, false);
	}
	unmount() {
		this.parent?.children?.delete(this);
		mountedStates.delete(this.element);
		this.features.forEach((f) => f.unmount?.());
		this.visualElement?.unmount();
	}
	beforeUpdate() {
		this.getSnapshot(this.options, void 0);
	}
	update() {
		this.updateFeatures();
		this.didUpdate();
	}
	tryExitComplete() {
		if (this.isExiting) return;
		if (this.options?.layoutId && this.visualElement.projection?.currentAnimation?.state === "running") return;
		this.options.presenceContext?.onMotionExitComplete?.(this.presenceContainer, this);
	}
	setActive(name, isActive) {
		if (name === "exit" && isActive) this.isExiting = true;
		this.visualElement?.animationState?.setActive(name, isActive).then(() => {
			if (name === "exit" && isActive) {
				this.isExiting = false;
				this.options?.layoutId ? frame.postRender(() => this.tryExitComplete()) : this.tryExitComplete();
			}
		});
	}
	isMounted() {
		return Boolean(this.element);
	}
	initVisualElement(renderer) {
		if (this.visualElement) return;
		this.visualElement = renderer(this.options.as, {
			presenceContext: this.options.presenceContext ?? null,
			parent: this.parent?.visualElement,
			props: {
				...this.options,
				whileTap: this.options.whilePress
			},
			visualState: {
				renderState: {
					transform: {},
					transformOrigin: {},
					style: {},
					vars: {},
					attrs: {}
				},
				latestValues: { ...this.latestValues }
			},
			reducedMotionConfig: this.options.motionConfig?.reducedMotion
		});
		this.visualElement.parent?.addChild(this.visualElement);
		if (this.isMounted()) this.visualElement.mount(this.element);
	}
	getSnapshot(options, isPresent) {}
	didUpdate() {}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/feature.mjs
var Feature = class {
	constructor(state) {
		this.state = state;
	}
	mount() {}
	unmount() {}
	update() {}
};
//#endregion
//#region node_modules/motion-v/dist/es/state/utils/variant-props.mjs
var variantProps = [
	"initial",
	"animate",
	"exit",
	"whileHover",
	"whileDrag",
	"whileFocus",
	"whilePress"
];
//#endregion
//#region node_modules/motion-v/dist/es/state/utils/get-variant-context.mjs
var numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
	if (!visualElement) return void 0;
	if (!visualElement.isControllingVariants) {
		const context$1 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
		if (visualElement.props.initial !== void 0) context$1.initial = visualElement.props.initial;
		return context$1;
	}
	const context = {};
	for (let i = 0; i < numVariantProps; i++) {
		const name = variantProps[i];
		const prop = visualElement.props[name];
		if (isVariantLabel(prop) || prop === false) context[name] = prop;
	}
	return context;
}
//#endregion
//#region node_modules/motion-v/dist/es/state/animation-state.mjs
var variantPriorityOrder = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whilePress",
	"whileDrag",
	"exit"
];
var reversePriorityOrder = [...variantPriorityOrder].reverse();
var numAnimationTypes = variantPriorityOrder.length;
function createTypeState(isActive = false) {
	return {
		isActive,
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
}
function createState() {
	return {
		animate: createTypeState(true),
		whileInView: createTypeState(),
		whileHover: createTypeState(),
		whilePress: createTypeState(),
		whileDrag: createTypeState(),
		whileFocus: createTypeState(),
		exit: createTypeState()
	};
}
function checkVariantsDidChange(prev, next) {
	if (typeof next === "string") return next !== prev;
	else if (Array.isArray(next)) return !shallowCompare(next, prev);
	return false;
}
function isKeyframesTarget(v) {
	return Array.isArray(v);
}
function createAnimateFunction(visualElement) {
	return (animations) => {
		return Promise.all(animations.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
	};
}
function createAnimationState(visualElement) {
	let animate = createAnimateFunction(visualElement);
	let state = createState();
	let isInitialRender = true;
	const buildResolvedTypeValues = (type) => (acc, definition) => {
		const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
		if (resolved) {
			const { transition, transitionEnd, ...target } = resolved;
			acc = {
				...acc,
				...target,
				...transitionEnd
			};
		}
		return acc;
	};
	function setAnimateFunction(makeAnimator) {
		animate = makeAnimator(visualElement);
	}
	function animateChanges(changedActiveType) {
		const { props } = visualElement;
		const context = getVariantContext(visualElement.parent) || {};
		const animations = [];
		const removedKeys = /* @__PURE__ */ new Set();
		let encounteredKeys = {};
		let removedVariantIndex = Infinity;
		for (let i = 0; i < numAnimationTypes; i++) {
			const type = reversePriorityOrder[i];
			const typeState = state[type];
			const prop = props[type] !== void 0 ? props[type] : context[type];
			const propIsVariant = isVariantLabel(prop);
			const activeDelta = type === changedActiveType ? typeState.isActive : null;
			if (activeDelta === false) removedVariantIndex = i;
			let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
			if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) isInherited = false;
			typeState.protectedKeys = { ...encounteredKeys };
			if (!typeState.isActive && activeDelta === null || !prop && !typeState.prevProp || isAnimationControls(prop) || typeof prop === "boolean") continue;
			const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
			let shouldAnimateType = variantDidChange || type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || i > removedVariantIndex && propIsVariant;
			let handledRemovedValues = false;
			const definitionList = Array.isArray(prop) ? prop : [prop];
			let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
			if (activeDelta === false) resolvedValues = {};
			const { prevResolvedValues = {} } = typeState;
			const allKeys = {
				...prevResolvedValues,
				...resolvedValues
			};
			const markToAnimate = (key) => {
				shouldAnimateType = true;
				if (removedKeys.has(key)) {
					handledRemovedValues = true;
					removedKeys.delete(key);
				}
				typeState.needsAnimating[key] = true;
				const motionValue$1 = visualElement.getValue(key);
				if (motionValue$1) motionValue$1.liveStyle = false;
			};
			for (const key in allKeys) {
				const next = resolvedValues[key];
				const prev = prevResolvedValues[key];
				if (Object.hasOwnProperty.call(encounteredKeys, key)) continue;
				let valueHasChanged = false;
				if (isKeyframesTarget(next) && isKeyframesTarget(prev)) valueHasChanged = !shallowCompare(next, prev);
				else valueHasChanged = next !== prev;
				if (valueHasChanged) if (next !== void 0 && next !== null) markToAnimate(key);
				else removedKeys.add(key);
				else if (next !== void 0 && removedKeys.has(key)) markToAnimate(key);
				else typeState.protectedKeys[key] = true;
			}
			typeState.prevProp = prop;
			typeState.prevResolvedValues = resolvedValues;
			if (typeState.isActive) encounteredKeys = {
				...encounteredKeys,
				...resolvedValues
			};
			if (isInitialRender && visualElement.blockInitialAnimation) shouldAnimateType = false;
			const willAnimateViaParent = isInherited && variantDidChange;
			if (shouldAnimateType && (!willAnimateViaParent || handledRemovedValues)) animations.push(...definitionList.map((animation) => {
				const options = { type };
				if (typeof animation === "string" && isInitialRender && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
					const { parent } = visualElement;
					const parentVariant = resolveVariant(parent, animation);
					if (parent.enteringChildren && parentVariant) {
						const { delayChildren } = parentVariant.transition || {};
						options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
					}
				}
				return {
					animation,
					options
				};
			}));
		}
		if (removedKeys.size) {
			const fallbackAnimation = {};
			if (typeof props.initial !== "boolean") {
				const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
				if (initialTransition && initialTransition.transition) fallbackAnimation.transition = initialTransition.transition;
			}
			removedKeys.forEach((key) => {
				const fallbackTarget = visualElement.getBaseTarget(key);
				const motionValue$1 = visualElement.getValue(key);
				if (motionValue$1) motionValue$1.liveStyle = true;
				fallbackAnimation[key] = fallbackTarget ?? null;
			});
			animations.push({ animation: fallbackAnimation });
		}
		let shouldAnimate = Boolean(animations.length);
		if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) shouldAnimate = false;
		isInitialRender = false;
		return shouldAnimate ? animate(animations) : Promise.resolve();
	}
	function setActive(type, isActive) {
		if (state[type].isActive === isActive) return Promise.resolve();
		visualElement.variantChildren?.forEach((child) => {
			child.animationState?.setActive(type, isActive);
		});
		state[type].isActive = isActive;
		const animations = animateChanges(type);
		for (const key in state) state[key].protectedKeys = {};
		return animations;
	}
	return {
		animateChanges,
		setActive,
		setAnimateFunction,
		getState: () => state,
		reset: () => {
			state = createState();
			isInitialRender = true;
		}
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/utils/is-hidden.mjs
function isHidden(element) {
	return element.style.display === "none" || element.offsetParent === null && (void 0).getComputedStyle(element).position !== "fixed";
}
//#endregion
//#region node_modules/motion-v/dist/es/features/animation/animation.mjs
var AnimationFeature = class extends Feature {
	static #_ = this.key = "animation";
	constructor(state) {
		super(state);
		const ve = state.visualElement;
		ve.animationState ||= createAnimationState(ve);
	}
	updateAnimationControlsSubscription() {
		const { animate } = this.state.options;
		if (isAnimationControls(animate)) this.unmountControls = animate.subscribe(this.state.visualElement);
	}
	mount() {
		if (!!isHidden(this.state.element)) this.state.setActive("exit", true);
		else this.state.visualElement.animationState?.animateChanges();
		this.updateAnimationControlsSubscription();
	}
	update() {
		this.state.visualElement.animationState?.animateChanges();
		const { animate } = this.state.visualElement.getProps();
		const { animate: prevAnimate } = this.state.visualElement.prevProps || {};
		if (animate !== prevAnimate) this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.state.visualElement.animationState.reset();
		this.unmountControls?.();
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/state/create-visual-element.mjs
function createVisualElement(Component, options) {
	return isSVGElement(Component) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/press/index.mjs
function extractEventInfo$1(event) {
	return { point: {
		x: event.pageX,
		y: event.pageY
	} };
}
var PressGesture = class extends Feature {
	static #_ = this.key = "press";
	constructor(state) {
		super(state);
	}
	isActive() {
		const { whilePress, onPress, onPressCancel, onPressStart } = this.state.options;
		return Boolean(whilePress || onPress || onPressCancel || onPressStart);
	}
	register() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;
		this.removePress?.();
		this.removePress = press(element, (_el, startEvent) => {
			const props = this.state.options;
			this.state.setActive("whilePress", true);
			if (props.onPressStart) frame.postRender(() => props.onPressStart(startEvent, extractEventInfo$1(startEvent)));
			return (endEvent, { success }) => {
				this.state.setActive("whilePress", false);
				const callbackName = success ? "onPress" : "onPressCancel";
				const callback = this.state.options[callbackName];
				if (callback) frame.postRender(() => callback(endEvent, extractEventInfo$1(endEvent)));
			};
		}, { useGlobalTarget: this.state.options.globalPressTarget });
	}
	mount() {
		this.register();
	}
	update() {
		const prev = this.state.visualElement.prevProps;
		if (!Boolean(prev?.whilePress || prev?.whileTap || prev?.onPress || prev?.onPressCancel || prev?.onPressStart) && this.isActive()) this.register();
	}
	unmount() {
		this.removePress?.();
		this.removePress = void 0;
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/events/utils/is-primary-pointer.mjs
function isPrimaryPointer(event) {
	if (event.pointerType === "mouse") return typeof event.button !== "number" || event.button <= 0;
	else return event.isPrimary !== false;
}
//#endregion
//#region node_modules/motion-v/dist/es/events/event-info.mjs
function extractEventInfo(event, pointType = "page") {
	return { point: {
		x: event[`${pointType}X`],
		y: event[`${pointType}Y`]
	} };
}
function addPointerInfo(handler) {
	return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/hover/index.mjs
var HoverGesture = class extends Feature {
	static #_ = this.key = "hover";
	constructor(state) {
		super(state);
	}
	isActive() {
		const { whileHover, onHoverStart, onHoverEnd } = this.state.options;
		return Boolean(whileHover || onHoverStart || onHoverEnd);
	}
	register() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;
		this.removeHover?.();
		this.removeHover = hover(element, (_el, startEvent) => {
			const props = this.state.options;
			this.state.setActive("whileHover", true);
			if (props.onHoverStart) frame.postRender(() => props.onHoverStart(startEvent, extractEventInfo(startEvent)));
			return (endEvent) => {
				this.state.setActive("whileHover", false);
				const callback = this.state.options.onHoverEnd;
				if (callback) frame.postRender(() => callback(endEvent, extractEventInfo(endEvent)));
			};
		});
	}
	mount() {
		this.register();
	}
	update() {
		const prev = this.state.visualElement.prevProps;
		if (!Boolean(prev?.whileHover || prev?.onHoverStart || prev?.onHoverEnd) && this.isActive()) this.register();
	}
	unmount() {
		this.removeHover?.();
		this.removeHover = void 0;
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/in-view/index.mjs
var InViewGesture = class extends Feature {
	static #_ = this.key = "inView";
	constructor(state) {
		super(state);
	}
	isActive() {
		const { whileInView, onViewportEnter, onViewportLeave } = this.state.options;
		return Boolean(whileInView || onViewportEnter || onViewportLeave);
	}
	startObserver() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;
		this.removeObserver?.();
		const { once, ...viewOptions } = this.state.options.inViewOptions || {};
		this.removeObserver = inView(element, (_, entry) => {
			const props = this.state.options;
			this.state.setActive("whileInView", true);
			if (props.onViewportEnter) frame.postRender(() => props.onViewportEnter(entry));
			if (!once) return () => {
				this.state.setActive("whileInView", false);
				const leaveCallback = this.state.options.onViewportLeave;
				if (leaveCallback) frame.postRender(() => leaveCallback(entry));
			};
		}, viewOptions);
	}
	mount() {
		this.startObserver();
	}
	update() {
		const { props, prevProps } = this.state.visualElement;
		if ([
			"amount",
			"margin",
			"root"
		].some((name) => {
			return props.inViewOptions?.[name] !== prevProps?.inViewOptions?.[name];
		})) this.startObserver();
	}
	unmount() {
		this.removeObserver?.();
		this.removeObserver = void 0;
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/events/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options = { passive: true }) {
	target.addEventListener(eventName, handler, options);
	return () => target.removeEventListener(eventName, handler);
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/focus/index.mjs
var FocusGesture = class extends Feature {
	static #_ = this.key = "focus";
	constructor(state) {
		super(state);
		this.isFocused = false;
	}
	onFocus() {
		let isFocusVisible = false;
		try {
			isFocusVisible = this.state.element.matches(":focus-visible");
		} catch {
			isFocusVisible = true;
		}
		if (!isFocusVisible) return;
		this.state.setActive("whileFocus", true);
		this.isFocused = true;
	}
	onBlur() {
		if (!this.isFocused) return;
		this.state.setActive("whileFocus", false);
		this.isFocused = false;
	}
	mount() {
		const element = this.state.element;
		this.removeFocus = pipe(addDomEvent(element, "focus", () => this.onFocus()), addDomEvent(element, "blur", () => this.onBlur()));
	}
	unmount() {
		this.removeFocus?.();
		this.removeFocus = void 0;
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/layout/utils.mjs
function getClosestProjectingNode(visualElement) {
	if (!visualElement) return void 0;
	return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
//#endregion
//#region node_modules/motion-v/dist/es/features/layout/config.mjs
var defaultScaleCorrector = {
	borderRadius: {
		...correctBorderRadius,
		applyTo: [
			"borderTopLeftRadius",
			"borderTopRightRadius",
			"borderBottomLeftRadius",
			"borderBottomRightRadius"
		]
	},
	borderTopLeftRadius: correctBorderRadius,
	borderTopRightRadius: correctBorderRadius,
	borderBottomLeftRadius: correctBorderRadius,
	borderBottomRightRadius: correctBorderRadius,
	boxShadow: correctBoxShadow
};
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/drag/utils/is.mjs
function isHTMLElement(value) {
	return typeof value === "object" && value !== null && "nodeType" in value;
}
//#endregion
//#region node_modules/motion-v/dist/es/features/layout/projection.mjs
var ProjectionFeature = class extends Feature {
	static #_ = this.key = "projection";
	constructor(state) {
		super(state);
		addScaleCorrector(defaultScaleCorrector);
	}
	initProjection() {
		const options = this.state.options;
		this.state.visualElement.projection = new HTMLProjectionNode(this.state.visualElement.latestValues, options["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(this.state.visualElement.parent));
		this.projection = this.state.visualElement.projection;
		this.projection.isPresent = true;
		this.setOptions();
	}
	setOptions() {
		const options = this.state.options;
		const { layoutId, layout, drag = false, dragConstraints = false } = options;
		this.projection?.setOptions({
			layout,
			layoutId,
			alwaysMeasureLayout: Boolean(layoutId) || Boolean(drag) || dragConstraints && isHTMLElement(dragConstraints),
			visualElement: this.state.visualElement,
			animationType: typeof options.layout === "string" ? options.layout : "both",
			layoutRoot: options.layoutRoot,
			layoutScroll: options.layoutScroll,
			crossfade: options.crossfade,
			onExitComplete: () => {
				if (!this.projection?.isPresent && this.state.options.layoutId && !this.state.isExiting) queueMicrotask(() => {
					this.state.options.presenceContext?.onMotionExitComplete?.(this.state.presenceContainer, this.state);
				});
			}
		});
	}
	update() {
		this.setOptions();
	}
	mount() {
		this.projection?.mount(this.state.element);
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/events/add-pointer-event.mjs
function addPointerEvent(target, eventName, handler, options) {
	return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/pan/PanSession.mjs
var overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
var PanSession = class {
	constructor(event, handlers, { transformPagePoint, contextWindow, dragSnapToOrigin = false, element } = {}) {
		this.startEvent = null;
		this.lastMoveEvent = null;
		this.lastMoveEventInfo = null;
		this.handlers = {};
		this.contextWindow = void 0;
		this.scrollPositions = /* @__PURE__ */ new Map();
		this.onElementScroll = (event$1) => {
			this.handleScroll(event$1.target);
		};
		this.onWindowScroll = () => {
			this.handleScroll(void 0);
		};
		this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			const info = getPanInfo(this.lastMoveEventInfo, this.history);
			const isPanStarted = this.startEvent !== null;
			const isDistancePastThreshold = distance2D(info.offset, {
				x: 0,
				y: 0
			}) >= 3;
			if (!isPanStarted && !isDistancePastThreshold) return;
			const { point: point$1 } = info;
			const { timestamp: timestamp$1 } = frameData;
			this.history.push({
				...point$1,
				timestamp: timestamp$1
			});
			const { onStart, onMove } = this.handlers;
			if (!isPanStarted) {
				onStart && onStart(this.lastMoveEvent, info);
				this.startEvent = this.lastMoveEvent;
			}
			onMove && onMove(this.lastMoveEvent, info);
		};
		this.handlePointerMove = (event$1, info) => {
			this.lastMoveEvent = event$1;
			this.lastMoveEventInfo = transformPoint(info, this.transformPagePoint);
			frame$1.update(this.updatePoint, true);
		};
		this.handlePointerUp = (event$1, info) => {
			this.end();
			const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
			if (this.dragSnapToOrigin || !this.startEvent) resumeAnimation && resumeAnimation();
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			const panInfo = getPanInfo(event$1.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info, this.transformPagePoint), this.history);
			if (this.startEvent && onEnd) onEnd(event$1, panInfo);
			onSessionEnd && onSessionEnd(event$1, panInfo);
		};
		if (!isPrimaryPointer(event)) return;
		this.dragSnapToOrigin = dragSnapToOrigin;
		this.handlers = handlers;
		this.transformPagePoint = transformPagePoint;
		this.contextWindow = contextWindow || void 0;
		const initialInfo = transformPoint(extractEventInfo(event), this.transformPagePoint);
		const { point } = initialInfo;
		const { timestamp } = frameData;
		this.history = [{
			...point,
			timestamp
		}];
		const { onSessionStart } = handlers;
		onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
		this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
		if (element) this.startScrollTracking(element);
	}
	isScrollable(node) {
		const style = (void 0).getComputedStyle(node);
		return style.overflow === "auto" || style.overflow === "scroll" || style.overflowX === "auto" || style.overflowX === "scroll" || style.overflowY === "auto" || style.overflowY === "scroll";
	}
	startScrollTracking(element) {
		let current = element.parentElement;
		while (current) {
			const style = getComputedStyle(current);
			if (overflowStyles.has(style.overflowX) || overflowStyles.has(style.overflowY)) this.scrollPositions.set(current, {
				x: current.scrollLeft,
				y: current.scrollTop
			});
			current = current.parentElement;
		}
		this.scrollPositions.set(void 0, {
			x: (void 0).scrollX,
			y: (void 0).scrollY
		});
		(void 0).addEventListener("scroll", this.onElementScroll, {
			capture: true,
			passive: true
		});
		(void 0).addEventListener("scroll", this.onWindowScroll, { passive: true });
		this.removeScrollListeners = () => {
			(void 0).removeEventListener("scroll", this.onElementScroll, { capture: true });
			(void 0).removeEventListener("scroll", this.onWindowScroll);
		};
	}
	handleScroll(target) {
		const initial = this.scrollPositions.get(target);
		if (!initial) return;
		const isWindow = target === void 0;
		const current = isWindow ? {
			x: (void 0).scrollX,
			y: (void 0).scrollY
		} : {
			x: target.scrollLeft,
			y: target.scrollTop
		};
		const delta = {
			x: current.x - initial.x,
			y: current.y - initial.y
		};
		if (delta.x === 0 && delta.y === 0) return;
		if (isWindow) {
			if (this.lastMoveEventInfo) {
				this.lastMoveEventInfo.point.x += delta.x;
				this.lastMoveEventInfo.point.y += delta.y;
			}
		} else if (this.history.length > 0) {
			this.history[0].x -= delta.x;
			this.history[0].y -= delta.y;
		}
		this.scrollPositions.set(target, current);
		frame$1.update(this.updatePoint, true);
	}
	updateHandlers(handlers) {
		this.handlers = handlers;
	}
	end() {
		this.removeListeners && this.removeListeners();
		this.removeScrollListeners?.();
		this.scrollPositions.clear();
		cancelFrame(this.updatePoint);
	}
};
function transformPoint(info, transformPagePoint) {
	return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
	return {
		x: a.x - b.x,
		y: a.y - b.y
	};
}
function getPanInfo({ point }, history) {
	return {
		point,
		delta: subtractPoint(point, lastDevicePoint(history)),
		offset: subtractPoint(point, startDevicePoint(history)),
		velocity: getVelocity(history, .1)
	};
}
function startDevicePoint(history) {
	return history[0];
}
function lastDevicePoint(history) {
	return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
	if (history.length < 2) return {
		x: 0,
		y: 0
	};
	let i = history.length - 1;
	let timestampedPoint = null;
	const lastPoint = lastDevicePoint(history);
	while (i >= 0) {
		timestampedPoint = history[i];
		if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) break;
		i--;
	}
	if (!timestampedPoint) return {
		x: 0,
		y: 0
	};
	const time = millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
	if (time === 0) return {
		x: 0,
		y: 0
	};
	const currentVelocity = {
		x: (lastPoint.x - timestampedPoint.x) / time,
		y: (lastPoint.y - timestampedPoint.y) / time
	};
	if (currentVelocity.x === Infinity) currentVelocity.x = 0;
	if (currentVelocity.y === Infinity) currentVelocity.y = 0;
	return currentVelocity;
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/pan/index.mjs
function asyncHandler(handler) {
	return (event, info) => {
		if (handler) frame.postRender(() => handler(event, info));
	};
}
var PanGesture = class extends Feature {
	constructor(..._args) {
		super(..._args);
		this.removePointerDownListener = noop;
	}
	static #_ = this.key = "pan";
	onPointerDown(pointerDownEvent) {
		this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
			transformPagePoint: this.state.visualElement.getTransformPagePoint(),
			contextWindow: getContextWindow(this.state.visualElement)
		});
	}
	createPanHandlers() {
		return {
			onSessionStart: asyncHandler((_, info) => {
				const { onPanSessionStart } = this.state.options;
				onPanSessionStart && onPanSessionStart(_, info);
			}),
			onStart: asyncHandler((_, info) => {
				const { onPanStart } = this.state.options;
				onPanStart && onPanStart(_, info);
			}),
			onMove: (event, info) => {
				const { onPan } = this.state.options;
				onPan && onPan(event, info);
			},
			onEnd: (event, info) => {
				const { onPanEnd } = this.state.options;
				delete this.session;
				if (onPanEnd) frame.postRender(() => onPanEnd(event, info));
			}
		};
	}
	mount() {
		this.removePointerDownListener = addPointerEvent(this.state.element, "pointerdown", this.onPointerDown.bind(this));
	}
	update() {}
	unmount() {
		this.removePointerDownListener();
		this.session && this.session.end();
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/drag/lock.mjs
function createLock(name) {
	let lock = null;
	return () => {
		const openLock = () => {
			lock = null;
		};
		if (lock === null) {
			lock = name;
			return openLock;
		}
		return false;
	};
}
var globalHorizontalLock = createLock("dragHorizontal");
var globalVerticalLock = createLock("dragVertical");
function getGlobalLock(drag) {
	let lock = false;
	if (drag === "y") lock = globalVerticalLock();
	else if (drag === "x") lock = globalHorizontalLock();
	else {
		const openHorizontal = globalHorizontalLock();
		const openVertical = globalVerticalLock();
		if (openHorizontal && openVertical) lock = () => {
			openHorizontal();
			openVertical();
		};
		else {
			if (openHorizontal) openHorizontal();
			if (openVertical) openVertical();
		}
	}
	return lock;
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/drag/utils/constraints.mjs
function applyConstraints(point, { min, max }, elastic) {
	if (min !== void 0 && point < min) point = elastic ? mixNumber(min, point, elastic.min) : Math.max(point, min);
	else if (max !== void 0 && point > max) point = elastic ? mixNumber(max, point, elastic.max) : Math.min(point, max);
	return point;
}
var defaultElastic = .35;
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
	return {
		x: calcRelativeAxisConstraints(layoutBox.x, left, right),
		y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
	};
}
function calcRelativeAxisConstraints(axis, min, max) {
	return {
		min: min !== void 0 ? axis.min + min : void 0,
		max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
	};
}
function resolveDragElastic(dragElastic = defaultElastic) {
	if (dragElastic === false) dragElastic = 0;
	else if (dragElastic === true) dragElastic = defaultElastic;
	return {
		x: resolveAxisElastic(dragElastic, "left", "right"),
		y: resolveAxisElastic(dragElastic, "top", "bottom")
	};
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
	return {
		min: resolvePointElastic(dragElastic, minLabel),
		max: resolvePointElastic(dragElastic, maxLabel)
	};
}
function resolvePointElastic(dragElastic, label) {
	return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
function rebaseAxisConstraints(layout, constraints) {
	const relativeConstraints = {};
	if (constraints.min !== void 0) relativeConstraints.min = constraints.min - layout.min;
	if (constraints.max !== void 0) relativeConstraints.max = constraints.max - layout.min;
	return relativeConstraints;
}
function calcViewportConstraints(layoutBox, constraintsBox) {
	return {
		x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
		y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
	};
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
	let min = constraintsAxis.min - layoutAxis.min;
	let max = constraintsAxis.max - layoutAxis.max;
	if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) [min, max] = [max, min];
	return {
		min,
		max
	};
}
function calcOrigin(source, target) {
	let origin = .5;
	const sourceLength = calcLength(source);
	const targetLength = calcLength(target);
	if (targetLength > sourceLength) origin = progress(target.min, target.max - sourceLength, source.min);
	else if (sourceLength > targetLength) origin = progress(source.min, source.max - targetLength, target.min);
	return clamp(0, 1, origin);
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/drag/VisualElementDragControls.mjs
var elementDragControls = /* @__PURE__ */ new WeakMap();
var VisualElementDragControls = class {
	constructor(state) {
		this.openGlobalLock = null;
		this.isDragging = false;
		this.currentDirection = null;
		this.originPoint = {
			x: 0,
			y: 0
		};
		this.constraints = false;
		this.hasMutatedConstraints = false;
		this.elastic = createBox();
		this.state = state;
	}
	get visualElement() {
		return this.state.visualElement;
	}
	start(originEvent, { snapToCursor = false } = {}) {
		const onSessionStart = (event) => {
			if (snapToCursor) this.stopAnimation();
			else this.pauseAnimation();
			if (snapToCursor) this.snapToCursor(extractEventInfo(event, "page").point);
		};
		const onStart = (event, info) => {
			this.stopAnimation();
			const { drag, dragPropagation, onDragStart } = this.getProps();
			if (drag && !dragPropagation) {
				if (this.openGlobalLock) this.openGlobalLock();
				this.openGlobalLock = getGlobalLock(drag);
				if (!this.openGlobalLock) return;
			}
			this.isDragging = true;
			this.currentDirection = null;
			this.resolveConstraints();
			if (this.visualElement.projection) {
				this.visualElement.projection.isAnimationBlocked = true;
				this.visualElement.projection.target = void 0;
			}
			eachAxis((axis) => {
				let current = this.getAxisMotionValue(axis).get() || 0;
				if (percent.test(current)) {
					const { projection } = this.visualElement;
					if (projection && projection.layout) {
						const measuredAxis = projection.layout.layoutBox[axis];
						if (measuredAxis) current = calcLength(measuredAxis) * (parseFloat(current) / 100);
					}
				}
				this.originPoint[axis] = current;
			});
			if (onDragStart) frame.postRender(() => onDragStart(event, info));
			addValueToWillChange(this.visualElement, "transform");
			this.state.setActive("whileDrag", true);
		};
		const onMove = (event, info) => {
			const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
			if (!dragPropagation && !this.openGlobalLock) return;
			const { offset } = info;
			if (dragDirectionLock && this.currentDirection === null) {
				this.currentDirection = getCurrentDirection(offset);
				if (this.currentDirection !== null) onDirectionLock && onDirectionLock(this.currentDirection);
				return;
			}
			this.updateAxis("x", info.point, offset);
			this.updateAxis("y", info.point, offset);
			this.visualElement.render();
			onDrag && onDrag(event, info);
		};
		const onSessionEnd = (event, info) => this.stop(event, info);
		const resumeAnimation = () => eachAxis((axis) => this.getAnimationState(axis) === "paused" && this.getAxisMotionValue(axis).animation?.play());
		const { dragSnapToOrigin } = this.getProps();
		this.panSession = new PanSession(originEvent, {
			onSessionStart,
			onStart,
			onMove,
			onSessionEnd,
			resumeAnimation
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin,
			contextWindow: getContextWindow(this.visualElement),
			element: this.state.element
		});
	}
	stop(event, info) {
		const isDragging = this.isDragging;
		this.cancel();
		if (!isDragging) return;
		const { velocity } = info;
		this.startAnimation(velocity);
		const { onDragEnd } = this.getProps();
		if (onDragEnd) frame.postRender(() => onDragEnd(event, info));
	}
	cancel() {
		this.isDragging = false;
		const { projection } = this.visualElement;
		if (projection) projection.isAnimationBlocked = false;
		this.panSession && this.panSession.end();
		this.panSession = void 0;
		const { dragPropagation } = this.getProps();
		if (!dragPropagation && this.openGlobalLock) {
			this.openGlobalLock();
			this.openGlobalLock = null;
		}
		this.state.setActive("whileDrag", false);
	}
	updateAxis(axis, _point, offset) {
		const { drag } = this.getProps();
		if (!offset || !shouldDrag(axis, drag, this.currentDirection)) return;
		const axisValue = this.getAxisMotionValue(axis);
		let next = this.originPoint[axis] + offset[axis];
		if (this.constraints && this.constraints[axis]) next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
		axisValue.set(next);
	}
	resolveConstraints() {
		const { dragConstraints, dragElastic } = this.getProps();
		const layout = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
		const prevConstraints = this.constraints;
		if (dragConstraints && isHTMLElement(dragConstraints)) {
			if (!this.constraints) this.constraints = this.resolveRefConstraints();
		} else if (dragConstraints && layout) this.constraints = calcRelativeConstraints(layout.layoutBox, dragConstraints);
		else this.constraints = false;
		this.elastic = resolveDragElastic(dragElastic);
		if (prevConstraints !== this.constraints && layout && this.constraints && !this.hasMutatedConstraints) eachAxis((axis) => {
			if (this.constraints !== false && this.getAxisMotionValue(axis)) this.constraints[axis] = rebaseAxisConstraints(layout.layoutBox[axis], this.constraints[axis]);
		});
	}
	resolveRefConstraints() {
		const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
		if (!constraints || !isHTMLElement(constraints)) return false;
		const constraintsElement = constraints;
		invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
		const { projection } = this.visualElement;
		if (!projection || !projection.layout) return false;
		const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
		let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
		if (onMeasureDragConstraints) {
			const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
			this.hasMutatedConstraints = !!userConstraints;
			if (userConstraints) measuredConstraints = convertBoundingBoxToBox(userConstraints);
		}
		return measuredConstraints;
	}
	startAnimation(velocity) {
		const { drag, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
		const constraints = this.constraints || {};
		const momentumAnimations = eachAxis((axis) => {
			if (!shouldDrag(axis, drag, this.currentDirection)) return;
			let transition = constraints && constraints[axis] || {};
			if (dragSnapToOrigin) transition = {
				min: 0,
				max: 0
			};
			const bounceStiffness = dragElastic ? 200 : 1e6;
			const bounceDamping = dragElastic ? 40 : 1e7;
			const inertia = {
				type: "inertia",
				velocity: dragMomentum ? velocity[axis] : 0,
				bounceStiffness,
				bounceDamping,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...dragTransition,
				...transition
			};
			return this.startAxisValueAnimation(axis, inertia);
		});
		return Promise.all(momentumAnimations).then(onDragTransitionEnd);
	}
	startAxisValueAnimation(axis, transition) {
		const axisValue = this.getAxisMotionValue(axis);
		addValueToWillChange(this.visualElement, axis);
		return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
	}
	stopAnimation() {
		if (!this.visualElement.projection?.isPresent) return;
		eachAxis((axis) => this.getAxisMotionValue(axis).stop());
	}
	pauseAnimation() {
		eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
	}
	getAnimationState(axis) {
		return this.getAxisMotionValue(axis).animation?.state;
	}
	getAxisMotionValue(axis) {
		const dragKey = `_drag${axis.toUpperCase()}`;
		const props = this.visualElement.getProps();
		return props[dragKey] || this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
	}
	snapToCursor(point) {
		eachAxis((axis) => {
			const { drag } = this.getProps();
			if (!shouldDrag(axis, drag, this.currentDirection)) return;
			const { projection } = this.visualElement;
			const axisValue = this.getAxisMotionValue(axis);
			if (projection && projection.layout) {
				const { min, max } = projection.layout.layoutBox[axis];
				axisValue.set(point[axis] - mixNumber(min, max, .5));
			}
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		const { drag, dragConstraints } = this.getProps();
		const { projection } = this.visualElement;
		if (!isHTMLElement(dragConstraints) || !projection || !this.constraints) return;
		this.stopAnimation();
		const boxProgress = {
			x: 0,
			y: 0
		};
		eachAxis((axis) => {
			const axisValue = this.getAxisMotionValue(axis);
			if (axisValue && this.constraints !== false) {
				const latest = axisValue.get();
				boxProgress[axis] = calcOrigin({
					min: latest,
					max: latest
				}, this.constraints[axis]);
			}
		});
		const { transformTemplate } = this.visualElement.getProps();
		this.state.element.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
		projection.root && projection.root.updateScroll();
		projection.updateLayout();
		this.resolveConstraints();
		eachAxis((axis) => {
			if (!shouldDrag(axis, drag, null)) return;
			const axisValue = this.getAxisMotionValue(axis);
			const { min, max } = this.constraints[axis];
			axisValue.set(mixNumber(min, max, boxProgress[axis]));
		});
	}
	addListeners() {
		if (!this.state.element) return;
		elementDragControls.set(this.visualElement, this);
		const element = this.state.element;
		const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
			const { drag, dragListener = true } = this.getProps();
			drag && dragListener && this.start(event);
		});
		const measureDragConstraints = () => {
			const { dragConstraints } = this.getProps();
			if (isHTMLElement(dragConstraints)) this.constraints = this.resolveRefConstraints();
		};
		const { projection } = this.visualElement;
		const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
		if (projection && !projection.layout) {
			projection.root && projection.root.updateScroll();
			projection.updateLayout();
		}
		frame.read(measureDragConstraints);
		const stopResizeListener = addDomEvent(void 0, "resize", () => this.scalePositionWithinConstraints());
		const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
			if (this.isDragging && hasLayoutChanged) {
				eachAxis((axis) => {
					const motionValue$1 = this.getAxisMotionValue(axis);
					if (!motionValue$1) return;
					this.originPoint[axis] += delta[axis].translate;
					motionValue$1.set(motionValue$1.get() + delta[axis].translate);
				});
				this.visualElement.render();
			}
		}));
		return () => {
			stopResizeListener();
			stopPointerListener();
			stopMeasureLayoutListener();
			stopLayoutUpdateListener && stopLayoutUpdateListener();
		};
	}
	getProps() {
		const props = this.visualElement.getProps();
		const { drag = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
		return {
			...props,
			drag,
			dragDirectionLock,
			dragPropagation,
			dragConstraints,
			dragElastic,
			dragMomentum
		};
	}
};
function shouldDrag(direction, drag, currentDirection) {
	return (drag === true || drag === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
	let direction = null;
	if (Math.abs(offset.y) > lockThreshold) direction = "y";
	else if (Math.abs(offset.x) > lockThreshold) direction = "x";
	return direction;
}
//#endregion
//#region node_modules/motion-v/dist/es/features/gestures/drag/index.mjs
var DragGesture = class extends Feature {
	static #_ = this.key = "drag";
	constructor(state) {
		super(state);
		this.removeGroupControls = noop;
		this.removeListeners = noop;
		this.controls = new VisualElementDragControls(state);
	}
	mount() {
		const { dragControls } = this.state.options;
		if (dragControls) this.removeGroupControls = dragControls.subscribe(this.controls);
		this.removeListeners = this.controls.addListeners() || noop;
	}
	unmount() {
		this.removeGroupControls();
		this.removeListeners();
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/layout/layout.mjs
var hasLayoutUpdate = false;
var LayoutFeature = class extends Feature {
	static #_ = this.key = "layout";
	constructor(state) {
		super(state);
		this.hasMountSettled = false;
		addScaleCorrector(defaultScaleCorrector);
		state.getSnapshot = this.getSnapshot.bind(this);
		state.didUpdate = this.didUpdate.bind(this);
	}
	updatePrevLead(projection) {
		const stack = projection.getStack();
		if (stack?.prevLead && !stack.prevLead.snapshot) {
			stack.prevLead.willUpdate();
			hasLayoutUpdate = true;
		}
	}
	didUpdate() {
		if (!hasLayoutUpdate) return;
		if (this.state.options.layout || this.state.options.layoutId || this.state.options.drag) {
			hasLayoutUpdate = false;
			this.state.visualElement.projection?.root?.didUpdate();
		}
	}
	mount() {
		const options = this.state.options;
		const layoutGroup = this.state.options.layoutGroup;
		if (options.layout || options.layoutId) {
			const projection = this.state.visualElement.projection;
			if (options.layoutId) {
				const isPresent = !isHidden(this.state.element);
				projection.isPresent = isPresent;
				isPresent ? projection.promote() : projection.relegate();
				this.updatePrevLead(projection);
			}
			layoutGroup?.group?.add(projection);
			globalProjectionState.hasEverUpdated = true;
		}
		this.didUpdate();
		frame.postRender(() => {
			this.hasMountSettled = true;
		});
	}
	unmount() {
		const layoutGroup = this.state.options.layoutGroup;
		const projection = this.state.visualElement.projection;
		if (projection) {
			if (layoutGroup?.group && (this.state.options.layout || this.state.options.layoutId)) layoutGroup.group.remove(projection);
			if (this.state.options.layoutId) hasLayoutUpdate = true;
			this.didUpdate();
		}
	}
	getSnapshot(newOptions, isPresent) {
		const projection = this.state.visualElement.projection;
		const { drag, layoutDependency, layout, layoutId } = newOptions;
		if (!projection || !layout && !layoutId && !drag) return;
		if (!this.hasMountSettled) return;
		hasLayoutUpdate = true;
		const prevProps = this.state.options;
		if (drag || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || isDef(isPresent) && projection.isPresent !== isPresent) projection.willUpdate();
		if (isDef(isPresent) && isPresent !== projection.isPresent) {
			projection.isPresent = isPresent;
			if (isPresent) {
				projection.promote();
				this.updatePrevLead(projection);
			} else projection.relegate();
		}
	}
};
//#endregion
//#region node_modules/motion-v/dist/es/features/dom-max.mjs
var domMax = {
	renderer: createVisualElement,
	features: [
		AnimationFeature,
		PressGesture,
		HoverGesture,
		InViewGesture,
		FocusGesture,
		ProjectionFeature,
		PanGesture,
		DragGesture,
		LayoutFeature
	]
};
//#endregion
//#region node_modules/motion-v/dist/es/components/lazy-motion/context.mjs
var [useLazyMotionContext] = createContext("LazyMotionContext");
//#endregion
//#region node_modules/motion-v/dist/es/components/animate-presence/presence.mjs
var [injectAnimatePresence, provideAnimatePresence] = createContext("AnimatePresenceContext");
//#endregion
//#region node_modules/motion-v/dist/es/state/style.mjs
function camelToDash(str) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
function createHTMLRenderState() {
	return {
		transform: {},
		transformOrigin: {},
		style: {},
		vars: {}
	};
}
function createSVGRenderState() {
	return {
		...createHTMLRenderState(),
		attrs: {}
	};
}
function createStyles(latestValues) {
	const state = createHTMLRenderState();
	buildHTMLStyles(state, latestValues);
	const result = { ...state.style };
	for (const key in state.vars) result[key] = state.vars[key];
	if (Object.keys(result).length === 0) return null;
	return result;
}
function createSVGStyles(latestValues, tag, styleProp) {
	const state = createSVGRenderState();
	buildSVGAttrs(state, latestValues, isSVGTag(tag), void 0, styleProp);
	const attrs = {};
	for (const key in state.attrs) {
		const attrKey = camelCaseAttributes.has(key) ? key : camelToDash(key);
		attrs[attrKey] = state.attrs[key];
	}
	return {
		attrs,
		style: {
			...state.style,
			...state.vars
		}
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/components/motion/use-motion-state.mjs
function useMotionState(props, renderer) {
	const parentState = injectMotion(null);
	const layoutGroup = injectLayoutGroup({});
	const config = useMotionConfig();
	const presenceContext = injectAnimatePresence({});
	const lazyMotionContext = useLazyMotionContext({
		features: ref({}),
		strict: false
	});
	const attrs = useAttrs();
	function getProps() {
		return resolveMotionProps(props, {
			layoutGroup,
			presenceContext,
			config: config.value
		});
	}
	function getMotionProps() {
		return {
			...attrs,
			...getProps()
		};
	}
	const state = new MotionState(getMotionProps(), parentState);
	provideMotion(state);
	if (renderer) state.initVisualElement(renderer);
	watch(lazyMotionContext.features, (bundle) => {
		if (bundle.features?.length) updateLazyFeatures(bundle.features);
		if (bundle.renderer) state.initVisualElement(bundle.renderer);
		state.updateFeatures();
	}, {
		immediate: true,
		flush: "pre"
	});
	function getAttrs() {
		const isSVG = state.type === "svg";
		const attrsProps = { ...attrs };
		Object.keys(attrs).forEach((key) => {
			if (isMotionValue(attrs[key])) attrsProps[key] = attrs[key].get();
		});
		const currentValues = state.visualElement?.latestValues || state.latestValues;
		let styleProps = {
			...props.style,
			...isSVG ? {} : currentValues
		};
		for (const key in styleProps) if (isMotionValue(styleProps[key])) styleProps[key] = styleProps[key].get();
		if (isSVG) {
			const { attrs: svgAttrs, style: svgStyle } = createSVGStyles({
				...currentValues,
				...styleProps
			}, state.options.as, props.style);
			Object.assign(attrsProps, svgAttrs);
			styleProps = svgStyle;
		}
		if (props.drag && props.dragListener !== false) Object.assign(styleProps, {
			userSelect: "none",
			WebkitUserSelect: "none",
			WebkitTouchCallout: "none",
			touchAction: props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`
		});
		const style = createStyles(styleProps);
		if (style) attrsProps.style = style;
		return attrsProps;
	}
	getCurrentInstance().proxy;
	return {
		getProps,
		getAttrs,
		layoutGroup,
		state
	};
}
//#endregion
//#region node_modules/motion-v/dist/es/components/motion/props.mjs
var MotionComponentProps = {
	"ignoreStrict": { type: Boolean },
	"forwardMotionProps": {
		type: Boolean,
		default: false
	},
	"asChild": {
		type: Boolean,
		default: false
	},
	"whileDrag": { type: [
		String,
		Array,
		Object
	] },
	"whileHover": { type: [
		String,
		Array,
		Object
	] },
	"whilePress": { type: [
		String,
		Array,
		Object
	] },
	"whileInView": { type: [
		String,
		Array,
		Object
	] },
	"whileFocus": { type: [
		String,
		Array,
		Object
	] },
	"custom": { type: [
		String,
		Number,
		Object,
		Array
	] },
	"initial": {
		type: [
			String,
			Array,
			Object,
			Boolean
		],
		default: void 0
	},
	"animate": {
		type: [
			String,
			Array,
			Object
		],
		default: void 0
	},
	"exit": { type: [
		String,
		Array,
		Object
	] },
	"variants": { type: Object },
	"inherit": { type: Boolean },
	"style": { type: Object },
	"transformTemplate": { type: Function },
	"transition": { type: Object },
	"onAnimationComplete": { type: Function },
	"onUpdate": { type: Function },
	"layout": {
		type: [Boolean, String],
		default: false
	},
	"layoutId": {
		type: String,
		default: void 0
	},
	"layoutScroll": {
		type: Boolean,
		default: false
	},
	"layoutRoot": {
		type: Boolean,
		default: false
	},
	"data-framer-portal-id": { type: String },
	"crossfade": {
		type: Boolean,
		default: true
	},
	"layoutDependency": {
		type: null,
		default: void 0
	},
	"onBeforeLayoutMeasure": { type: Function },
	"onLayoutMeasure": { type: Function },
	"onLayoutAnimationStart": { type: Function },
	"onLayoutAnimationComplete": { type: Function },
	"globalPressTarget": { type: Boolean },
	"onPressStart": { type: Function },
	"onPress": { type: Function },
	"onPressCancel": { type: Function },
	"onHoverStart": { type: Function },
	"onHoverEnd": { type: Function },
	"inViewOptions": { type: Object },
	"onViewportEnter": { type: Function },
	"onViewportLeave": { type: Function },
	"drag": { type: [Boolean, String] },
	"dragSnapToOrigin": { type: Boolean },
	"dragDirectionLock": { type: Boolean },
	"dragPropagation": { type: Boolean },
	"dragConstraints": { type: [Boolean, Object] },
	"dragElastic": {
		type: [
			Boolean,
			Number,
			Object
		],
		default: .5
	},
	"dragMomentum": {
		type: Boolean,
		default: true
	},
	"dragTransition": { type: Object },
	"dragListener": {
		type: Boolean,
		default: true
	},
	"dragControls": { type: Object },
	"onDragStart": { type: Function },
	"onDragEnd": { type: Function },
	"onDrag": { type: Function },
	"onDirectionLock": { type: Function },
	"onDragTransitionEnd": { type: Function },
	"onMeasureDragConstraints": { type: Function },
	"onPanSessionStart": { type: Function },
	"onPanStart": { type: Function },
	"onPan": { type: Function },
	"onPanEnd": { type: Function }
};
//#endregion
//#region node_modules/motion-v/dist/es/components/motion/utils.mjs
var componentMaxCache = /* @__PURE__ */ new Map();
var componentMiniCache = /* @__PURE__ */ new Map();
function renderSlotFragments(fragments) {
	if (!Array.isArray(fragments)) return [fragments];
	const result = [];
	for (const item of fragments) if (Array.isArray(item)) result.push(...item);
	else result.push(item);
	return result;
}
var SELF_CLOSING_TAGS = [
	"area",
	"img",
	"input"
];
function handlePrimitiveAndSlot(asTag, allAttrs, slots) {
	if (typeof asTag === "string" && SELF_CLOSING_TAGS.includes(asTag)) return h(asTag, allAttrs);
	if (asTag === "template") {
		if (!slots.default) return null;
		const childrens = renderSlotFragments(slots.default());
		const firstNonCommentChildrenIndex = childrens.findIndex((child) => child.type !== Comment);
		if (firstNonCommentChildrenIndex === -1) return childrens;
		const firstNonCommentChildren = childrens[firstNonCommentChildrenIndex];
		delete firstNonCommentChildren.props?.ref;
		const mergedProps = firstNonCommentChildren.props ? mergeProps(allAttrs, firstNonCommentChildren.props) : allAttrs;
		if (allAttrs.class && firstNonCommentChildren.props?.class) delete firstNonCommentChildren.props.class;
		const cloned = cloneVNode(firstNonCommentChildren, mergedProps);
		for (const prop in mergedProps) if (prop.startsWith("on")) {
			cloned.props ||= {};
			cloned.props[prop] = mergedProps[prop];
		}
		if (childrens.length === 1) return cloned;
		childrens[firstNonCommentChildrenIndex] = cloned;
		return childrens;
	}
	return null;
}
function createMotionComponent(component, options = {}) {
	const isString = typeof component === "string";
	const name = isString ? component : component.name || "";
	const componentCache = options.renderer ? componentMaxCache : componentMiniCache;
	if (isString && componentCache?.has(component)) return componentCache.get(component);
	const motionComponent = defineComponent({
		inheritAttrs: false,
		props: {
			...MotionComponentProps,
			as: {
				type: [String, Object],
				default: component || "div"
			}
		},
		name: name ? `motion.${name}` : "Motion",
		setup(props, { slots }) {
			const { getProps, getAttrs, state } = useMotionState(props, options.renderer);
			function onVnodeUpdated() {
				const el = state.element;
				if ((!(typeof props.as === "object") || props.asChild) && el) {
					const { style } = getAttrs();
					if (style) for (const [key, val] of Object.entries(style)) el.style[key] = val;
				}
			}
			return () => {
				const motionProps = getProps();
				const motionAttrs = getAttrs();
				const asTag = props.asChild ? "template" : props.as;
				const allAttrs = {
					...props.forwardMotionProps ? motionProps : {},
					...motionAttrs,
					onVnodeUpdated
				};
				const primitiveOrSlotResult = handlePrimitiveAndSlot(asTag, allAttrs, slots);
				if (primitiveOrSlotResult !== null) return primitiveOrSlotResult;
				return h(asTag, { ...allAttrs }, slots);
			};
		}
	});
	if (isString) componentCache?.set(component, motionComponent);
	return motionComponent;
}
function createMotionComponentWithFeatures(featureBundle) {
	const renderer = featureBundle?.renderer;
	updateLazyFeatures(featureBundle?.features || []);
	return new Proxy({}, { get(_, prop) {
		if (prop === "create") return (component, options) => createMotionComponent(component, {
			...options,
			renderer
		});
		return createMotionComponent(prop, { renderer });
	} });
}
//#endregion
//#region node_modules/motion-v/dist/es/components/motion/index.mjs
var motion = createMotionComponentWithFeatures(domMax);
motion.create("div");

export { mountedStates as a, motionGlobalConfig as b, motion as m, provideAnimatePresence as p, useMotionConfig as u };
//# sourceMappingURL=motion-iPcKg62k.mjs.map
