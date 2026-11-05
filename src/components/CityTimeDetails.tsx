import type { City } from '../lib/cities';
import { getCitySeasonalContext } from '../lib/search-context';
import { formatOffset, getLocalParts, getOffsetMinutes } from '../lib/time';
import { useCurrentTime } from '../lib/use-current-time';

export default function CityTimeDetails({ city }: { city: City }) {
	const now = useCurrentTime();
	return <dl class="mt-8 grid grid-cols-2 gap-5 border-t border-stone-300 pt-6 text-sm">
		<div><dt class="text-stone-500">Timezone</dt><dd class="mt-1 break-words font-medium">{city.zone}</dd></div>
		<div><dt class="text-stone-500">Offset now</dt><dd class="mt-1 font-medium" data-current-offset>{now === null ? 'Loading…' : formatOffset(getOffsetMinutes(now, city.zone))}</dd></div>
		<div><dt class="text-stone-500">Short name</dt><dd class="mt-1 font-medium" data-current-abbreviation>{now === null ? 'Loading…' : getLocalParts(now, city.zone).abbreviation}</dd></div>
		<div><dt class="text-stone-500">Country</dt><dd class="mt-1 font-medium">{city.country}</dd></div>
	</dl>;
}

export function CitySeasonalContext({ city }: { city: City }) {
	const now = useCurrentTime();
	return <p class="mt-3 text-sm leading-6 text-stone-600">{now === null
		? 'The clock uses the time-zone rule for the date of your call. Check the current offset above before planning.'
		: getCitySeasonalContext(city, getLocalParts(now, city.zone).year)}</p>;
}
