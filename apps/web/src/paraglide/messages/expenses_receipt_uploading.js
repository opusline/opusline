/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_UploadingInputs */

const en_expenses_receipt_uploading = /** @type {(inputs: Expenses_Receipt_UploadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sending…`)
};

const fr_expenses_receipt_uploading = /** @type {(inputs: Expenses_Receipt_UploadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoi…`)
};

/**
* | output |
* | --- |
* | "Sending…" |
*
* @param {Expenses_Receipt_UploadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_uploading = /** @type {((inputs?: Expenses_Receipt_UploadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_UploadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_uploading(inputs)
	return en_expenses_receipt_uploading(inputs)
});