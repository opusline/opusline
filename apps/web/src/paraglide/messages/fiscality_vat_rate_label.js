/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Vat_Rate_LabelInputs */

const en_fiscality_vat_rate_label = /** @type {(inputs: Fiscality_Vat_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default VAT`)
};

const fr_fiscality_vat_rate_label = /** @type {(inputs: Fiscality_Vat_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA par défaut`)
};

/**
* | output |
* | --- |
* | "Default VAT" |
*
* @param {Fiscality_Vat_Rate_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_vat_rate_label = /** @type {((inputs?: Fiscality_Vat_Rate_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Vat_Rate_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_fiscality_vat_rate_label(inputs)
	return en_fiscality_vat_rate_label(inputs)
});