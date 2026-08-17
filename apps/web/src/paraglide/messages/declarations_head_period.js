/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Head_PeriodInputs */

const en_declarations_head_period = /** @type {(inputs: Declarations_Head_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

const fr_declarations_head_period = /** @type {(inputs: Declarations_Head_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période`)
};

/**
* | output |
* | --- |
* | "Period" |
*
* @param {Declarations_Head_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_head_period = /** @type {((inputs?: Declarations_Head_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Head_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_head_period(inputs)
	return en_declarations_head_period(inputs)
});