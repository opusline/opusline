/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Col_ReceiptsInputs */

const en_subscriptions_col_receipts = /** @type {(inputs: Subscriptions_Col_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts · 12 months`)
};

const fr_subscriptions_col_receipts = /** @type {(inputs: Subscriptions_Col_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures · 12 mois`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_col_receipts(inputs)
	return en_subscriptions_col_receipts(inputs)
});