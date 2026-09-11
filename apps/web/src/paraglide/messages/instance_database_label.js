/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Database_LabelInputs */

const en_instance_database_label = /** @type {(inputs: Instance_Database_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Database`)
};

const fr_instance_database_label = /** @type {(inputs: Instance_Database_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base de données`)
};

/**
* | output |
* | --- |
* | "Database" |
*
* @param {Instance_Database_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_database_label = /** @type {((inputs?: Instance_Database_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Database_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_database_label(inputs)
	return en_instance_database_label(inputs)
});