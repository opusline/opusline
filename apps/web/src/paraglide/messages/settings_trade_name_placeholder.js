/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Trade_Name_PlaceholderInputs */

const en_settings_trade_name_placeholder = /** @type {(inputs: Settings_Trade_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The name you invoice under`)
};

const fr_settings_trade_name_placeholder = /** @type {(inputs: Settings_Trade_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom sous lequel vous facturez`)
};

/**
* | output |
* | --- |
* | "The name you invoice under" |
*
* @param {Settings_Trade_Name_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_trade_name_placeholder = /** @type {((inputs?: Settings_Trade_Name_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Trade_Name_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_trade_name_placeholder(inputs)
	return en_settings_trade_name_placeholder(inputs)
});