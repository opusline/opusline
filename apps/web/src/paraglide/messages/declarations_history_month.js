/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_MonthInputs */

const en_declarations_history_month = /** @type {(inputs: Declarations_History_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

const fr_declarations_history_month = /** @type {(inputs: Declarations_History_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois`)
};

/**
* | output |
* | --- |
* | "Month" |
*
* @param {Declarations_History_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_month = /** @type {((inputs?: Declarations_History_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_month(inputs)
	return en_declarations_history_month(inputs)
});