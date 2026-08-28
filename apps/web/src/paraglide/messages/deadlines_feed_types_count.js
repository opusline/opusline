/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Feed_Types_CountInputs */

const en_deadlines_feed_types_count = /** @type {(inputs: Deadlines_Feed_Types_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} deadline type published at this address.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} deadline types published at this address.`);
	return /** @type {LocalizedString} */ ("deadlines_feed_types_count");
};

const fr_deadlines_feed_types_count = /** @type {(inputs: Deadlines_Feed_Types_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} type d'échéances publié sur cette adresse.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} types d'échéances publiés sur cette adresse.`);
	return /** @type {LocalizedString} */ ("deadlines_feed_types_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} deadline type published at this address." |
* | "other" | "{count} deadline types published at this address." |
*
* @param {Deadlines_Feed_Types_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_types_count = /** @type {((inputs: Deadlines_Feed_Types_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Types_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_types_count(inputs)
	return en_deadlines_feed_types_count(inputs)
});