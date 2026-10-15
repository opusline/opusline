/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Reject_TypeInputs */

const en_bank_import_reject_type = /** @type {(inputs: Bank_Import_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This format is not supported (CSV, OFX, QIF or CAMT).`)
};

const fr_bank_import_reject_type = /** @type {(inputs: Bank_Import_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Format non pris en charge (CSV, OFX, QIF ou CAMT).`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_reject_type(inputs)
	return en_bank_import_reject_type(inputs)
});