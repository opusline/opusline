/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movements_EmptyInputs */

const en_bank_movements_empty = /** @type {(inputs: Bank_Movements_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No movements to show yet.`)
};

const fr_bank_movements_empty = /** @type {(inputs: Bank_Movements_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun mouvement à afficher pour l'instant.`)
};

/**
* | output |
* | --- |
* | "No movements to show yet." |
*
* @param {Bank_Movements_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_empty = /** @type {((inputs?: Bank_Movements_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_empty(inputs)
	return en_bank_movements_empty(inputs)
});