/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_DisputedInputs */

const en_einvoice_status_disputed = /** @type {(inputs: Einvoice_Status_DisputedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disputed`)
};

const fr_einvoice_status_disputed = /** @type {(inputs: Einvoice_Status_DisputedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En litige`)
};

/**
* | output |
* | --- |
* | "Disputed" |
*
* @param {Einvoice_Status_DisputedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_disputed = /** @type {((inputs?: Einvoice_Status_DisputedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_DisputedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_disputed(inputs)
	return en_einvoice_status_disputed(inputs)
});