/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_Unlinked_TitleInputs */

const en_bank_reconciled_unlinked_title = /** @type {(inputs: Bank_Reconciled_Unlinked_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No suggestions waiting`)
};

const fr_bank_reconciled_unlinked_title = /** @type {(inputs: Bank_Reconciled_Unlinked_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune suggestion en attente`)
};

/**
* | output |
* | --- |
* | "No suggestions waiting" |
*
* @param {Bank_Reconciled_Unlinked_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_unlinked_title = /** @type {((inputs?: Bank_Reconciled_Unlinked_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_Unlinked_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciled_unlinked_title(inputs)
	return en_bank_reconciled_unlinked_title(inputs)
});