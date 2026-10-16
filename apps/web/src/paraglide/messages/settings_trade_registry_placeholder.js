/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Trade_Registry_PlaceholderInputs */

const en_settings_trade_registry_placeholder = /** @type {(inputs: Settings_Trade_Registry_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RCS Lyon 000 000 000`)
};

const fr_settings_trade_registry_placeholder = /** @type {(inputs: Settings_Trade_Registry_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RCS Lyon 000 000 000`)
};

/**
* | output |
* | --- |
* | "RCS Lyon 000 000 000" |
*
* @param {Settings_Trade_Registry_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_trade_registry_placeholder = /** @type {((inputs?: Settings_Trade_Registry_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Trade_Registry_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_trade_registry_placeholder(inputs)
	return en_settings_trade_registry_placeholder(inputs)
});