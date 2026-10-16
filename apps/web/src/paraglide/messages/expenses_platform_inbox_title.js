/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Platform_Inbox_TitleInputs */

const en_expenses_platform_inbox_title = /** @type {(inputs: Expenses_Platform_Inbox_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received through the platform`)
};

const fr_expenses_platform_inbox_title = /** @type {(inputs: Expenses_Platform_Inbox_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reçues par la plateforme`)
};

/**
* | output |
* | --- |
* | "Received through the platform" |
*
* @param {Expenses_Platform_Inbox_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_title = /** @type {((inputs?: Expenses_Platform_Inbox_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_title(inputs)
	return en_expenses_platform_inbox_title(inputs)
});