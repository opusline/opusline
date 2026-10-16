/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Bank_HintInputs */

const en_settings_bank_hint = /** @type {(inputs: Settings_Bank_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Printed on your invoices, for payment by transfer`)
};

const fr_settings_bank_hint = /** @type {(inputs: Settings_Bank_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Imprimées sur vos factures, pour le paiement par virement`)
};

/**
* | output |
* | --- |
* | "Printed on your invoices, for payment by transfer" |
*
* @param {Settings_Bank_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_bank_hint = /** @type {((inputs?: Settings_Bank_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Bank_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_bank_hint(inputs)
	return en_settings_bank_hint(inputs)
});