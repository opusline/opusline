/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciliation_TitleInputs */

const en_bank_reconciliation_title = /** @type {(inputs: Bank_Reconciliation_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reconciliation`)
};

const fr_bank_reconciliation_title = /** @type {(inputs: Bank_Reconciliation_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rapprochement`)
};

/**
* | output |
* | --- |
* | "Reconciliation" |
*
* @param {Bank_Reconciliation_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciliation_title = /** @type {((inputs?: Bank_Reconciliation_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciliation_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciliation_title(inputs)
	return en_bank_reconciliation_title(inputs)
});