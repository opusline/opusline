/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Clients_Mission_CountInputs */

const en_clients_mission_count = /** @type {(inputs: Clients_Mission_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} mission`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} missions`);
	return /** @type {LocalizedString} */ ("clients_mission_count");
};

const fr_clients_mission_count = /** @type {(inputs: Clients_Mission_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} mission`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} missions`);
	return /** @type {LocalizedString} */ ("clients_mission_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} mission" |
* | "other" | "{count} missions" |
*
* @param {Clients_Mission_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_mission_count = /** @type {((inputs: Clients_Mission_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Mission_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_mission_count(inputs)
	return en_clients_mission_count(inputs)
});