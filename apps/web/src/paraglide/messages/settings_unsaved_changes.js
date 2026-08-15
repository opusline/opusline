/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Settings_Unsaved_ChangesInputs */

const en_settings_unsaved_changes = /** @type {(inputs: Settings_Unsaved_ChangesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} unsaved change`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} unsaved changes`);
	return /** @type {LocalizedString} */ ("settings_unsaved_changes");
};

const fr_settings_unsaved_changes = /** @type {(inputs: Settings_Unsaved_ChangesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} modification non enregistrée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} modifications non enregistrées`);
	return /** @type {LocalizedString} */ ("settings_unsaved_changes");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} unsaved change" |
* | "other" | "{count} unsaved changes" |
*
* @param {Settings_Unsaved_ChangesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_unsaved_changes = /** @type {((inputs: Settings_Unsaved_ChangesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Unsaved_ChangesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_unsaved_changes(inputs)
	return en_settings_unsaved_changes(inputs)
});