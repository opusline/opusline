/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_SyncedInputs */

const en_security_passkey_synced = /** @type {(inputs: Security_Passkey_SyncedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synced`)
};

const fr_security_passkey_synced = /** @type {(inputs: Security_Passkey_SyncedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synchronisée`)
};

/**
* | output |
* | --- |
* | "Synced" |
*
* @param {Security_Passkey_SyncedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_synced = /** @type {((inputs?: Security_Passkey_SyncedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_SyncedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_synced(inputs)
	return en_security_passkey_synced(inputs)
});