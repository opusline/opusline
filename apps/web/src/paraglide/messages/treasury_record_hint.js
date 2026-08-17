/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Record_HintInputs */

const en_treasury_record_hint = /** @type {(inputs: Treasury_Record_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline does not move the money. Note the transfer you just made from your bank: the balance and the safe amount recompute.`)
};

const fr_treasury_record_hint = /** @type {(inputs: Treasury_Record_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline n'exécute pas le virement. Notez celui que vous venez de faire depuis votre banque : le solde et le montant virable se recalculent.`)
};

/**
* | output |
* | --- |
* | "Opusline does not move the money. Note the transfer you just made from your bank: the balance and the safe amount recompute." |
*
* @param {Treasury_Record_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_record_hint = /** @type {((inputs?: Treasury_Record_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Record_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_record_hint(inputs)
	return en_treasury_record_hint(inputs)
});