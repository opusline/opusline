/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Disconnect_Confirm_BodyInputs */

const en_bank_connection_disconnect_confirm_body = /** @type {(inputs: Bank_Connection_Disconnect_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Access is revoked at the bank. Movements already synced stay.`)
};

const fr_bank_connection_disconnect_confirm_body = /** @type {(inputs: Bank_Connection_Disconnect_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'accès est révoqué auprès de la banque. Les mouvements déjà synchronisés restent.`)
};

/**
* | output |
* | --- |
* | "Access is revoked at the bank. Movements already synced stay." |
*
* @param {Bank_Connection_Disconnect_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_disconnect_confirm_body = /** @type {((inputs?: Bank_Connection_Disconnect_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Disconnect_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_disconnect_confirm_body(inputs)
	return en_bank_connection_disconnect_confirm_body(inputs)
});