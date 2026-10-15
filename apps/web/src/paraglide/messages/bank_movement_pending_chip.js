/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movement_Pending_ChipInputs */

const en_bank_movement_pending_chip = /** @type {(inputs: Bank_Movement_Pending_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To reconcile`)
};

const fr_bank_movement_pending_chip = /** @type {(inputs: Bank_Movement_Pending_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À rapprocher`)
};

/**
* | output |
* | --- |
* | "To reconcile" |
*
* @param {Bank_Movement_Pending_ChipInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movement_pending_chip = /** @type {((inputs?: Bank_Movement_Pending_ChipInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movement_Pending_ChipInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movement_pending_chip(inputs)
	return en_bank_movement_pending_chip(inputs)
});