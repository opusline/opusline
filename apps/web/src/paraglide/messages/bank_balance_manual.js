/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_ManualInputs */

const en_bank_balance_manual = /** @type {(inputs: Bank_Balance_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`entered by hand`)
};

const fr_bank_balance_manual = /** @type {(inputs: Bank_Balance_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`saisi à la main`)
};

/**
* | output |
* | --- |
* | "entered by hand" |
*
* @param {Bank_Balance_ManualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_manual = /** @type {((inputs?: Bank_Balance_ManualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_ManualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_manual(inputs)
	return en_bank_balance_manual(inputs)
});