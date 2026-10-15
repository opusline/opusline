/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Bank_Import_Success_SuggestionsInputs */

const en_bank_import_success_suggestions = /** @type {(inputs: Bank_Import_Success_SuggestionsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} match suggested`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} matches suggested`);
	return /** @type {LocalizedString} */ ("bank_import_success_suggestions");
};

const fr_bank_import_success_suggestions = /** @type {(inputs: Bank_Import_Success_SuggestionsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} rapprochement proposé`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} rapprochements proposés`);
	return /** @type {LocalizedString} */ ("bank_import_success_suggestions");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} match suggested" |
* | "other" | "{count} matches suggested" |
*
* @param {Bank_Import_Success_SuggestionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_success_suggestions = /** @type {((inputs: Bank_Import_Success_SuggestionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Success_SuggestionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_success_suggestions(inputs)
	return en_bank_import_success_suggestions(inputs)
});