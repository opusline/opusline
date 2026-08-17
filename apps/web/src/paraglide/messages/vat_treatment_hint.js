/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_HintInputs */

const en_vat_treatment_hint = /** @type {(inputs: Vat_Treatment_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Which VAT rule invoices to this client fall under. Set it per client — the billing address is free text, so Opusline never guesses a tax jurisdiction from it.`)
};

const fr_vat_treatment_hint = /** @type {(inputs: Vat_Treatment_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La règle de TVA dont relèvent les factures de ce client. À définir client par client : l'adresse de facturation est du texte libre, Opusline n'en déduit jamais un régime fiscal.`)
};

/**
* | output |
* | --- |
* | "Which VAT rule invoices to this client fall under. Set it per client — the billing address is free text, so Opusline never guesses a tax jurisdiction from it." |
*
* @param {Vat_Treatment_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_hint = /** @type {((inputs?: Vat_Treatment_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_hint(inputs)
	return en_vat_treatment_hint(inputs)
});