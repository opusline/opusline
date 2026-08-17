/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_No_BalanceInputs */

const en_treasury_no_balance = /** @type {(inputs: Treasury_No_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record a balance or import a statement to see a figure.`)
};

const fr_treasury_no_balance = /** @type {(inputs: Treasury_No_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renseignez un solde ou importez un relevé pour voir un montant.`)
};

/**
* | output |
* | --- |
* | "Record a balance or import a statement to see a figure." |
*
* @param {Treasury_No_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_no_balance = /** @type {((inputs?: Treasury_No_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_No_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_no_balance(inputs)
	return en_treasury_no_balance(inputs)
});