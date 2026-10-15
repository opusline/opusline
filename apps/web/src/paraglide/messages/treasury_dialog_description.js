/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Dialog_DescriptionInputs */



/**
* | output |
* | --- |
* | "Opusline does not make the transfer. Note the one you have just made from your bank: the balance and the transferable amount are recomputed." |
*
* @param {Treasury_Dialog_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_dialog_description = /** @type {((inputs?: Treasury_Dialog_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Dialog_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Opusline n'exécute pas le virement. Notez celui que vous venez de faire depuis votre banque : le solde et le montant virable se recalculent.")
	return /** @type {LocalizedString} */ ("Opusline does not make the transfer. Note the one you have just made from your bank: the balance and the transferable amount are recomputed.")
});