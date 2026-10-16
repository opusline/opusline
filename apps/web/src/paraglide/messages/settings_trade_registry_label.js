/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Trade_Registry_LabelInputs */

const en_settings_trade_registry_label = /** @type {(inputs: Settings_Trade_Registry_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trade registry (RCS / RM)`)
};

const fr_settings_trade_registry_label = /** @type {(inputs: Settings_Trade_Registry_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Immatriculation (RCS / RM)`)
};

/**
* | output |
* | --- |
* | "Trade registry (RCS / RM)" |
*
* @param {Settings_Trade_Registry_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_trade_registry_label = /** @type {((inputs?: Settings_Trade_Registry_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Trade_Registry_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_trade_registry_label(inputs)
	return en_settings_trade_registry_label(inputs)
});