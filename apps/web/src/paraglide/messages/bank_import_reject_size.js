/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Reject_SizeInputs */

const en_bank_import_reject_size = /** @type {(inputs: Bank_Import_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This file is too heavy (max 10 MB).`)
};

const fr_bank_import_reject_size = /** @type {(inputs: Bank_Import_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce fichier est trop lourd (max 10 Mo).`)
};

/**
* | output |
* | --- |
* | "This file is too heavy (max 10 MB)." |
*
* @param {Bank_Import_Reject_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_reject_size = /** @type {((inputs?: Bank_Import_Reject_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Reject_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_reject_size(inputs)
	return en_bank_import_reject_size(inputs)
});