import type Demonstrator from './Demonstrator';
import type { DateTime } from 'luxon';
export default interface GenerationDemonstator extends Demonstrator {
	lastVisit?: DateTime;
	deficit: number;
}
