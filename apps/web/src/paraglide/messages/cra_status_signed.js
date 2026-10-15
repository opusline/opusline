/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Status_SignedInputs */

const en_cra_status_signed = /** @type {(inputs: Cra_Status_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed`)
};

const fr_cra_status_signed = /** @type {(inputs: Cra_Status_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signé`)
};

/**
* | output |
* | --- |
* | "Signed" |
*
* @param {Cra_Status_SignedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_status_signed = /** @type {((inputs?: Cra_Status_SignedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Status_SignedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_status_signed(inputs)
	return en_cra_status_signed(inputs)
});