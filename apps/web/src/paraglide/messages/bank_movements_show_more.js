/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movements_Show_MoreInputs */

const en_bank_movements_show_more = /** @type {(inputs: Bank_Movements_Show_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show older movements`)
};

const fr_bank_movements_show_more = /** @type {(inputs: Bank_Movements_Show_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher les mouvements plus anciens`)
};

/**
* | output |
* | --- |
* | "Show older movements" |
*
* @param {Bank_Movements_Show_MoreInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_show_more = /** @type {((inputs?: Bank_Movements_Show_MoreInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_Show_MoreInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_show_more(inputs)
	return en_bank_movements_show_more(inputs)
});