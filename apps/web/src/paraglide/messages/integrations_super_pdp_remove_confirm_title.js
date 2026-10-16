/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Remove_Confirm_TitleInputs */

const en_integrations_super_pdp_remove_confirm_title = /** @type {(inputs: Integrations_Super_Pdp_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the Super PDP application?`)
};

const fr_integrations_super_pdp_remove_confirm_title = /** @type {(inputs: Integrations_Super_Pdp_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer l'application Super PDP ?`)
};

/**
* | output |
* | --- |
* | "Remove the Super PDP application?" |
*
* @param {Integrations_Super_Pdp_Remove_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_remove_confirm_title = /** @type {((inputs?: Integrations_Super_Pdp_Remove_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Remove_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_remove_confirm_title(inputs)
	return en_integrations_super_pdp_remove_confirm_title(inputs)
});