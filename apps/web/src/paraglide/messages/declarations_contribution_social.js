/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Contribution_SocialInputs */

const en_declarations_contribution_social = /** @type {(inputs: Declarations_Contribution_SocialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Social contributions`)
};

const fr_declarations_contribution_social = /** @type {(inputs: Declarations_Contribution_SocialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cotisations sociales`)
};

/**
* | output |
* | --- |
* | "Social contributions" |
*
* @param {Declarations_Contribution_SocialInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_contribution_social = /** @type {((inputs?: Declarations_Contribution_SocialInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Contribution_SocialInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_contribution_social(inputs)
	return en_declarations_contribution_social(inputs)
});