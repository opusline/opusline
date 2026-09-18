/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ synced: NonNullable<unknown>, until: NonNullable<unknown> }} Bank_Connection_Synced_UntilInputs */

const en_bank_connection_synced_until = /** @type {(inputs: Bank_Connection_Synced_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Synced on ${i?.synced} · access valid until ${i?.until}`)
};

const fr_bank_connection_synced_until = /** @type {(inputs: Bank_Connection_Synced_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Synchronisé le ${i?.synced} · accès valable jusqu'au ${i?.until}`)
};

/**
* | output |
* | --- |
* | "Synced on {synced} · access valid until {until}" |
*
* @param {Bank_Connection_Synced_UntilInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_synced_until = /** @type {((inputs: Bank_Connection_Synced_UntilInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Synced_UntilInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_synced_until(inputs)
	return en_bank_connection_synced_until(inputs)
});