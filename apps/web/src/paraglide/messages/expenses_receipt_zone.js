/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_ZoneInputs */

const en_expenses_receipt_zone = /** @type {(inputs: Expenses_Receipt_ZoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop the receipt here, or click`)
};

const fr_expenses_receipt_zone = /** @type {(inputs: Expenses_Receipt_ZoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glissez la facture ici, ou cliquez`)
};

/**
* | output |
* | --- |
* | "Drop the receipt here, or click" |
*
* @param {Expenses_Receipt_ZoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_zone = /** @type {((inputs?: Expenses_Receipt_ZoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_ZoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_zone(inputs)
	return en_expenses_receipt_zone(inputs)
});