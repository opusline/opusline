/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Cfe_Amount_SavedInputs */

const en_declarations_cfe_amount_saved = /** @type {(inputs: Declarations_Cfe_Amount_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Notice amount saved · ${i?.amount}`)
};

const fr_declarations_cfe_amount_saved = /** @type {(inputs: Declarations_Cfe_Amount_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Montant de l'avis enregistré · ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Notice amount saved · {amount}" |
*
* @param {Declarations_Cfe_Amount_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_amount_saved = /** @type {((inputs: Declarations_Cfe_Amount_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Amount_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_amount_saved(inputs)
	return en_declarations_cfe_amount_saved(inputs)
});