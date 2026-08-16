/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_TitleInputs */

const en_bank_reconciled_title = /** @type {(inputs: Bank_Reconciled_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everything is reconciled`)
};

const fr_bank_reconciled_title = /** @type {(inputs: Bank_Reconciled_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout est rapproché`)
};

/**
* | output |
* | --- |
* | "Everything is reconciled" |
*
* @param {Bank_Reconciled_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_title = /** @type {((inputs?: Bank_Reconciled_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciled_title(inputs)
	return en_bank_reconciled_title(inputs)
});