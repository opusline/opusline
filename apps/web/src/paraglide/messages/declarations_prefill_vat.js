/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Prefill_VatInputs */

const en_declarations_prefill_vat = /** @type {(inputs: Declarations_Prefill_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pre-fill on impots.gouv.fr`)
};

const fr_declarations_prefill_vat = /** @type {(inputs: Declarations_Prefill_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-remplir sur impots.gouv.fr`)
};

/**
* | output |
* | --- |
* | "Pre-fill on impots.gouv.fr" |
*
* @param {Declarations_Prefill_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_prefill_vat = /** @type {((inputs?: Declarations_Prefill_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Prefill_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_prefill_vat(inputs)
	return en_declarations_prefill_vat(inputs)
});