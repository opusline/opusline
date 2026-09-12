/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Amount_HintInputs */

const en_declarations_cfe_amount_hint = /** @type {(inputs: Declarations_Cfe_Amount_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The notice amount replaces the estimate, in Trésorerie as here.`)
};

const fr_declarations_cfe_amount_hint = /** @type {(inputs: Declarations_Cfe_Amount_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le montant de l'avis remplace l'estimation, dans Trésorerie comme ici.`)
};

/**
* | output |
* | --- |
* | "The notice amount replaces the estimate, in Trésorerie as here." |
*
* @param {Declarations_Cfe_Amount_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_amount_hint = /** @type {((inputs?: Declarations_Cfe_Amount_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Amount_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_amount_hint(inputs)
	return en_declarations_cfe_amount_hint(inputs)
});