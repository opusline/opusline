/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Expenses_Platform_Inbox_Last_SyncInputs */

const en_expenses_platform_inbox_last_sync = /** @type {(inputs: Expenses_Platform_Inbox_Last_SyncInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Read every night; last read on ${i?.date}.`)
};

const fr_expenses_platform_inbox_last_sync = /** @type {(inputs: Expenses_Platform_Inbox_Last_SyncInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lue chaque nuit ; dernière lecture le ${i?.date}.`)
};

/**
* | output |
* | --- |
* | "Read every night; last read on {date}." |
*
* @param {Expenses_Platform_Inbox_Last_SyncInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_last_sync = /** @type {((inputs: Expenses_Platform_Inbox_Last_SyncInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_Last_SyncInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_last_sync(inputs)
	return en_expenses_platform_inbox_last_sync(inputs)
});