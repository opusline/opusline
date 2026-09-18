/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ until: NonNullable<unknown> }} Bank_Connection_Unsynced_UntilInputs */

const en_bank_connection_unsynced_until = /** @type {(inputs: Bank_Connection_Unsynced_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Not synced yet · access valid until ${i?.until}`)
};

const fr_bank_connection_unsynced_until = /** @type {(inputs: Bank_Connection_Unsynced_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pas encore synchronisé · accès valable jusqu'au ${i?.until}`)
};

/**
* | output |
* | --- |
* | "Not synced yet · access valid until {until}" |
*
* @param {Bank_Connection_Unsynced_UntilInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_unsynced_until = /** @type {((inputs: Bank_Connection_Unsynced_UntilInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Unsynced_UntilInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_unsynced_until(inputs)
	return en_bank_connection_unsynced_until(inputs)
});