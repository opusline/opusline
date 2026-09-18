/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ bank: NonNullable<unknown>, start: NonNullable<unknown>, end: NonNullable<unknown> }} Bank_Movements_Source_SyncedInputs */

const en_bank_movements_source_synced = /** @type {(inputs: Bank_Movements_Source_SyncedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Synced from ${i?.bank}, ${i?.start} to ${i?.end}`)
};

const fr_bank_movements_source_synced = /** @type {(inputs: Bank_Movements_Source_SyncedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Synchronisé depuis ${i?.bank}, du ${i?.start} au ${i?.end}`)
};

/**
* | output |
* | --- |
* | "Synced from {bank}, {start} to {end}" |
*
* @param {Bank_Movements_Source_SyncedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_source_synced = /** @type {((inputs: Bank_Movements_Source_SyncedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_Source_SyncedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_source_synced(inputs)
	return en_bank_movements_source_synced(inputs)
});