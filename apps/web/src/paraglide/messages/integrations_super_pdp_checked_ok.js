/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Checked_OkInputs */

const en_integrations_super_pdp_checked_ok = /** @type {(inputs: Integrations_Super_Pdp_Checked_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connection checked.`)
};

const fr_integrations_super_pdp_checked_ok = /** @type {(inputs: Integrations_Super_Pdp_Checked_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connexion vérifiée.`)
};

/**
* | output |
* | --- |
* | "Connection checked." |
*
* @param {Integrations_Super_Pdp_Checked_OkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_checked_ok = /** @type {((inputs?: Integrations_Super_Pdp_Checked_OkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Checked_OkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_checked_ok(inputs)
	return en_integrations_super_pdp_checked_ok(inputs)
});