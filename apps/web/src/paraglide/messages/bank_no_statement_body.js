/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_No_Statement_BodyInputs */

const en_bank_no_statement_body = /** @type {(inputs: Bank_No_Statement_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop in the statement exported from your bank: Opusline suggests an invoice for each payment, you validate in one click.`)
};

const fr_bank_no_statement_body = /** @type {(inputs: Bank_No_Statement_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposez le relevé exporté depuis votre banque : Opusline propose une facture pour chaque encaissement, vous validez d'un clic.`)
};

/**
* | output |
* | --- |
* | "Drop in the statement exported from your bank: Opusline suggests an invoice for each payment, you validate in one click." |
*
* @param {Bank_No_Statement_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_no_statement_body = /** @type {((inputs?: Bank_No_Statement_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_No_Statement_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_no_statement_body(inputs)
	return en_bank_no_statement_body(inputs)
});