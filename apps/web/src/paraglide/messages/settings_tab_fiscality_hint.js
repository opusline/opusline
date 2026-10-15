/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Fiscality_HintInputs */



/**
* | output |
* | --- |
* | "URSSAF, VAT, provisions" |
*
* @param {Settings_Tab_Fiscality_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_fiscality_hint = /** @type {((inputs?: Settings_Tab_Fiscality_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Fiscality_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("URSSAF, TVA, provisions")
	return /** @type {LocalizedString} */ ("URSSAF, VAT, provisions")
});