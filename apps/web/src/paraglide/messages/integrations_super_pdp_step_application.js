/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Step_ApplicationInputs */

const en_integrations_super_pdp_step_application = /** @type {(inputs: Integrations_Super_Pdp_Step_ApplicationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Under Developers → Applications, create an application with these scopes:`)
};

const fr_integrations_super_pdp_step_application = /** @type {(inputs: Integrations_Super_Pdp_Step_ApplicationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dans Developers → Applications, créez une application avec ces scopes :`)
};

/**
* | output |
* | --- |
* | "Under Developers → Applications, create an application with these scopes:" |
*
* @param {Integrations_Super_Pdp_Step_ApplicationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_step_application = /** @type {((inputs?: Integrations_Super_Pdp_Step_ApplicationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Step_ApplicationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_step_application(inputs)
	return en_integrations_super_pdp_step_application(inputs)
});