/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movements_TitleInputs */

const en_bank_movements_title = /** @type {(inputs: Bank_Movements_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Movements`)
};

const fr_bank_movements_title = /** @type {(inputs: Bank_Movements_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mouvements`)
};

/**
* | output |
* | --- |
* | "Movements" |
*
* @param {Bank_Movements_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_title = /** @type {((inputs?: Bank_Movements_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_title(inputs)
	return en_bank_movements_title(inputs)
});