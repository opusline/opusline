/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Platform_Inbox_SyncInputs */

const en_expenses_platform_inbox_sync = /** @type {(inputs: Expenses_Platform_Inbox_SyncInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read now`)
};

const fr_expenses_platform_inbox_sync = /** @type {(inputs: Expenses_Platform_Inbox_SyncInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire maintenant`)
};

/**
* | output |
* | --- |
* | "Read now" |
*
* @param {Expenses_Platform_Inbox_SyncInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_sync = /** @type {((inputs?: Expenses_Platform_Inbox_SyncInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_SyncInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_sync(inputs)
	return en_expenses_platform_inbox_sync(inputs)
});