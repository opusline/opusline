/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_BodyInputs */

const en_bank_reconciled_body = /** @type {(inputs: Bank_Reconciled_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every payment on the statement is linked to its invoice. The next import will pick up here.`)
};

const fr_bank_reconciled_body = /** @type {(inputs: Bank_Reconciled_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque encaissement du relevé est relié à sa facture. Le prochain import reprendra ici.`)
};

/**
* | output |
* | --- |
* | "Every payment on the statement is linked to its invoice. The next import will pick up here." |
*
* @param {Bank_Reconciled_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_body = /** @type {((inputs?: Bank_Reconciled_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciled_body(inputs)
	return en_bank_reconciled_body(inputs)
});