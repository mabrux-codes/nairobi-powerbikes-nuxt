import { c as useRouter } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-Tihkx7gx.mjs';
import { g as getPB } from './usePocketBase-F4xtrz4F.mjs';

//#region app/composables/useAuth.ts
function useAuth() {
	const auth = useAuthStore();
	const pb = getPB();
	const router = useRouter();
	async function login(email, password) {
		const result = await pb.collection("users").authWithPassword(email, password);
		auth.setUser(result.record);
		return result;
	}
	async function register(email, password, data) {
		return await pb.collection("users").create({
			email,
			password,
			passwordConfirm: password,
			...data,
			role: "customer",
			availability: "online"
		});
	}
	async function logout() {
		pb.authStore.clear();
		auth.clear();
		await router.push("/");
	}
	return {
		login,
		register,
		logout
	};
}

export { useAuth as u };
//# sourceMappingURL=useAuth-CUdaXvut.mjs.map
