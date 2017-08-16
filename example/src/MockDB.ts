import {IPotato} from "./IPotato";

export const MockDB = new Map<number, IPotato>();

MockDB.set(1, {id: 1, size: 'tiny'});
MockDB.set(2, {id: 2, size: 'massive'});
