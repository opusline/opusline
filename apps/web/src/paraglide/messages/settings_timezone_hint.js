/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Timezone_HintInputs */

const en_settings_timezone_hint = /** @type {(inputs: Settings_Timezone_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sets today's date for payments, CRA sends and invoices — a payment entered at 0:30 lands on your date, not the server's.`)
};

const fr_settings_timezone_hint = /** @type {(inputs: Settings_Timezone_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détermine la date du jour pour les paiements, envois de CRA et factures — un règlement saisi à 0 h 30 tombe sur votre date, pas sur celle du serveur.`)
};

/**
* | output |
* | --- |
* | "Sets today's date for payments, CRA sends and invoices — a payment entered at 0:30 lands on your date, not the server's." |
*
* @param {Settings_Timezone_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_timezone_hint = /** @type {((inputs?: Settings_Timezone_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Timezone_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_timezone_hint(inputs)
	return en_settings_timezone_hint(inputs)
});