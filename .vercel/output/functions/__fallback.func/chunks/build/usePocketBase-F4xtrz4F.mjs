import { a as useRuntimeConfig } from '../virtual/entry.mjs';
import PocketBase from 'pocketbase';

//#region app/composables/usePocketBase.ts
var pbInstance = null;
function getPB() {
	if (!pbInstance) {
		const url = useRuntimeConfig().public.pocketBaseUrl;
		pbInstance = new PocketBase(url);
	}
	return pbInstance;
}
function usePB() {
	return getPB();
}

export { getPB as g, usePB as u };
//# sourceMappingURL=usePocketBase-F4xtrz4F.mjs.map
