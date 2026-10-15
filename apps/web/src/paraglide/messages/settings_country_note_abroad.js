/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Country_Note_AbroadInputs */

const en_settings_country_note_abroad = /** @type {(inputs: Settings_Country_Note_AbroadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time tracking, clients and invoices work normally. This country's tax rules are not implemented yet though: contributions, VAT and the registration number must be entered by hand.`)
};

const fr_settings_country_note_abroad = /** @type {(inputs: Settings_Country_Note_AbroadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le suivi du temps, les clients et les factures fonctionnent normalement. En revanche les règles fiscales de ce pays ne sont pas encore implémentées : cotisations, TVA et numéro d'immatriculation restent à saisir à la main.`)
};

/**
* | output |
* | --- |
* | "Time tracking, clients and invoices work normally. This country's tax rules are not implemented yet though: contributions, VAT and the registration number mu..." |
*
* @param {Settings_Country_Note_AbroadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_country_note_abroad = /** @type {((inputs?: Settings_Country_Note_AbroadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Country_Note_AbroadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_country_note_abroad(inputs)
	return en_settings_country_note_abroad(inputs)
});