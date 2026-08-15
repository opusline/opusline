/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Currency_HintInputs */

const en_settings_currency_hint = /** @type {(inputs: Settings_Currency_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every amount in the app is counted and displayed in this currency: revenue, invoices, treasury buffer, provisions. It becomes final with the first priced mission or invoice.`)
};

const fr_settings_currency_hint = /** @type {(inputs: Settings_Currency_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous les montants de l'application sont comptés et affichés dans cette devise : revenus, factures, matelas de trésorerie, provisions. Elle devient définitive à la première mission tarifée ou facture.`)
};

/**
* | output |
* | --- |
* | "Every amount in the app is counted and displayed in this currency: revenue, invoices, treasury buffer, provisions. It becomes final with the first priced mis..." |
*
* @param {Settings_Currency_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_currency_hint = /** @type {((inputs?: Settings_Currency_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Currency_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_currency_hint(inputs)
	return en_settings_currency_hint(inputs)
});