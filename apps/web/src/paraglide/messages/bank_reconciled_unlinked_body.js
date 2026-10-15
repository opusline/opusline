/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_Unlinked_BodyInputs */

const en_bank_reconciled_unlinked_body = /** @type {(inputs: Bank_Reconciled_Unlinked_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Some payments still have no linked invoice — they stay visible in the movements. A future import can suggest new matches.`)
};

const fr_bank_reconciled_unlinked_body = /** @type {(inputs: Bank_Reconciled_Unlinked_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Certains encaissements restent sans facture liée — ils sont visibles dans les mouvements. Un prochain import pourra proposer de nouveaux rapprochements.`)
};

/**
* | output |
* | --- |
* | "Some payments still have no linked invoice — they stay visible in the movements. A future import can suggest new matches." |
*
* @param {Bank_Reconciled_Unlinked_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_unlinked_body = /** @type {((inputs?: Bank_Reconciled_Unlinked_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_Unlinked_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciled_unlinked_body(inputs)
	return en_bank_reconciled_unlinked_body(inputs)
});