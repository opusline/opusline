/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_IntroInputs */

const en_bank_intro = /** @type {(inputs: Bank_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import the statement exported from your bank, or connect the bank to receive its movements every night: they feed the balance and invoice reconciliation.`)
};

const fr_bank_intro = /** @type {(inputs: Bank_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importez le relevé exporté depuis votre banque, ou connectez-la pour recevoir ses mouvements chaque nuit : ils alimentent le solde et le rapprochement des factures.`)
};

/**
* | output |
* | --- |
* | "Import the statement exported from your bank, or connect the bank to receive its movements every night: they feed the balance and invoice reconciliation." |
*
* @param {Bank_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_intro = /** @type {((inputs?: Bank_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_intro(inputs)
	return en_bank_intro(inputs)
});