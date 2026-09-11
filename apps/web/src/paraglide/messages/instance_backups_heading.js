/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backups_HeadingInputs */

const en_instance_backups_heading = /** @type {(inputs: Instance_Backups_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backups`)
};

const fr_instance_backups_heading = /** @type {(inputs: Instance_Backups_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegardes`)
};

/**
* | output |
* | --- |
* | "Backups" |
*
* @param {Instance_Backups_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backups_heading = /** @type {((inputs?: Instance_Backups_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backups_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backups_heading(inputs)
	return en_instance_backups_heading(inputs)
});