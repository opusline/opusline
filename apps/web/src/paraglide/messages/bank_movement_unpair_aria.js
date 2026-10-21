/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movement_Unpair_AriaInputs */

const en_bank_movement_unpair_aria = /** @type {(inputs: Bank_Movement_Unpair_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not a transfer between my accounts`)
};

const fr_bank_movement_unpair_aria = /** @type {(inputs: Bank_Movement_Unpair_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas un virement entre mes comptes`)
};

/**
* | output |
* | --- |
* | "Not a transfer between my accounts" |
*
* @param {Bank_Movement_Unpair_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movement_unpair_aria = /** @type {((inputs?: Bank_Movement_Unpair_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movement_Unpair_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movement_unpair_aria(inputs)
	return en_bank_movement_unpair_aria(inputs)
});