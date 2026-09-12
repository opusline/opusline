/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_CoherenceInputs */

const en_declarations_income_tax_coherence = /** @type {(inputs: Declarations_Income_Tax_CoherenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Consistency check`)
};

const fr_declarations_income_tax_coherence = /** @type {(inputs: Declarations_Income_Tax_CoherenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contrôle de cohérence`)
};

/**
* | output |
* | --- |
* | "Consistency check" |
*
* @param {Declarations_Income_Tax_CoherenceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_coherence = /** @type {((inputs?: Declarations_Income_Tax_CoherenceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_CoherenceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_coherence(inputs)
	return en_declarations_income_tax_coherence(inputs)
});