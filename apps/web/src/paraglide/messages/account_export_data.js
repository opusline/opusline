/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Export_DataInputs */

const en_account_export_data = /** @type {(inputs: Account_Export_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export my data`)
};

const fr_account_export_data = /** @type {(inputs: Account_Export_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter mes données`)
};

/**
* | output |
* | --- |
* | "Export my data" |
*
* @param {Account_Export_DataInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const account_export_data = /** @type {((inputs?: Account_Export_DataInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Export_DataInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_export_data(inputs)
	return en_account_export_data(inputs)
});