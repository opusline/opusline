/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Enter_AmountInputs */

const en_declarations_cfe_enter_amount = /** @type {(inputs: Declarations_Cfe_Enter_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the notice amount`)
};

const fr_declarations_cfe_enter_amount = /** @type {(inputs: Declarations_Cfe_Enter_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir le montant de l'avis`)
};

/**
* | output |
* | --- |
* | "Enter the notice amount" |
*
* @param {Declarations_Cfe_Enter_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_enter_amount = /** @type {((inputs?: Declarations_Cfe_Enter_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Enter_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_enter_amount(inputs)
	return en_declarations_cfe_enter_amount(inputs)
});