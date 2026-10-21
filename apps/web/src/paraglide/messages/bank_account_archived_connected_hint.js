/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Archived_Connected_HintInputs */

const en_bank_account_archived_connected_hint = /** @type {(inputs: Bank_Account_Archived_Connected_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disconnect its bank first: a connected account still receives movements.`)
};

const fr_bank_account_archived_connected_hint = /** @type {(inputs: Bank_Account_Archived_Connected_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déconnectez d'abord sa banque : un compte connecté reçoit encore des mouvements.`)
};

/**
* | output |
* | --- |
* | "Disconnect its bank first: a connected account still receives movements." |
*
* @param {Bank_Account_Archived_Connected_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_archived_connected_hint = /** @type {((inputs?: Bank_Account_Archived_Connected_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Archived_Connected_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_archived_connected_hint(inputs)
	return en_bank_account_archived_connected_hint(inputs)
});