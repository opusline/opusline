/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, file: NonNullable<unknown> }} Expenses_Scan_Fields_ReadInputs */

const en_expenses_scan_fields_read = /** @type {(inputs: Expenses_Scan_Fields_ReadInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} field read from ${i?.file}`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} fields read from ${i?.file}`);
	return /** @type {LocalizedString} */ ("expenses_scan_fields_read");
};

const fr_expenses_scan_fields_read = /** @type {(inputs: Expenses_Scan_Fields_ReadInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} champ lu sur ${i?.file}`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} champs lus sur ${i?.file}`);
	return /** @type {LocalizedString} */ ("expenses_scan_fields_read");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} field read from {file}" |
* | "other" | "{count} fields read from {file}" |
*
* @param {Expenses_Scan_Fields_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_fields_read = /** @type {((inputs: Expenses_Scan_Fields_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Fields_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_fields_read(inputs)
	return en_expenses_scan_fields_read(inputs)
});