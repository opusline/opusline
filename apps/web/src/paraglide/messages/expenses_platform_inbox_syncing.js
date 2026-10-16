/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Platform_Inbox_SyncingInputs */

const en_expenses_platform_inbox_syncing = /** @type {(inputs: Expenses_Platform_Inbox_SyncingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading…`)
};

const fr_expenses_platform_inbox_syncing = /** @type {(inputs: Expenses_Platform_Inbox_SyncingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lecture…`)
};

/**
* | output |
* | --- |
* | "Reading…" |
*
* @param {Expenses_Platform_Inbox_SyncingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_syncing = /** @type {((inputs?: Expenses_Platform_Inbox_SyncingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_SyncingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_syncing(inputs)
	return en_expenses_platform_inbox_syncing(inputs)
});