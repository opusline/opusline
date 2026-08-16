/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_DescriptionInputs */

const en_bank_import_description = /** @type {(inputs: Bank_Import_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file exported from your business bank (CSV, OFX, QIF or CAMT). Opusline reads the payments and suggests a reconciliation with your invoices.`)
};

const fr_bank_import_description = /** @type {(inputs: Bank_Import_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le fichier exporté depuis votre banque pro (CSV, OFX, QIF ou CAMT). Opusline en lit les encaissements et propose un rapprochement avec vos factures.`)
};

/**
* | output |
* | --- |
* | "The file exported from your business bank (CSV, OFX, QIF or CAMT). Opusline reads the payments and suggests a reconciliation with your invoices." |
*
* @param {Bank_Import_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_description = /** @type {((inputs?: Bank_Import_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_description(inputs)
	return en_bank_import_description(inputs)
});