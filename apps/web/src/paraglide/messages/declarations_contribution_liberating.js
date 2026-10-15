/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Contribution_LiberatingInputs */

const en_declarations_contribution_liberating = /** @type {(inputs: Declarations_Contribution_LiberatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versement libératoire`)
};

const fr_declarations_contribution_liberating = /** @type {(inputs: Declarations_Contribution_LiberatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versement libératoire`)
};

/**
* | output |
* | --- |
* | "Versement libératoire" |
*
* @param {Declarations_Contribution_LiberatingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_contribution_liberating = /** @type {((inputs?: Declarations_Contribution_LiberatingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Contribution_LiberatingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_contribution_liberating(inputs)
	return en_declarations_contribution_liberating(inputs)
});