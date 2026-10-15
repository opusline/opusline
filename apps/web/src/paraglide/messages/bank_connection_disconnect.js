/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_DisconnectInputs */

const en_bank_connection_disconnect = /** @type {(inputs: Bank_Connection_DisconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disconnect`)
};

const fr_bank_connection_disconnect = /** @type {(inputs: Bank_Connection_DisconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déconnecter`)
};

/**
* | output |
* | --- |
* | "Disconnect" |
*
* @param {Bank_Connection_DisconnectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_disconnect = /** @type {((inputs?: Bank_Connection_DisconnectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_DisconnectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_disconnect(inputs)
	return en_bank_connection_disconnect(inputs)
});