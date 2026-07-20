import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

//#region app/stores/auth.ts
var useAuthStore = defineStore("auth", () => {
	const user = ref(null);
	const isAuthenticated = computed(() => !!user.value);
	const userRole = computed(() => user.value?.role || null);
	const isAdmin = computed(() => userRole.value === "admin");
	const isCustomer = computed(() => userRole.value === "customer");
	function setUser(u) {
		user.value = u;
	}
	function loadFromStorage() {}
	function clear() {
		user.value = null;
	}
	function getDashboardRoute() {
		if (!user.value) return "/login";
		return "/dashboard";
	}
	return {
		user,
		isAuthenticated,
		userRole,
		isAdmin,
		isCustomer,
		setUser,
		loadFromStorage,
		clear,
		getDashboardRoute
	};
});

export { useAuthStore as u };
//# sourceMappingURL=auth-Tihkx7gx.mjs.map
