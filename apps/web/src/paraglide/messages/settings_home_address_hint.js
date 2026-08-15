/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Home_Address_HintInputs */

const en_settings_home_address_hint = /** @type {(inputs: Settings_Home_Address_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Used for URSSAF and tax paperwork, never printed on CRAs or invoices.`)
};

const fr_settings_home_address_hint = /** @type {(inputs: Settings_Home_Address_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utilisée pour les démarches URSSAF et impôts, jamais imprimée sur les CRA ni les factures.`)
};

/**
* | output |
* | --- |
* | "Used for URSSAF and tax paperwork, never printed on CRAs or invoices." |
*
* @param {Settings_Home_Address_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_home_address_hint = /** @type {((inputs?: Settings_Home_Address_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Home_Address_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_home_address_hint(inputs)
	return en_settings_home_address_hint(inputs)
});