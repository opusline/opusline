/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Settings_SubtitleInputs */

const en_invoicing_settings_subtitle = /** @type {(inputs: Invoicing_Settings_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applied by default to every new invoice and every new quote. A document already issued does not change.`)
};

const fr_invoicing_settings_subtitle = /** @type {(inputs: Invoicing_Settings_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Appliqués par défaut à chaque nouvelle facture et à chaque nouveau devis. Un document déjà émis ne change pas.`)
};

/**
* | output |
* | --- |
* | "Applied by default to every new invoice and every new quote. A document already issued does not change." |
*
* @param {Invoicing_Settings_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_settings_subtitle = /** @type {((inputs?: Invoicing_Settings_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Settings_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_settings_subtitle(inputs)
	return en_invoicing_settings_subtitle(inputs)
});