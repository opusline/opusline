/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Client_Secret_LabelInputs */

const en_integrations_super_pdp_client_secret_label = /** @type {(inputs: Integrations_Super_Pdp_Client_Secret_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client secret`)
};

const fr_integrations_super_pdp_client_secret_label = /** @type {(inputs: Integrations_Super_Pdp_Client_Secret_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client secret`)
};

/**
* | output |
* | --- |
* | "Client secret" |
*
* @param {Integrations_Super_Pdp_Client_Secret_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_client_secret_label = /** @type {((inputs?: Integrations_Super_Pdp_Client_Secret_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Client_Secret_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_client_secret_label(inputs)
	return en_integrations_super_pdp_client_secret_label(inputs)
});