/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_UnverifiedInputs */

const en_integrations_super_pdp_unverified = /** @type {(inputs: Integrations_Super_Pdp_UnverifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP has not verified your company yet. Once it has, test the connection again.`)
};

const fr_integrations_super_pdp_unverified = /** @type {(inputs: Integrations_Super_Pdp_UnverifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP n'a pas encore vérifié votre entreprise. Une fois fait, testez à nouveau la connexion.`)
};

/**
* | output |
* | --- |
* | "Super PDP has not verified your company yet. Once it has, test the connection again." |
*
* @param {Integrations_Super_Pdp_UnverifiedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_unverified = /** @type {((inputs?: Integrations_Super_Pdp_UnverifiedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_UnverifiedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_unverified(inputs)
	return en_integrations_super_pdp_unverified(inputs)
});