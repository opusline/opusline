/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Bank_Import_Success_LinesInputs */

const en_bank_import_success_lines = /** @type {(inputs: Bank_Import_Success_LinesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} line read`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} lines read`);
	return /** @type {LocalizedString} */ ("bank_import_success_lines");
};

const fr_bank_import_success_lines = /** @type {(inputs: Bank_Import_Success_LinesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} ligne lue`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} lignes lues`);
	return /** @type {LocalizedString} */ ("bank_import_success_lines");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} line read" |
* | "other" | "{count} lines read" |
*
* @param {Bank_Import_Success_LinesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_success_lines = /** @type {((inputs: Bank_Import_Success_LinesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Success_LinesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_success_lines(inputs)
	return en_bank_import_success_lines(inputs)
});