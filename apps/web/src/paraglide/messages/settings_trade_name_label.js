/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Trade_Name_LabelInputs */

const en_settings_trade_name_label = /** @type {(inputs: Settings_Trade_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trade name`)
};

const fr_settings_trade_name_label = /** @type {(inputs: Settings_Trade_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom commercial`)
};

/**
* | output |
* | --- |
* | "Trade name" |
*
* @param {Settings_Trade_Name_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_trade_name_label = /** @type {((inputs?: Settings_Trade_Name_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Trade_Name_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_trade_name_label(inputs)
	return en_settings_trade_name_label(inputs)
});