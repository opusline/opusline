/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Success_Dismiss_AriaInputs */

const en_bank_import_success_dismiss_aria = /** @type {(inputs: Bank_Import_Success_Dismiss_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dismiss the import summary`)
};

const fr_bank_import_success_dismiss_aria = /** @type {(inputs: Bank_Import_Success_Dismiss_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fermer le résumé de l'import`)
};

/**
* | output |
* | --- |
* | "Dismiss the import summary" |
*
* @param {Bank_Import_Success_Dismiss_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_success_dismiss_aria = /** @type {((inputs?: Bank_Import_Success_Dismiss_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Success_Dismiss_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_success_dismiss_aria(inputs)
	return en_bank_import_success_dismiss_aria(inputs)
});