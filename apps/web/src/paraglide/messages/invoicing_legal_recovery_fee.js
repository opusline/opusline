/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Recovery_FeeInputs */

const en_invoicing_legal_recovery_fee = /** @type {(inputs: Invoicing_Legal_Recovery_FeeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed recovery fee`)
};

const fr_invoicing_legal_recovery_fee = /** @type {(inputs: Invoicing_Legal_Recovery_FeeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indemnité forfaitaire de recouvrement`)
};

/**
* | output |
* | --- |
* | "Fixed recovery fee" |
*
* @param {Invoicing_Legal_Recovery_FeeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_recovery_fee = /** @type {((inputs?: Invoicing_Legal_Recovery_FeeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Recovery_FeeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_recovery_fee(inputs)
	return en_invoicing_legal_recovery_fee(inputs)
});