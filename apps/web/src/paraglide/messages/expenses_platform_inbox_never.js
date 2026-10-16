/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Platform_Inbox_NeverInputs */

const en_expenses_platform_inbox_never = /** @type {(inputs: Expenses_Platform_Inbox_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not read yet: the first sync brings in everything the platform holds.`)
};

const fr_expenses_platform_inbox_never = /** @type {(inputs: Expenses_Platform_Inbox_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore lue : la première lecture rapporte tout ce que la plateforme détient.`)
};

/**
* | output |
* | --- |
* | "Not read yet: the first sync brings in everything the platform holds." |
*
* @param {Expenses_Platform_Inbox_NeverInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_never = /** @type {((inputs?: Expenses_Platform_Inbox_NeverInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_NeverInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_never(inputs)
	return en_expenses_platform_inbox_never(inputs)
});