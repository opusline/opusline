/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Catalog_CountInputs */

const en_catalog_count = /** @type {(inputs: Catalog_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} service`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} services`);
	return /** @type {LocalizedString} */ ("catalog_count");
};

const fr_catalog_count = /** @type {(inputs: Catalog_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} prestation`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} prestations`);
	return /** @type {LocalizedString} */ ("catalog_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} service" |
* | "other" | "{count} services" |
*
* @param {Catalog_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_count = /** @type {((inputs: Catalog_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_count(inputs)
	return en_catalog_count(inputs)
});