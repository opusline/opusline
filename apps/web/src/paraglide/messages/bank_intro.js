/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_IntroInputs */

const en_bank_intro = /** @type {(inputs: Bank_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline does not connect to any bank. You drop in the statement exported from yours: it feeds the balance, the movements and invoice reconciliation.`)
};

const fr_bank_intro = /** @type {(inputs: Bank_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline ne se connecte à aucune banque. Vous déposez le relevé exporté depuis la vôtre : il alimente le solde, les mouvements et le rapprochement des factures.`)
};

/**
* | output |
* | --- |
* | "Opusline does not connect to any bank. You drop in the statement exported from yours: it feeds the balance, the movements and invoice reconciliation." |
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