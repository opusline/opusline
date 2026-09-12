/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Amount_InvalidInputs */

const en_declarations_cfe_amount_invalid = /** @type {(inputs: Declarations_Cfe_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an amount above zero.`)
};

const fr_declarations_cfe_amount_invalid = /** @type {(inputs: Declarations_Cfe_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un montant supérieur à zéro.`)
};

/**
* | output |
* | --- |
* | "Enter an amount above zero." |
*
* @param {Declarations_Cfe_Amount_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_amount_invalid = /** @type {((inputs?: Declarations_Cfe_Amount_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Amount_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_amount_invalid(inputs)
	return en_declarations_cfe_amount_invalid(inputs)
});