/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Bank_Badge_To_ValidateInputs */

const en_bank_badge_to_validate = /** @type {(inputs: Bank_Badge_To_ValidateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} to validate`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} to validate`);
	return /** @type {LocalizedString} */ ("bank_badge_to_validate");
};

const fr_bank_badge_to_validate = /** @type {(inputs: Bank_Badge_To_ValidateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} à valider`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} à valider`);
	return /** @type {LocalizedString} */ ("bank_badge_to_validate");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} to validate" |
* | "other" | "{count} to validate" |
*
* @param {Bank_Badge_To_ValidateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_badge_to_validate = /** @type {((inputs: Bank_Badge_To_ValidateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Badge_To_ValidateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_badge_to_validate(inputs)
	return en_bank_badge_to_validate(inputs)
});