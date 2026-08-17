/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_LateInputs */

const en_declarations_late = /** @type {(inputs: Declarations_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late`)
};

const fr_declarations_late = /** @type {(inputs: Declarations_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En retard`)
};

/**
* | output |
* | --- |
* | "Late" |
*
* @param {Declarations_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_late = /** @type {((inputs?: Declarations_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_late(inputs)
	return en_declarations_late(inputs)
});