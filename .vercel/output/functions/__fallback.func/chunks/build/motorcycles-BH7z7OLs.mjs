import { u as useHead$1 } from '../virtual/entry.mjs';
import { b as badge_default } from './badge-nez7Y_Qe.mjs';
import { u as usePB } from './usePocketBase-F4xtrz4F.mjs';
import { b as button_default } from './button-C6K5x_2d.mjs';
import { i as input_default } from './input-Bs0RBWq5.mjs';
import { defineComponent, ref, watch, computed, withCtx, createTextVNode, isRef, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport, ssrRenderClass } from 'vue/server-renderer';
import { Bike } from 'lucide-vue-next';
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
import './cn-BcpkRy0X.mjs';
import 'clsx';
import 'tailwind-merge';
import 'pocketbase';

//#region app/pages/dashboard/motorcycles.vue?vue&type=script&setup=true&lang.ts
var motorcycles_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "motorcycles",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Motorcycles - Nairobi Powerbikes" });
		const pb = usePB();
		const loading = ref(true);
		const saving = ref(false);
		const motorcycles = ref([]);
		const brands = ref([]);
		const searchQuery = ref("");
		const brandFilter = ref("");
		const statusFilter = ref("");
		const showModal = ref(false);
		const editingId = ref(null);
		const imageFiles = ref([]);
		const imagePreviews = ref([]);
		const bikeTypes = [
			"Sport",
			"Cruiser",
			"Touring",
			"Adventure",
			"Naked",
			"Dirt",
			"Scooter",
			"Electric"
		];
		const form = ref({
			name: "",
			slug: "",
			brand: "",
			type: "",
			year: "",
			price: "",
			sale_price: "",
			status: "available",
			description: "",
			engine: "",
			engine_cc: "",
			horsepower: "",
			torque: "",
			transmission: "",
			top_speed: "",
			fuel_capacity: "",
			weight: "",
			fuel_system: "",
			cooling: "",
			starter: "",
			ignition: "",
			battery: "",
			headlight: "",
			seat_height: "",
			ground_clearance: "",
			braking: "",
			suspension: "",
			colors: "",
			warranty: "",
			featured: false,
			new_arrival: false,
			in_stock: true
		});
		watch(() => form.value.status, (status) => {
			if (status === "sold") {
				form.value.featured = false;
				form.value.new_arrival = false;
				form.value.in_stock = false;
			} else if (status === "coming_soon") {
				form.value.new_arrival = false;
				form.value.in_stock = false;
			}
		});
		function formatPrice(p) {
			return p ? p.toLocaleString() : "0";
		}
		const filteredMotorcycles = computed(() => {
			return motorcycles.value.filter((m) => {
				if (searchQuery.value && !m.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
				if (brandFilter.value && m.brand !== brandFilter.value) return false;
				if (statusFilter.value && m.status !== statusFilter.value) return false;
				return true;
			});
		});
		function openCreateModal() {
			editingId.value = null;
			form.value = {
				name: "",
				slug: "",
				brand: "",
				type: "",
				year: "",
				price: "",
				sale_price: "",
				status: "available",
				description: "",
				engine: "",
				engine_cc: "",
				horsepower: "",
				torque: "",
				transmission: "",
				top_speed: "",
				fuel_capacity: "",
				weight: "",
				fuel_system: "",
				cooling: "",
				starter: "",
				ignition: "",
				battery: "",
				headlight: "",
				seat_height: "",
				ground_clearance: "",
				braking: "",
				suspension: "",
				colors: "",
				warranty: "",
				featured: false,
				new_arrival: false,
				in_stock: true
			};
			imageFiles.value = [];
			imagePreviews.value = [];
			showModal.value = true;
		}
		function openEditModal(m) {
			editingId.value = m.id;
			form.value = {
				name: m.name,
				slug: m.slug || "",
				brand: m.brand,
				type: m.type || "",
				year: m.year?.toString() || "",
				price: m.price?.toString() || "",
				sale_price: m.sale_price?.toString() || "",
				status: m.status || "available",
				description: m.description || "",
				engine: m.engine || "",
				engine_cc: m.engine_cc || "",
				horsepower: m.horsepower || "",
				torque: m.torque || "",
				transmission: m.transmission || "",
				top_speed: m.top_speed || "",
				fuel_capacity: m.fuel_capacity || "",
				weight: m.weight || "",
				fuel_system: m.fuel_system || "",
				cooling: m.cooling || "",
				starter: m.starter || "",
				ignition: m.ignition || "",
				battery: m.battery || "",
				headlight: m.headlight || "",
				seat_height: m.seat_height || "",
				ground_clearance: m.ground_clearance || "",
				braking: m.braking || "",
				suspension: m.suspension || "",
				colors: m.colors || "",
				warranty: m.warranty || "",
				featured: m.featured || false,
				new_arrival: m.new_arrival || false,
				in_stock: m.in_stock ?? true
			};
			imageFiles.value = [];
			imagePreviews.value = (m.images || []).map((img) => pb.files.getURL(m, img));
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
		}
		async function saveMotorcycle() {
			saving.value = true;
			try {
				const data = new FormData();
				for (const f of [
					"name",
					"slug",
					"brand",
					"type",
					"status",
					"description",
					"engine",
					"engine_cc",
					"horsepower",
					"torque",
					"transmission",
					"top_speed",
					"fuel_capacity",
					"weight",
					"fuel_system",
					"cooling",
					"starter",
					"ignition",
					"battery",
					"headlight",
					"seat_height",
					"ground_clearance",
					"braking",
					"suspension",
					"colors",
					"warranty"
				]) if (form.value[f]) data.append(f, String(form.value[f]));
				if (form.value.year) data.append("year", form.value.year);
				if (form.value.price) data.append("price", form.value.price);
				if (form.value.sale_price) data.append("sale_price", form.value.sale_price);
				data.append("featured", form.value.featured ? "true" : "false");
				data.append("new_arrival", form.value.new_arrival ? "true" : "false");
				data.append("in_stock", form.value.in_stock ? "true" : "false");
				for (const file of imageFiles.value) data.append("images", file);
				if (editingId.value) await pb.collection("motorcycles").update(editingId.value, data);
				else await pb.collection("motorcycles").create(data);
				closeModal();
				await loadMotorcycles();
			} catch (e) {
				console.error(e);
			} finally {
				saving.value = false;
			}
		}
		async function confirmDelete(m) {
			if (await confirm(`Delete "${m.name}"? This cannot be undone.`)) pb.collection("motorcycles").delete(m.id).then(() => loadMotorcycles());
		}
		async function loadMotorcycles() {
			try {
				const res = await pb.collection("motorcycles").getList(1, 100, {
					sort: "-created",
					expand: "brand"
				});
				motorcycles.value = res.items.map((m) => ({
					...m,
					brand_name: m.expand?.brand?.name || ""
				}));
			} catch (e) {
				console.error(e);
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = button_default;
			const _component_Input = input_default;
			const _component_Badge = badge_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Motorcycles</h1><p class="mt-1 text-sm text-brand-grey">Manage your motorcycle inventory</p></div>`);
			_push(ssrRenderComponent(_component_Button, {
				size: "sm",
				onClick: openCreateModal
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add Motorcycle`);
					else return [createTextVNode("Add Motorcycle")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mb-4 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_Input, {
				modelValue: unref(searchQuery),
				"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
				placeholder: "Search motorcycles...",
				class: "w-64"
			}, null, _parent));
			_push(`<select class="input-field w-44"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(brandFilter)) ? ssrLooseContain(unref(brandFilter), "") : ssrLooseEqual(unref(brandFilter), "")) ? " selected" : ""}>All Brands</option><!--[-->`);
			ssrRenderList(unref(brands), (b) => {
				_push(`<option${ssrRenderAttr("value", b.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(brandFilter)) ? ssrLooseContain(unref(brandFilter), b.id) : ssrLooseEqual(unref(brandFilter), b.id)) ? " selected" : ""}>${ssrInterpolate(b.name)}</option>`);
			});
			_push(`<!--]--></select><select class="input-field w-40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Status</option><option value="available"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "available") : ssrLooseEqual(unref(statusFilter), "available")) ? " selected" : ""}>Available</option><option value="sold"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "sold") : ssrLooseEqual(unref(statusFilter), "sold")) ? " selected" : ""}>Sold</option><option value="coming_soon"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "coming_soon") : ssrLooseEqual(unref(statusFilter), "coming_soon")) ? " selected" : ""}>Coming Soon</option></select></div>`);
			if (unref(loading)) {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (i) => {
					_push(`<div class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mb-3 aspect-video rounded-sm bg-brand-grey/10"></div><div class="h-5 w-3/4 rounded bg-brand-grey/10"></div><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10"></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(filteredMotorcycles).length === 0) {
				_push(`<div class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">`);
				_push(ssrRenderComponent(unref(Bike), { class: "mx-auto h-12 w-12 text-brand-grey/40" }, null, _parent));
				_push(`<p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Motorcycles Found</p><p class="mt-2 text-sm text-brand-grey/60">Add your first motorcycle to the inventory</p></div>`);
			} else {
				_push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(filteredMotorcycles), (m) => {
					_push(`<div class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-all duration-200 hover:border-brand-red/30"><div class="mb-3 flex aspect-video items-center justify-center rounded-sm bg-brand-grey/10 overflow-hidden">`);
					if (m.images?.length) _push(`<img${ssrRenderAttr("src", unref(pb).files.getURL(m, m.images[0]))}${ssrRenderAttr("alt", m.name)} class="h-full w-full object-cover">`);
					else _push(ssrRenderComponent(unref(Bike), { class: "h-10 w-10 text-brand-grey/30" }, null, _parent));
					_push(`</div><h3 class="font-display text-lg tracking-display text-white truncate">${ssrInterpolate(m.name)}</h3><p class="text-sm text-brand-grey">${ssrInterpolate(m.brand_name || "Unknown Brand")} · ${ssrInterpolate(m.year || "N/A")} · ${ssrInterpolate(m.engine_cc || "—")}cc</p><div class="mt-3 flex items-center justify-between"><span class="text-lg font-bold text-brand-red">KSh ${ssrInterpolate(formatPrice(m.sale_price || m.price))}</span>`);
					_push(ssrRenderComponent(_component_Badge, { variant: m.status === "available" ? "success" : m.status === "sold" ? "danger" : "warning" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(m.status || "unknown")}`);
							else return [createTextVNode(toDisplayString(m.status || "unknown"), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</div><div class="mt-3 flex gap-2">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						size: "sm",
						class: "flex-1",
						onClick: ($event) => openEditModal(m)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Edit`);
							else return [createTextVNode("Edit")];
						}),
						_: 2
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						variant: "outline",
						size: "sm",
						class: "flex-1",
						onClick: ($event) => confirmDelete(m)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Delete`);
							else return [createTextVNode("Delete")];
						}),
						_: 2
					}, _parent));
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto"><div class="w-full max-w-2xl rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8"><h2 class="font-display text-xl tracking-display text-white">${ssrInterpolate(unref(editingId) ? "Edit Motorcycle" : "Add Motorcycle")}</h2><div class="mt-4 space-y-4"><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).name,
						"onUpdate:modelValue": ($event) => unref(form).name = $event,
						label: "Name",
						placeholder: "e.g. Ninja ZX-6R"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).slug,
						"onUpdate:modelValue": ($event) => unref(form).slug = $event,
						label: "Slug",
						placeholder: "ninja-zx-6r"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Brand</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).brand) ? ssrLooseContain(unref(form).brand, "") : ssrLooseEqual(unref(form).brand, "")) ? " selected" : ""}>Select brand</option><!--[-->`);
					ssrRenderList(unref(brands), (b) => {
						_push(`<option${ssrRenderAttr("value", b.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).brand) ? ssrLooseContain(unref(form).brand, b.id) : ssrLooseEqual(unref(form).brand, b.id)) ? " selected" : ""}>${ssrInterpolate(b.name)}</option>`);
					});
					_push(`<!--]--></select></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label><select class="input-field w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "") : ssrLooseEqual(unref(form).type, "")) ? " selected" : ""}>Select type</option><!--[-->`);
					ssrRenderList(bikeTypes, (t) => {
						_push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, t) : ssrLooseEqual(unref(form).type, t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
					});
					_push(`<!--]--></select></div></div><div class="grid grid-cols-3 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).year,
						"onUpdate:modelValue": ($event) => unref(form).year = $event,
						label: "Year",
						type: "number",
						placeholder: "2025"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).price,
						"onUpdate:modelValue": ($event) => unref(form).price = $event,
						label: "Price (KSh)",
						type: "number",
						placeholder: "1000000"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).sale_price,
						"onUpdate:modelValue": ($event) => unref(form).sale_price = $event,
						label: "Sale Price",
						type: "number",
						placeholder: "900000"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).engine_cc,
						"onUpdate:modelValue": ($event) => unref(form).engine_cc = $event,
						label: "Engine CC",
						placeholder: "e.g. 636"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).engine,
						"onUpdate:modelValue": ($event) => unref(form).engine = $event,
						label: "Engine Details",
						placeholder: "e.g. 636cc liquid-cooled inline-4"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).horsepower,
						"onUpdate:modelValue": ($event) => unref(form).horsepower = $event,
						label: "Horsepower",
						placeholder: "e.g. 130hp @ 13,500rpm"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).torque,
						"onUpdate:modelValue": ($event) => unref(form).torque = $event,
						label: "Torque",
						placeholder: "e.g. 71Nm @ 11,500rpm"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).transmission,
						"onUpdate:modelValue": ($event) => unref(form).transmission = $event,
						label: "Transmission",
						placeholder: "e.g. 6-speed"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).top_speed,
						"onUpdate:modelValue": ($event) => unref(form).top_speed = $event,
						label: "Top Speed",
						placeholder: "e.g. 260km/h"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).fuel_capacity,
						"onUpdate:modelValue": ($event) => unref(form).fuel_capacity = $event,
						label: "Fuel Capacity",
						placeholder: "e.g. 17L"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).weight,
						"onUpdate:modelValue": ($event) => unref(form).weight = $event,
						label: "Weight",
						placeholder: "e.g. 198kg"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).fuel_system,
						"onUpdate:modelValue": ($event) => unref(form).fuel_system = $event,
						label: "Fuel System",
						placeholder: "e.g. EFI"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).cooling,
						"onUpdate:modelValue": ($event) => unref(form).cooling = $event,
						label: "Cooling System",
						placeholder: "e.g. Liquid-cooled"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).starter,
						"onUpdate:modelValue": ($event) => unref(form).starter = $event,
						label: "Starter",
						placeholder: "e.g. Electric"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).ignition,
						"onUpdate:modelValue": ($event) => unref(form).ignition = $event,
						label: "Ignition",
						placeholder: "e.g. CDI"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).battery,
						"onUpdate:modelValue": ($event) => unref(form).battery = $event,
						label: "Battery",
						placeholder: "e.g. 12V 8Ah"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).headlight,
						"onUpdate:modelValue": ($event) => unref(form).headlight = $event,
						label: "Headlight",
						placeholder: "e.g. LED"
					}, null, _parent));
					_push(`</div><div class="grid grid-cols-2 gap-4">`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).seat_height,
						"onUpdate:modelValue": ($event) => unref(form).seat_height = $event,
						label: "Seat Height",
						placeholder: "e.g. 830mm"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).ground_clearance,
						"onUpdate:modelValue": ($event) => unref(form).ground_clearance = $event,
						label: "Ground Clearance",
						placeholder: "e.g. 160mm"
					}, null, _parent));
					_push(`</div>`);
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).braking,
						"onUpdate:modelValue": ($event) => unref(form).braking = $event,
						label: "Braking System",
						placeholder: "e.g. Dual 310mm discs, 4-piston calipers"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).suspension,
						"onUpdate:modelValue": ($event) => unref(form).suspension = $event,
						label: "Suspension",
						placeholder: "e.g. 41mm USD fork (front); Mono-shock (rear)"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).colors,
						"onUpdate:modelValue": ($event) => unref(form).colors = $event,
						label: "Available Colors",
						placeholder: "e.g. Lime Green, Metallic Spark Black"
					}, null, _parent));
					_push(ssrRenderComponent(_component_Input, {
						modelValue: unref(form).warranty,
						"onUpdate:modelValue": ($event) => unref(form).warranty = $event,
						label: "Warranty",
						placeholder: "e.g. 2 years"
					}, null, _parent));
					_push(`<div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea rows="3" class="input-field w-full resize-none" placeholder="Motorcycle description...">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label><select class="input-field w-full"><option value="available"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "available") : ssrLooseEqual(unref(form).status, "available")) ? " selected" : ""}>Available</option><option value="sold"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "sold") : ssrLooseEqual(unref(form).status, "sold")) ? " selected" : ""}>Sold</option><option value="coming_soon"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "coming_soon") : ssrLooseEqual(unref(form).status, "coming_soon")) ? " selected" : ""}>Coming Soon</option></select></div><div class="flex items-end gap-4 pb-2"><label class="${ssrRenderClass([{ "opacity-40 pointer-events-none": unref(form).status === "sold" }, "flex items-center gap-2 cursor-pointer"])}"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).featured) ? ssrLooseContain(unref(form).featured, null) : unref(form).featured) ? " checked" : ""} type="checkbox" class="accent-brand-red"${ssrIncludeBooleanAttr(unref(form).status === "sold") ? " disabled" : ""}> Featured</label><label class="${ssrRenderClass([{ "opacity-40 pointer-events-none": unref(form).status !== "available" }, "flex items-center gap-2 cursor-pointer"])}"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).new_arrival) ? ssrLooseContain(unref(form).new_arrival, null) : unref(form).new_arrival) ? " checked" : ""} type="checkbox" class="accent-brand-red"${ssrIncludeBooleanAttr(unref(form).status !== "available") ? " disabled" : ""}> New Arrival</label><label class="${ssrRenderClass([{ "opacity-40 pointer-events-none": unref(form).status !== "available" }, "flex items-center gap-2 cursor-pointer"])}"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).in_stock) ? ssrLooseContain(unref(form).in_stock, null) : unref(form).in_stock) ? " checked" : ""} type="checkbox" class="accent-brand-red"${ssrIncludeBooleanAttr(unref(form).status !== "available") ? " disabled" : ""}> In Stock</label>`);
					if (unref(form).status === "coming_soon") _push(`<span class="rounded-sm bg-amber-500/20 px-2 py-0.5 text-[10px] font-display tracking-display text-amber-400 uppercase">Coming Soon</span>`);
					else _push(`<!---->`);
					if (unref(form).status === "sold") _push(`<span class="rounded-sm bg-red-500/20 px-2 py-0.5 text-[10px] font-display tracking-display text-red-400 uppercase">Sold</span>`);
					else _push(`<!---->`);
					_push(`</div></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Images</label><input type="file" accept="image/*" multiple class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white">`);
					if (unref(imagePreviews).length) {
						_push(`<div class="mt-2 flex flex-wrap gap-2"><!--[-->`);
						ssrRenderList(unref(imagePreviews), (img, i) => {
							_push(`<img${ssrRenderAttr("src", img)} class="h-14 w-14 rounded-sm object-cover border border-brand-grey/20">`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					_push(`</div></div><div class="mt-6 flex justify-end gap-3">`);
					_push(ssrRenderComponent(_component_Button, {
						variant: "ghost",
						onClick: closeModal
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Cancel`);
							else return [createTextVNode("Cancel")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_Button, {
						disabled: unref(saving),
						onClick: saveMotorcycle
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}`);
							else return [createTextVNode(toDisplayString(unref(saving) ? "Saving..." : "Save"), 1)];
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
//#region app/pages/dashboard/motorcycles.vue
var _sfc_setup = motorcycles_vue_vue_type_script_setup_true_lang_default.setup;
motorcycles_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/motorcycles.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var motorcycles_default = motorcycles_vue_vue_type_script_setup_true_lang_default;

export { motorcycles_default as default };
//# sourceMappingURL=motorcycles-BH7z7OLs.mjs.map
