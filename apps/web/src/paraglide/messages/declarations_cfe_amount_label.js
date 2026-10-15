/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Amount_LabelInputs */

const en_declarations_cfe_amount_label = /** @type {(inputs: Declarations_Cfe_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notice amount`)
};

const fr_declarations_cfe_amount_label = /** @type {(inputs: Declarations_Cfe_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant de l'avis`)
};

/**
* | output |
* | --- |
* | "Notice amount" |
*
* @param {Declarations_Cfe_Amount_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_amount_label = /** @type {((inputs?: Declarations_Cfe_Amount_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Amount_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_amount_label(inputs)
	return en_declarations_cfe_amount_label(inputs)
});