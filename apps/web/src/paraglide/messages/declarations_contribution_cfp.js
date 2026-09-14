/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Contribution_CfpInputs */

const en_declarations_contribution_cfp = /** @type {(inputs: Declarations_Contribution_CfpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFP`)
};

const fr_declarations_contribution_cfp = /** @type {(inputs: Declarations_Contribution_CfpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFP`)
};

/**
* | output |
* | --- |
* | "CFP" |
*
* @param {Declarations_Contribution_CfpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_contribution_cfp = /** @type {((inputs?: Declarations_Contribution_CfpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Contribution_CfpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_contribution_cfp(inputs)
	return en_declarations_contribution_cfp(inputs)
});