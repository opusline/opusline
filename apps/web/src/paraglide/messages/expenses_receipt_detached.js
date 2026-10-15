/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_DetachedInputs */

const en_expenses_receipt_detached = /** @type {(inputs: Expenses_Receipt_DetachedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt detached`)
};

const fr_expenses_receipt_detached = /** @type {(inputs: Expenses_Receipt_DetachedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture détachée`)
};

/**
* | output |
* | --- |
* | "Receipt detached" |
*
* @param {Expenses_Receipt_DetachedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_detached = /** @type {((inputs?: Expenses_Receipt_DetachedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_DetachedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_detached(inputs)
	return en_expenses_receipt_detached(inputs)
});