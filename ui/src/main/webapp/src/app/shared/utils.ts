import {Observable} from "rxjs/Observable";

export function substringAfterLast(str, delimiter) {
    return str.substring(str.lastIndexOf(delimiter) + 1); // +1 trick for no occurence.
}

export module utils {

    export function getErrorMessage(error: any): string
    {
        if (error instanceof ProgressEvent) {
            return "The network connection was lost. Please try again later.";
        } else if (typeof error == 'string') {
            return error;
        } else if (typeof error == 'object' && error.hasOwnProperty('message')) {
            return error.message;
        } else if (typeof error == 'object' && error.hasOwnProperty('error')) {
            return error.error;
        } else {
            return 'Unknown error: ' + error;
        }
    }

    /**
     * Replaces "{i}" in format with i-th member of replacements.
     */
    export function formatString(format: string, ...replacements: string[]): string
    {
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof replacements[number] != 'undefined' ? replacements[number] : match;
        });
    }

    export class Arrays {
        public static flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[], thisArg?: any): U[] {
            return array.map(callbackfn, thisArg)
                .reduce((allItems, currentItems) => [...allItems, ...currentItems ], []);
        }
    }

    export class Observables {
        /**
         * This method resolves specified properties of object and saves them into resolved property.
         *
         * Example: [ { name: Observable.of('hello') }, { name: Observable.of('world') } ]
         * Result:  [ { name: Observable.of('hello'), resolved: { name: 'hello' } },
         *            { nane: Observable.of('world'), resolved: { name: 'world' } } ]
         *
         * @param {Observable<T[]>} arrayObservable
         * @param {string[]} properties
         * @returns {Observable<T[]>}
         */
        public static resolveValuesArray<T, K extends keyof T>(arrayObservable: Observable<T[]>, properties: K[]): Observable<ResolvedObject<T, K>[]> {
            return arrayObservable.flatMap((array: T[]) => {
                /* Result of this map operation is array of observables, one for each array item */
                const resolvedObjectObservables = array.map(object => {
                    let resolvedObject: any = Object.assign(object, {resolved: {}});

                    /*
                     * This part resolves all properties - creates array of observables.
                     * Each member of array is property-resolving observable.
                     */
                    const propertiesObservables = properties.map(property => {
                        if (Observables.isObservable(object[property])) {
                            return resolvedObject[property].map(resolvedProperty => {
                                resolvedObject.resolved[property] = resolvedProperty;
                                return resolvedObject;
                            });
                        } else {
                            resolvedObject.resolved[property] = resolvedObject[property];
                            return Observable.of(resolvedObject);
                        }
                    });


                    /*
                     * This part creates observable which joins all propertiesObservables and maps result into single object
                     *  with resolved properties
                     */
                    return Observable.forkJoin(propertiesObservables).map(resolvedObjects => {
                        if (resolvedObjects.length > 0) {
                            return resolvedObjects[0];
                        } else {
                            return null;
                        }
                    });
                });

                return Observable.forkJoin(resolvedObjectObservables);
            });
        }

        public static resolveValues<T, K extends keyof T>(objectObservable: Observable<T>, properties: K[]): Observable<ResolvedObject<T, K>> {
            return objectObservable.flatMap(object => this.resolveObjectProperties(object, properties));
        }

        public static resolveObjectProperties<T, K extends keyof T>(object: T, properties: K[]): Observable<ResolvedObject<T, K>> {
            let resolvedObject: any = Object.assign(object, {resolved: {}});

            /*
             * This part resolves all properties - creates array of observables.
             * Each member of array is property-resolving observable.
             */
            const propertiesObservables = properties.map(property => {
                if (Observables.isObservable(object[property])) {
                    return resolvedObject[property].map(resolvedProperty => {
                        resolvedObject.resolved[property] = resolvedProperty;
                        return resolvedObject;
                    });
                } else {
                    resolvedObject.resolved[property] = resolvedObject[property];
                    return Observable.of(resolvedObject);
                }
            });


            /*
             * This part creates observable which joins all propertiesObservables and maps result into single object
             *  with resolved properties
             */
            return Observable.forkJoin(propertiesObservables).map(resolvedObjects => {
                if (resolvedObjects.length > 0) {
                    return resolvedObjects[0];
                } else {
                    return null;
                }
            });
        }

        /**
         * Not really a proper way to detect observable, but good enough for now
         * Borrowed from https://github.com/angular/angular/pull/15171
         *
         * @param obj
         * @returns {boolean}
         */
        public static isObservable(obj: any|Observable<any>) {
            return !!obj && typeof obj.subscribe === 'function';
        }
    }
}

interface ResolvedInterface<T, K extends keyof T> {
    resolved: Record<K, any>; // Pick<T, K>;
}

/**
 * Object with data in resolved field
 */
export type ResolvedObject<T, K extends keyof T> = T & ResolvedInterface<T, K>;

/*
type UnwrapObservable<T extends Observable<K> | any, K> = K;

export interface Cat { name: string, weight: Observable<number> }

let a: Observable<Cat>;
let b: UnwrapObservable<Observable<Cat>, Cat>;
let c: ResolvedObject<Cat, 'weight'>;

declare function mapObject<K extends string, T, U>(obj: Record<K, T>, f: (x: T) => U): Record<K, U>;
*/
