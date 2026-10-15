/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_DeadlinesInputs */

const en_nav_deadlines = /** @type {(inputs: Nav_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines`)
};

const fr_nav_deadlines = /** @type {(inputs: Nav_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéances`)
};

/**
* | output |
* | --- |
* | "Deadlines" |
*
* @param {Nav_DeadlinesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_deadlines = /** @type {((inputs?: Nav_DeadlinesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_DeadlinesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_deadlines(inputs)
	return en_nav_deadlines(inputs)
});