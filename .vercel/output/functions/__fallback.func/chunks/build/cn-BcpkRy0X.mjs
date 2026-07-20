import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

//#region app/utils/cn.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export { cn as c };
//# sourceMappingURL=cn-BcpkRy0X.mjs.map
