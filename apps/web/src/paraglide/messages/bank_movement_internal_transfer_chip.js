/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movement_Internal_Transfer_ChipInputs */

const en_bank_movement_internal_transfer_chip = /** @type {(inputs: Bank_Movement_Internal_Transfer_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal transfer`)
};

const fr_bank_movement_internal_transfer_chip = /** @type {(inputs: Bank_Movement_Internal_Transfer_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virement interne`)
};

/**
* | output |
* | --- |
* | "Internal transfer" |
*
* @param {Bank_Movement_Internal_Transfer_ChipInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movement_internal_transfer_chip = /** @type {((inputs?: Bank_Movement_Internal_Transfer_ChipInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movement_Internal_Transfer_ChipInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movement_internal_transfer_chip(inputs)
	return en_bank_movement_internal_transfer_chip(inputs)
});