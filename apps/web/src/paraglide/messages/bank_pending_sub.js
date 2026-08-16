/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Pending_SubInputs */

const en_bank_pending_sub = /** @type {(inputs: Bank_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`payments with no linked invoice`)
};

const fr_bank_pending_sub = /** @type {(inputs: Bank_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`encaissements sans facture liée`)
};

/**
* | output |
* | --- |
* | "payments with no linked invoice" |
*
* @param {Bank_Pending_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_pending_sub = /** @type {((inputs?: Bank_Pending_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Pending_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_pending_sub(inputs)
	return en_bank_pending_sub(inputs)
});