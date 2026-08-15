/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Check_ConfirmInputs */

const en_documents_check_confirm = /** @type {(inputs: Documents_Check_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check the type, then confirm`)
};

const fr_documents_check_confirm = /** @type {(inputs: Documents_Check_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifiez le type, puis confirmez`)
};

/**
* | output |
* | --- |
* | "Check the type, then confirm" |
*
* @param {Documents_Check_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_check_confirm = /** @type {((inputs?: Documents_Check_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Check_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_check_confirm(inputs)
	return en_documents_check_confirm(inputs)
});