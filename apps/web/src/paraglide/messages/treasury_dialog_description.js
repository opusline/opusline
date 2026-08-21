/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Dialog_DescriptionInputs */

const en_treasury_dialog_description = /** @type {(inputs: Treasury_Dialog_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline does not make the transfer. Note the one you have just made from your bank: the balance and the transferable amount are recomputed.`)
};

const fr_treasury_dialog_description = /** @type {(inputs: Treasury_Dialog_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline n'exécute pas le virement. Notez celui que vous venez de faire depuis votre banque : le solde et le montant virable se recalculent.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_dialog_description(inputs)
	return en_treasury_dialog_description(inputs)
});