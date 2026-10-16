/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Minimum_PenaltyInputs */

const en_invoicing_legal_minimum_penalty = /** @type {(inputs: Invoicing_Legal_Minimum_PenaltyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Minimum penalties (3 × legal rate)`)
};

const fr_invoicing_legal_minimum_penalty = /** @type {(inputs: Invoicing_Legal_Minimum_PenaltyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pénalités minimales (3 × taux légal)`)
};

/**
* | output |
* | --- |
* | "Minimum penalties (3 × legal rate)" |
*
* @param {Invoicing_Legal_Minimum_PenaltyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_minimum_penalty = /** @type {((inputs?: Invoicing_Legal_Minimum_PenaltyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Minimum_PenaltyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_minimum_penalty(inputs)
	return en_invoicing_legal_minimum_penalty(inputs)
});