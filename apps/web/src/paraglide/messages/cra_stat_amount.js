/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Stat_AmountInputs */

const en_cra_stat_amount = /** @type {(inputs: Cra_Stat_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net amount`)
};

const fr_cra_stat_amount = /** @type {(inputs: Cra_Stat_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant HT`)
};

/**
* | output |
* | --- |
* | "Net amount" |
*
* @param {Cra_Stat_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_stat_amount = /** @type {((inputs?: Cra_Stat_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Stat_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_stat_amount(inputs)
	return en_cra_stat_amount(inputs)
});