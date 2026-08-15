/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Fiscality_HintInputs */

const en_settings_tab_fiscality_hint = /** @type {(inputs: Settings_Tab_Fiscality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF, VAT, provisions`)
};

const fr_settings_tab_fiscality_hint = /** @type {(inputs: Settings_Tab_Fiscality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF, TVA, provisions`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_fiscality_hint(inputs)
	return en_settings_tab_fiscality_hint(inputs)
});