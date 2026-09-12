/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Settlement_GapInputs */

const en_declarations_settlement_gap = /** @type {(inputs: Declarations_Settlement_GapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gap`)
};

const fr_declarations_settlement_gap = /** @type {(inputs: Declarations_Settlement_GapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Écart`)
};

/**
* | output |
* | --- |
* | "Gap" |
*
* @param {Declarations_Settlement_GapInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_settlement_gap = /** @type {((inputs?: Declarations_Settlement_GapInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Settlement_GapInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_settlement_gap(inputs)
	return en_declarations_settlement_gap(inputs)
});