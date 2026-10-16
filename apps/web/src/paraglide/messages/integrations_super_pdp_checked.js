/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Integrations_Super_Pdp_CheckedInputs */

const en_integrations_super_pdp_checked = /** @type {(inputs: Integrations_Super_Pdp_CheckedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Checked on ${i?.date}`)
};

const fr_integrations_super_pdp_checked = /** @type {(inputs: Integrations_Super_Pdp_CheckedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vérifié le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Checked on {date}" |
*
* @param {Integrations_Super_Pdp_CheckedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_checked = /** @type {((inputs: Integrations_Super_Pdp_CheckedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_CheckedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_checked(inputs)
	return en_integrations_super_pdp_checked(inputs)
});