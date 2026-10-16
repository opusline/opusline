/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Client_Secret_HelpInputs */

const en_integrations_super_pdp_client_secret_help = /** @type {(inputs: Integrations_Super_Pdp_Client_Secret_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shown once when the application is created. It is encrypted and never shown again.`)
};

const fr_integrations_super_pdp_client_secret_help = /** @type {(inputs: Integrations_Super_Pdp_Client_Secret_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Affiché une seule fois à la création de l'application. Il est chiffré et ne sera plus jamais affiché.`)
};

/**
* | output |
* | --- |
* | "Shown once when the application is created. It is encrypted and never shown again." |
*
* @param {Integrations_Super_Pdp_Client_Secret_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_client_secret_help = /** @type {((inputs?: Integrations_Super_Pdp_Client_Secret_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Client_Secret_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_client_secret_help(inputs)
	return en_integrations_super_pdp_client_secret_help(inputs)
});