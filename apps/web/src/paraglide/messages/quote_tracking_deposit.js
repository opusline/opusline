/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_DepositInputs */

const en_quote_tracking_deposit = /** @type {(inputs: Quote_Tracking_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposit on acceptance`)
};

const fr_quote_tracking_deposit = /** @type {(inputs: Quote_Tracking_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acompte à l'acceptation`)
};

/**
* | output |
* | --- |
* | "Deposit on acceptance" |
*
* @param {Quote_Tracking_DepositInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_deposit = /** @type {((inputs?: Quote_Tracking_DepositInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_DepositInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_deposit(inputs)
	return en_quote_tracking_deposit(inputs)
});