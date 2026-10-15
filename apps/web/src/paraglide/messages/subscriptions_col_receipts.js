/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Col_ReceiptsInputs */



/**
* | output |
* | --- |
* | "Receipts · 12 months" |
*
* @param {Subscriptions_Col_ReceiptsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_col_receipts = /** @type {((inputs?: Subscriptions_Col_ReceiptsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Col_ReceiptsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Factures · 12 mois")
	return /** @type {LocalizedString} */ ("Receipts · 12 months")
});