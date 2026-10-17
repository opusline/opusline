/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payments_From_BankInputs */

const en_payments_from_bank = /** @type {(inputs: Payments_From_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank`)
};

const fr_payments_from_bank = /** @type {(inputs: Payments_From_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Banque`)
};

/**
* | output |
* | --- |
* | "Bank" |
*
* @param {Payments_From_BankInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_from_bank = /** @type {((inputs?: Payments_From_BankInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_From_BankInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_from_bank(inputs)
	return en_payments_from_bank(inputs)
});