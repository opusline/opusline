/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Reject_TypeInputs */



/**
* | output |
* | --- |
* | "This format is not supported (CSV, OFX, QIF or CAMT)." |
*
* @param {Bank_Import_Reject_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_reject_type = /** @type {((inputs?: Bank_Import_Reject_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Reject_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Format non pris en charge (CSV, OFX, QIF ou CAMT).")
	return /** @type {LocalizedString} */ ("This format is not supported (CSV, OFX, QIF or CAMT).")
});