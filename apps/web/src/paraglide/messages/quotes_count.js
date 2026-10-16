/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Quotes_CountInputs */

const en_quotes_count = /** @type {(inputs: Quotes_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} quote`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} quotes`);
	return /** @type {LocalizedString} */ ("quotes_count");
};

const fr_quotes_count = /** @type {(inputs: Quotes_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} devis`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} devis`);
	return /** @type {LocalizedString} */ ("quotes_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} quote" |
* | "other" | "{count} quotes" |
*
* @param {Quotes_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_count = /** @type {((inputs: Quotes_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_count(inputs)
	return en_quotes_count(inputs)
});