/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Disconnect_Confirm_TitleInputs */

const en_bank_connection_disconnect_confirm_title = /** @type {(inputs: Bank_Connection_Disconnect_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disconnect the bank?`)
};

const fr_bank_connection_disconnect_confirm_title = /** @type {(inputs: Bank_Connection_Disconnect_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déconnecter la banque ?`)
};

/**
* | output |
* | --- |
* | "Disconnect the bank?" |
*
* @param {Bank_Connection_Disconnect_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_disconnect_confirm_title = /** @type {((inputs?: Bank_Connection_Disconnect_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Disconnect_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_disconnect_confirm_title(inputs)
	return en_bank_connection_disconnect_confirm_title(inputs)
});