/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Filter_AriaInputs */

const en_deadlines_filter_aria = /** @type {(inputs: Deadlines_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter the deadlines`)
};

const fr_deadlines_filter_aria = /** @type {(inputs: Deadlines_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer les échéances`)
};

/**
* | output |
* | --- |
* | "Filter the deadlines" |
*
* @param {Deadlines_Filter_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_filter_aria = /** @type {((inputs?: Deadlines_Filter_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Filter_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_filter_aria(inputs)
	return en_deadlines_filter_aria(inputs)
});