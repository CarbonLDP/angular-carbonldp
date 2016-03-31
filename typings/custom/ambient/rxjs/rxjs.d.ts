declare module 'rxjs/Observer' {
	export interface NextObserver<T> {
	    isUnsubscribed?: boolean;
	    next: (value: T) => void;
	    error?: (err: any) => void;
	    complete?: () => void;
	}
	export interface ErrorObserver<T> {
	    isUnsubscribed?: boolean;
	    next?: (value: T) => void;
	    error: (err: any) => void;
	    complete?: () => void;
	}
	export interface CompletionObserver<T> {
	    isUnsubscribed?: boolean;
	    next?: (value: T) => void;
	    error?: (err: any) => void;
	    complete: () => void;
	}
	export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;
	export interface Observer<T> {
	    isUnsubscribed?: boolean;
	    next: (value: T) => void;
	    error: (err: any) => void;
	    complete: () => void;
	}
	export const empty: Observer<any>;

}
declare module 'rxjs/Subscription' {
	export class Subscription {
	    static EMPTY: Subscription;
	    isUnsubscribed: boolean;
	    constructor(_unsubscribe?: () => void);
	    unsubscribe(): void;
	    add(subscription: Subscription | Function | void): void;
	    remove(subscription: Subscription): void;
	}
	export class UnsubscriptionError extends Error {
	    errors: any[];
	    constructor(errors: any[]);
	}

}
declare module 'rxjs/Subscriber' {
	import { Observer, PartialObserver } from 'rxjs/Observer';
	import { Subscription } from 'rxjs/Subscription';
	export class Subscriber<T> extends Subscription implements Observer<T> {
	    static create<T>(next?: (x?: T) => void, error?: (e?: any) => void, complete?: () => void): Subscriber<T>;
	    syncErrorValue: any;
	    syncErrorThrown: boolean;
	    syncErrorThrowable: boolean;
	    protected isStopped: boolean;
	    protected destination: PartialObserver<any>;
	    constructor(destinationOrNext?: PartialObserver<any> | ((value: T) => void), error?: (e?: any) => void, complete?: () => void);
	    next(value?: T): void;
	    error(err?: any): void;
	    complete(): void;
	    unsubscribe(): void;
	    protected _next(value: T): void;
	    protected _error(err: any): void;
	    protected _complete(): void;
	}

}
declare module 'rxjs/Operator' {
	import { Subscriber } from 'rxjs/Subscriber';
	export class Operator<T, R> {
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}

}
declare module 'rxjs/scheduler/Action' {
	import { Subscription } from 'rxjs/Subscription';
	import { Scheduler } from 'rxjs/Scheduler';
	export interface Action extends Subscription {
	    work: (state?: any) => void | Subscription;
	    state?: any;
	    delay?: number;
	    schedule(state?: any, delay?: number): void;
	    execute(): void;
	    scheduler: Scheduler;
	}

}
declare module 'rxjs/Scheduler' {
	import { Subscription } from 'rxjs/Subscription';
	import { Action } from 'rxjs/scheduler/Action';
	export interface Scheduler {
	    now(): number;
	    schedule<T>(work: (state?: any) => Subscription | void, delay?: number, state?: any): Subscription;
	    flush(): void;
	    active: boolean;
	    actions: Action[];
	    scheduledId: number;
	}

}
declare module 'rxjs/Subject' {
	import { Operator } from 'rxjs/Operator';
	import { Observer } from 'rxjs/Observer';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class Subject<T> extends Observable<T> implements Observer<T>, Subscription {
	    protected destination: Observer<T>;
	    protected source: Observable<T>;
	    static create: Function;
	    constructor(destination?: Observer<T>, source?: Observable<T>);
	    observers: Observer<T>[];
	    isUnsubscribed: boolean;
	    protected isStopped: boolean;
	    protected hasErrored: boolean;
	    protected errorValue: any;
	    protected dispatching: boolean;
	    protected hasCompleted: boolean;
	    lift<T, R>(operator: Operator<T, R>): Observable<T>;
	    add(subscription: Subscription | Function | void): void;
	    remove(subscription: Subscription): void;
	    unsubscribe(): void;
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	    protected _unsubscribe(): void;
	    next(value: T): void;
	    error(err?: any): void;
	    complete(): void;
	    asObservable(): Observable<T>;
	    protected _next(value: T): void;
	    protected _finalNext(value: T): void;
	    protected _error(err: any): void;
	    protected _finalError(err: any): void;
	    protected _complete(): void;
	    protected _finalComplete(): void;
	    private throwIfUnsubscribed();
	}

}
declare module 'rxjs/operator/groupBy' {
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { Observable } from 'rxjs/Observable';
	import { Subject } from 'rxjs/Subject';
	/**
	 * Groups the items emitted by an Observable according to a specified criterion,
	 * and emits these grouped items as `GroupedObservables`, one `GroupedObservable` per group.
	 *
	 * <img src="./img/groupBy.png" width="100%">
	 *
	 * @param {Function} keySelector - a function that extracts the key for each item
	 * @param {Function} elementSelector - a function that extracts the return element for each item
	 * @returns {Observable} an Observable that emits GroupedObservables, each of which corresponds
	 * to a unique key value and each of which emits those items from the source Observable that share
	 * that key value.
	 */
	export function groupBy<T, K, R>(keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>): Observable<GroupedObservable<K, R>>;
	export interface RefCountSubscription {
	    count: number;
	    unsubscribe: () => void;
	    isUnsubscribed: boolean;
	    attemptedToUnsubscribe: boolean;
	}
	export class GroupedObservable<K, T> extends Observable<T> {
	    key: K;
	    private groupSubject;
	    private refCountSubscription;
	    constructor(key: K, groupSubject: Subject<T>, refCountSubscription?: RefCountSubscription);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription;
	}

}
declare module 'rxjs/observable/ConnectableObservable' {
	import { Subject } from 'rxjs/Subject';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class ConnectableObservable<T> extends Observable<T> {
	    protected source: Observable<T>;
	    protected subjectFactory: () => Subject<T>;
	    protected subject: Subject<T>;
	    protected subscription: Subscription;
	    constructor(source: Observable<T>, subjectFactory: () => Subject<T>);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription;
	    protected getSubject(): Subject<T>;
	    connect(): Subscription;
	    refCount(): Observable<T>;
	    /**
	     * This method is opened for `ConnectableSubscription`.
	     * Not to call from others.
	     */
	    _closeSubscription(): void;
	}

}
declare module 'rxjs/Notification' {
	import { PartialObserver } from 'rxjs/Observer';
	import { Observable } from 'rxjs/Observable';
	export class Notification<T> {
	    kind: string;
	    value: T;
	    exception: any;
	    hasValue: boolean;
	    constructor(kind: string, value?: T, exception?: any);
	    observe(observer: PartialObserver<T>): any;
	    do(next: (value: T) => void, error?: (err: any) => void, complete?: () => void): any;
	    accept(nextOrObserver: PartialObserver<T> | ((value: T) => void), error?: (err: any) => void, complete?: () => void): any;
	    toObservable(): Observable<T>;
	    private static completeNotification;
	    private static undefinedValueNotification;
	    static createNext<T>(value: T): Notification<T>;
	    static createError<T>(err?: any): Notification<T>;
	    static createComplete(): Notification<any>;
	}

}
declare module 'rxjs/InnerSubscriber' {
	import { Subscriber } from 'rxjs/Subscriber';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	export class InnerSubscriber<T, R> extends Subscriber<R> {
	    private parent;
	    private outerValue;
	    private outerIndex;
	    private index;
	    constructor(parent: OuterSubscriber<T, R>, outerValue: T, outerIndex: number);
	    protected _next(value: R): void;
	    protected _error(error: any): void;
	    protected _complete(): void;
	}

}
declare module 'rxjs/OuterSubscriber' {
	import { Subscriber } from 'rxjs/Subscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	export class OuterSubscriber<T, R> extends Subscriber<T> {
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    notifyError(error: any, innerSub: InnerSubscriber<T, R>): void;
	    notifyComplete(innerSub: InnerSubscriber<T, R>): void;
	}

}
declare module 'rxjs/operator/combineLatest' {
	import { Observable, ObservableInput } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	/**
	 * Combines the values from this observable with values from observables passed as arguments. This is done by subscribing
	 * to each observable, in order, and collecting an array of each of the most recent values any time any of the observables
	 * emits, then either taking that array and passing it as arguments to an option `project` function and emitting the return
	 * value of that, or just emitting the array of recent values directly if there is no `project` function.
	 * @param {...Observable} observables the observables to combine the source with
	 * @param {function} [project] an optional function to project the values from the combined recent values into a new value for emission.
	 * @returns {Observable} an observable of other projected values from the most recent values from each observable, or an array of each of
	 * the most recent values from each observable.
	 */
	export function combineLatest<T, R>(...observables: Array<ObservableInput<any> | Array<ObservableInput<any>> | ((...values: Array<any>) => R)>): Observable<R>;
	export interface CombineLatestSignature<T> {
	    <R>(project: (v1: T) => R): Observable<R>;
	    <T2, R>(v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
	    <T2, T3, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
	    <T2, T3, T4, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
	    <T2, T3, T4, T5, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
	    <T2, T3, T4, T5, T6, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
	    <T2>(v2: ObservableInput<T2>): Observable<[T, T2]>;
	    <T2, T3>(v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	    <T2, T3, T4>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	    <T2, T3, T4, T5>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	    <T2, T3, T4, T5, T6>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	    <R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	    <R>(array: ObservableInput<any>[]): Observable<R>;
	    <R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
	}
	/**
	 * Combines the values from observables passed as arguments. This is done by subscribing
	 * to each observable, in order, and collecting an array of each of the most recent values any time any of the observables
	 * emits, then either taking that array and passing it as arguments to an option `project` function and emitting the return
	 * value of that, or just emitting the array of recent values directly if there is no `project` function.
	 * @param {...Observable} observables the observables to combine
	 * @param {function} [project] an optional function to project the values from the combined recent values into a new value for emission.
	 * @returns {Observable} an observable of other projected values from the most recent values from each observable, or an array of each of
	 * the most recent values from each observable.
	 */
	export function combineLatestStatic<T>(v1: ObservableInput<T>): Observable<[T]>;
	export function combineLatestStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
	export function combineLatestStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	export function combineLatestStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	export function combineLatestStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	export function combineLatestStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	export function combineLatestStatic<T, R>(v1: ObservableInput<T>, project: (v1: T) => R): Observable<R>;
	export function combineLatestStatic<T, T2, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
	export function combineLatestStatic<T, T2, T3, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
	export function combineLatestStatic<T, T2, T3, T4, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
	export function combineLatestStatic<T, T2, T3, T4, T5, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
	export function combineLatestStatic<T, T2, T3, T4, T5, T6, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
	export function combineLatestStatic<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export function combineLatestStatic<R>(array: ObservableInput<any>[]): Observable<R>;
	export function combineLatestStatic<R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
	export class CombineLatestOperator<T, R> implements Operator<T, R> {
	    private project;
	    constructor(project?: (...values: Array<any>) => R);
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}
	export class CombineLatestSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private project;
	    private active;
	    private values;
	    private observables;
	    private toRespond;
	    constructor(destination: Subscriber<R>, project?: (...values: Array<any>) => R);
	    protected _next(observable: any): void;
	    protected _complete(): void;
	    notifyComplete(unused: Subscriber<R>): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    private _tryProject(values);
	}

}
declare module 'rxjs/operator/concat' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	/**
	 * Joins this observable with multiple other observables by subscribing to them one at a time, starting with the source,
	 * and merging their results into the returned observable. Will wait for each observable to complete before moving
	 * on to the next.
	 * @params {...Observable} the observables to concatenate
	 * @params {Scheduler} [scheduler] an optional scheduler to schedule each observable subscription on.
	 * @returns {Observable} All values of each passed observable merged into a single observable, in order, in serial fashion.
	 */
	export function concat<T, R>(...observables: Array<Observable<any> | Scheduler>): Observable<R>;
	/**
	 * Joins multiple observables together by subscribing to them one at a time and merging their results
	 * into the returned observable. Will wait for each observable to complete before moving on to the next.
	 * @params {...Observable} the observables to concatenate
	 * @params {Scheduler} [scheduler] an optional scheduler to schedule each observable subscription on.
	 * @returns {Observable} All values of each passed observable merged into a single observable, in order, in serial fashion.
	 */
	export function concatStatic<T, R>(...observables: Array<Observable<any> | Scheduler>): Observable<R>;

}
declare module 'rxjs/operator/merge' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	/**
	 * Creates a result Observable which emits values from every given input Observable.
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * @param {Observable} input Observables
	 * @returns {Observable} an Observable that emits items that are the result of every input Observable.
	 */
	export function merge<T, R>(...observables: Array<Observable<any> | Scheduler | number>): Observable<R>;
	export function mergeStatic<T, R>(...observables: Array<Observable<any> | Scheduler | number>): Observable<R>;

}
declare module 'rxjs/operator/zip' {
	import { Observable, ObservableInput } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	export function zipProto<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export interface ZipSignature<T> {
	    <R>(project: (v1: T) => R): Observable<R>;
	    <T2, R>(v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
	    <T2, T3, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
	    <T2, T3, T4, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
	    <T2, T3, T4, T5, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
	    <T2, T3, T4, T5, T6, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
	    <T2>(v2: ObservableInput<T2>): Observable<[T, T2]>;
	    <T2, T3>(v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	    <T2, T3, T4>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	    <T2, T3, T4, T5>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	    <T2, T3, T4, T5, T6>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	    <R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	    <R>(array: ObservableInput<any>[]): Observable<R>;
	    <R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
	}
	export function zipStatic<T>(v1: ObservableInput<T>): Observable<[T]>;
	export function zipStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
	export function zipStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	export function zipStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	export function zipStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	export function zipStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	export function zipStatic<T, R>(v1: ObservableInput<T>, project: (v1: T) => R): Observable<R>;
	export function zipStatic<T, T2, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
	export function zipStatic<T, T2, T3, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
	export function zipStatic<T, T2, T3, T4, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
	export function zipStatic<T, T2, T3, T4, T5, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
	export function zipStatic<T, T2, T3, T4, T5, T6, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
	export function zipStatic<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export function zipStatic<R>(array: ObservableInput<any>[]): Observable<R>;
	export function zipStatic<R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
	export class ZipOperator<T, R> implements Operator<T, R> {
	    project: (...values: Array<any>) => R;
	    constructor(project?: (...values: Array<any>) => R);
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}
	export class ZipSubscriber<T, R> extends Subscriber<T> {
	    private index;
	    private values;
	    private project;
	    private iterators;
	    private active;
	    constructor(destination: Subscriber<R>, project?: (...values: Array<any>) => R, values?: any);
	    protected _next(value: any): void;
	    protected _complete(): void;
	    notifyInactive(): void;
	    checkIterators(): void;
	    protected _tryProject(args: any[]): void;
	}

}
declare module 'rxjs/subject/AsyncSubject' {
	import { Subject } from 'rxjs/Subject';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class AsyncSubject<T> extends Subject<T> {
	    value: T;
	    hasNext: boolean;
	    protected _subscribe(subscriber: Subscriber<any>): Subscription | Function | void;
	    protected _next(value: T): void;
	    protected _complete(): void;
	}

}
declare module 'rxjs/observable/BoundCallbackObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { Scheduler } from 'rxjs/Scheduler';
	import { AsyncSubject } from 'rxjs/subject/AsyncSubject';
	export class BoundCallbackObservable<T> extends Observable<T> {
	    private callbackFunc;
	    private selector;
	    private args;
	    scheduler: Scheduler;
	    subject: AsyncSubject<T>;
	    static create<R>(callbackFunc: (callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): () => Observable<R>;
	    static create<T, R>(callbackFunc: (v1: T, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T) => Observable<R>;
	    static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2) => Observable<R>;
	    static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
	    static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
	    static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
	    static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
	    static create<R>(callbackFunc: (callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): () => Observable<R>;
	    static create<T, R>(callbackFunc: (v1: T, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T) => Observable<R>;
	    static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T, v2: T2) => Observable<R>;
	    static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
	    static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
	    static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
	    static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
	    static create<T>(callbackFunc: Function, selector?: void, scheduler?: Scheduler): (...args: any[]) => Observable<T>;
	    static create<T>(callbackFunc: Function, selector?: (...args: any[]) => T, scheduler?: Scheduler): (...args: any[]) => Observable<T>;
	    constructor(callbackFunc: Function, selector: Function, args: any[], scheduler: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T | T[]>): Subscription;
	}

}
declare module 'rxjs/observable/BoundNodeCallbackObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { Scheduler } from 'rxjs/Scheduler';
	import { AsyncSubject } from 'rxjs/subject/AsyncSubject';
	export class BoundNodeCallbackObservable<T> extends Observable<T> {
	    private callbackFunc;
	    private selector;
	    private args;
	    scheduler: Scheduler;
	    subject: AsyncSubject<T>;
	    static create<R>(callbackFunc: (callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): () => Observable<R>;
	    static create<T, R>(callbackFunc: (v1: T, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T) => Observable<R>;
	    static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2) => Observable<R>;
	    static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
	    static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
	    static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
	    static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: Scheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
	    static create<T>(callbackFunc: Function, selector?: void, scheduler?: Scheduler): (...args: any[]) => Observable<T>;
	    static create<T>(callbackFunc: Function, selector?: (...args: any[]) => T, scheduler?: Scheduler): (...args: any[]) => Observable<T>;
	    constructor(callbackFunc: Function, selector: Function, args: any[], scheduler: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T | T[]>): Subscription;
	}

}
declare module 'rxjs/observable/DeferObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class DeferObservable<T> extends Observable<T> {
	    private observableFactory;
	    static create<T>(observableFactory: () => Observable<T>): Observable<T>;
	    constructor(observableFactory: () => Observable<T>);
	    protected _subscribe(subscriber: Subscriber<T>): void;
	}

}
declare module 'rxjs/observable/EmptyObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Observable } from 'rxjs/Observable';
	import { Subscription } from 'rxjs/Subscription';
	export class EmptyObservable<T> extends Observable<T> {
	    private scheduler;
	    static create<T>(scheduler?: Scheduler): Observable<T>;
	    static dispatch({subscriber}: {
	        subscriber: any;
	    }): void;
	    constructor(scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/ForkJoinObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class ForkJoinObservable<T> extends Observable<T> {
	    private sources;
	    private resultSelector;
	    constructor(sources: Array<Observable<any> | Promise<any>>, resultSelector?: (...values: Array<any>) => T);
	    static create<T>(...sources: Array<Observable<any> | Promise<any> | Array<Observable<any>> | ((...values: Array<any>) => any)>): Observable<T>;
	    protected _subscribe(subscriber: Subscriber<any>): void;
	}

}
declare module 'rxjs/observable/FromObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class FromObservable<T> extends Observable<T> {
	    private ish;
	    private scheduler;
	    constructor(ish: Observable<T> | Promise<T> | Iterator<T> | ArrayLike<T>, scheduler: Scheduler);
	    static create<T>(ish: any, mapFnOrScheduler: Scheduler | ((x: any, y: number) => T), thisArg?: any, lastScheduler?: Scheduler): Observable<T>;
	    protected _subscribe(subscriber: Subscriber<T>): any;
	}

}
declare module 'rxjs/observable/ArrayObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class ArrayObservable<T> extends Observable<T> {
	    array: T[];
	    scheduler: Scheduler;
	    static create<T>(array: T[], scheduler?: Scheduler): ArrayObservable<T>;
	    static of<T>(...array: Array<T | Scheduler>): Observable<T>;
	    static dispatch(state: any): void;
	    value: any;
	    constructor(array: T[], scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/FromEventObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export type NodeStyleEventEmmitter = {
	    addListener: (eventName: string, handler: Function) => void;
	    removeListener: (eventName: string, handler: Function) => void;
	};
	export type JQueryStyleEventEmitter = {
	    on: (eventName: string, handler: Function) => void;
	    off: (eventName: string, handler: Function) => void;
	};
	export type EventTargetLike = EventTarget | NodeStyleEventEmmitter | JQueryStyleEventEmitter | NodeList | HTMLCollection;
	export class FromEventObservable<T, R> extends Observable<T> {
	    private sourceObj;
	    private eventName;
	    private selector;
	    static create<T>(sourceObj: EventTargetLike, eventName: string, selector?: (...args: Array<any>) => T): Observable<T>;
	    constructor(sourceObj: EventTargetLike, eventName: string, selector?: (...args: Array<any>) => T);
	    private static setupSubscription<T>(sourceObj, eventName, handler, subscriber);
	    protected _subscribe(subscriber: Subscriber<T>): void;
	}

}
declare module 'rxjs/observable/FromEventPatternObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class FromEventPatternObservable<T, R> extends Observable<T> {
	    private addHandler;
	    private removeHandler;
	    private selector;
	    static create<T>(addHandler: (handler: Function) => any, removeHandler: (handler: Function) => void, selector?: (...args: Array<any>) => T): FromEventPatternObservable<T, {}>;
	    constructor(addHandler: (handler: Function) => any, removeHandler: (handler: Function) => void, selector?: (...args: Array<any>) => T);
	    protected _subscribe(subscriber: Subscriber<T>): void;
	}

}
declare module 'rxjs/observable/PromiseObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class PromiseObservable<T> extends Observable<T> {
	    private promise;
	    scheduler: Scheduler;
	    value: T;
	    static create<T>(promise: Promise<T>, scheduler?: Scheduler): Observable<T>;
	    constructor(promise: Promise<T>, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/IntervalObservable' {
	import { Subscriber } from 'rxjs/Subscriber';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	export class IntervalObservable extends Observable<number> {
	    private period;
	    private scheduler;
	    static create(period?: number, scheduler?: Scheduler): Observable<number>;
	    static dispatch(state: any): void;
	    constructor(period?: number, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<number>): void;
	}

}
declare module 'rxjs/observable/TimerObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscription } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	export class TimerObservable extends Observable<number> {
	    static create(dueTime?: number | Date, period?: number | Scheduler, scheduler?: Scheduler): Observable<number>;
	    static dispatch(state: any): any;
	    private period;
	    private dueTime;
	    private scheduler;
	    constructor(dueTime?: number | Date, period?: number | Scheduler, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<number>): Subscription | Function | void;
	}

}
declare module 'rxjs/operator/race' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	/**
	 * Returns an Observable that mirrors the first source Observable to emit an item
	 * from the combination of this Observable and supplied Observables
	 * @param {...Observables} ...observables sources used to race for which Observable emits first.
	 * @returns {Observable} an Observable that mirrors the output of the first Observable to emit an item.
	 */
	export function race<T>(...observables: Array<Observable<T> | Array<Observable<T>>>): Observable<T>;
	/**
	 * Returns an Observable that mirrors the first source Observable to emit an item.
	 * @param {...Observables} ...observables sources used to race for which Observable emits first.
	 * @returns {Observable} an Observable that mirrors the output of the first Observable to emit an item.
	 */
	export function raceStatic<T>(...observables: Array<Observable<T> | Array<Observable<T>>>): Observable<T>;
	export class RaceOperator<T> implements Operator<T, T> {
	    call(subscriber: Subscriber<T>): Subscriber<T>;
	}
	export class RaceSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private hasFirst;
	    private observables;
	    private subscriptions;
	    constructor(destination: Subscriber<T>);
	    protected _next(observable: any): void;
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	}

}
declare module 'rxjs/observable/RangeObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscription } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	export class RangeObservable extends Observable<number> {
	    static create(start?: number, end?: number, scheduler?: Scheduler): Observable<number>;
	    static dispatch(state: any): void;
	    private start;
	    private end;
	    private scheduler;
	    constructor(start: number, end: number, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<number>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/NeverObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class NeverObservable<T> extends Observable<T> {
	    static create<T>(): NeverObservable<T>;
	    constructor();
	    protected _subscribe(subscriber: Subscriber<T>): void;
	}

}
declare module 'rxjs/observable/ErrorObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscription } from 'rxjs/Subscription';
	export class ErrorObservable extends Observable<any> {
	    error: any;
	    private scheduler;
	    static create<T>(error: any, scheduler?: Scheduler): ErrorObservable;
	    static dispatch({error, subscriber}: {
	        error: any;
	        subscriber: any;
	    }): void;
	    constructor(error: any, scheduler?: Scheduler);
	    protected _subscribe(subscriber: any): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/dom/AjaxObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export interface AjaxRequest {
	    url?: string;
	    body?: any;
	    user?: string;
	    async?: boolean;
	    method: string;
	    headers?: Object;
	    timeout?: number;
	    password?: string;
	    hasContent?: boolean;
	    crossDomain?: boolean;
	    createXHR?: () => XMLHttpRequest;
	    progressSubscriber?: Subscriber<any>;
	    resultSelector?: <T>(response: AjaxResponse) => T;
	    responseType?: string;
	}
	export interface AjaxCreationMethod {
	    (): <T>(urlOrRequest: string | AjaxRequest) => Observable<T>;
	    get: <T>(url: string, resultSelector?: (response: AjaxResponse) => T, headers?: Object) => Observable<T>;
	    post: <T>(url: string, body?: any, headers?: Object) => Observable<T>;
	    put: <T>(url: string, body?: any, headers?: Object) => Observable<T>;
	    delete: <T>(url: string, headers?: Object) => Observable<T>;
	    getJSON: <T, R>(url: string, resultSelector?: (data: T) => R, headers?: Object) => Observable<R>;
	}
	export function ajaxGet<T>(url: string, resultSelector?: (response: AjaxResponse) => T, headers?: Object): AjaxObservable<T>;
	export function ajaxPost<T>(url: string, body?: any, headers?: Object): Observable<T>;
	export function ajaxDelete<T>(url: string, headers?: Object): Observable<T>;
	export function ajaxPut<T>(url: string, body?: any, headers?: Object): Observable<T>;
	export function ajaxGetJSON<T, R>(url: string, resultSelector?: (data: T) => R, headers?: Object): Observable<R>;
	/**
	 * Creates an observable for an Ajax request with either a request object with url, headers, etc or a string for a URL.
	 *
	 * @example
	 *   source = Rx.Observable.ajax('/products');
	 *   source = Rx.Observable.ajax( url: 'products', method: 'GET' });
	 *
	 * @param {Object} request Can be one of the following:
	 *
	 *  A string of the URL to make the Ajax call.
	 *  An object with the following properties
	 *   - url: URL of the request
	 *   - body: The body of the request
	 *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
	 *   - async: Whether the request is async
	 *   - headers: Optional headers
	 *   - crossDomain: true if a cross domain request, else false
	 *   - createXHR: a function to override if you need to use an alternate XMLHttpRequest implementation.
	 *   - resultSelector: a function to use to alter the output value type of the Observable. Gets {AjaxResponse} as an argument
	 * @returns {Observable} An observable sequence containing the XMLHttpRequest.
	*/
	export class AjaxObservable<T> extends Observable<T> {
	    static create: AjaxCreationMethod;
	    private request;
	    constructor(urlOrRequest: string | AjaxRequest);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}
	export class AjaxSubscriber<T> extends Subscriber<Event> {
	    request: AjaxRequest;
	    private xhr;
	    private resultSelector;
	    private done;
	    constructor(destination: Subscriber<T>, request: AjaxRequest);
	    next(e: Event): void;
	    private send();
	    private serializeBody(body, contentType);
	    private setHeaders(xhr, headers);
	    private setupEvents(xhr, request);
	    unsubscribe(): void;
	}
	/** A normalized AJAX response */
	export class AjaxResponse {
	    originalEvent: Event;
	    xhr: XMLHttpRequest;
	    request: AjaxRequest;
	    /** {number} the HTTP status code */
	    status: number;
	    /** {string|ArrayBuffer|Document|object|any} the response data */
	    response: any;
	    /** {string} the raw responseText */
	    responseText: string;
	    /** {string} the responsType (e.g. 'json', 'arraybuffer', or 'xml') */
	    responseType: string;
	    constructor(originalEvent: Event, xhr: XMLHttpRequest, request: AjaxRequest);
	}
	/** A normalized AJAX error */
	export class AjaxError extends Error {
	    /** {XMLHttpRequest} the XHR instance associated with the error */
	    xhr: XMLHttpRequest;
	    /** {AjaxRequest} the AjaxRequest associated with the error */
	    request: AjaxRequest;
	    /** {number} the HTTP status code */
	    status: number;
	    constructor(message: string, xhr: XMLHttpRequest, request: AjaxRequest);
	}
	export class AjaxTimeoutError extends AjaxError {
	    constructor(xhr: XMLHttpRequest, request: AjaxRequest);
	}

}
declare module 'rxjs/observable/dom/WebSocketSubject' {
	import { Subject } from 'rxjs/Subject';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscription } from 'rxjs/Subscription';
	import { Observer } from 'rxjs/Observer';
	export interface WebSocketSubjectConfig {
	    url: string;
	    protocol?: string | Array<string>;
	    resultSelector?: <T>(e: MessageEvent) => T;
	    openObserver?: Observer<Event>;
	    closeObserver?: Observer<CloseEvent>;
	    closingObserver?: Observer<void>;
	    WebSocketCtor?: {
	        new (url: string, protocol?: string | Array<string>): WebSocket;
	    };
	}
	export class WebSocketSubject<T> extends Subject<T> {
	    url: string;
	    protocol: string | Array<string>;
	    socket: WebSocket;
	    openObserver: Observer<Event>;
	    closeObserver: Observer<CloseEvent>;
	    closingObserver: Observer<void>;
	    WebSocketCtor: {
	        new (url: string, protocol?: string | Array<string>): WebSocket;
	    };
	    resultSelector(e: MessageEvent): any;
	    static create<T>(urlConfigOrSource: string | WebSocketSubjectConfig): WebSocketSubject<T>;
	    constructor(urlConfigOrSource: string | WebSocketSubjectConfig | Observable<T>, destination?: Observer<T>);
	    lift<R>(operator: Operator<T, R>): WebSocketSubject<T>;
	    multiplex(subMsg: () => any, unsubMsg: () => any, messageFilter: (value: T) => boolean): Observable<{}>;
	    protected _unsubscribe(): void;
	    protected _subscribe(subscriber: Subscriber<T>): Subscription;
	}

}
declare module 'rxjs/operator/withLatestFrom' {
	import { Observable, ObservableInput } from 'rxjs/Observable';
	/**
	 * @param {Observable} observables the observables to get the latest values from.
	 * @param {Function} [project] optional projection function for merging values together. Receives all values in order
	 *  of observables passed. (e.g. `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not passed, arrays
	 *  will be returned.
	 * @description merges each value from an observable with the latest values from the other passed observables.
	 * All observables must emit at least one value before the resulting observable will emit
	 *
	 * #### example
	 * ```
	 * A.withLatestFrom(B, C)
	 *
	 *  A:     ----a-----------------b---------------c-----------|
	 *  B:     ---d----------------e--------------f---------|
	 *  C:     --x----------------y-------------z-------------|
	 * result: ---([a,d,x])---------([b,e,y])--------([c,f,z])---|
	 * ```
	 */
	export function withLatestFrom<T, R>(...args: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export interface WithLatestFromSignature<T> {
	    <R>(project: (v1: T) => R): Observable<R>;
	    <T2, R>(v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
	    <T2, T3, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
	    <T2, T3, T4, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
	    <T2, T3, T4, T5, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
	    <T2, T3, T4, T5, T6, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
	    <T2>(v2: ObservableInput<T2>): Observable<[T, T2]>;
	    <T2, T3>(v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	    <T2, T3, T4>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	    <T2, T3, T4, T5>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	    <T2, T3, T4, T5, T6>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	    <R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	    <R>(array: ObservableInput<any>[]): Observable<R>;
	    <R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
	}

}
declare module 'rxjs/operator/buffer' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Buffers the incoming observable values until the passed `closingNotifier`
	 * emits a value, at which point it emits the buffer on the returned observable
	 * and starts a new buffer internally, awaiting the next time `closingNotifier`
	 * emits.
	 *
	 * <img src="./img/buffer.png" width="100%">
	 *
	 * @param {Observable<any>} closingNotifier an Observable that signals the
	 * buffer to be emitted} from the returned observable.
	 * @returns {Observable<T[]>} an Observable of buffers, which are arrays of
	 * values.
	 */
	export function buffer<T>(closingNotifier: Observable<any>): Observable<T[]>;
	export interface BufferSignature<T> {
	    (closingNotifier: Observable<any>): Observable<T[]>;
	}

}
declare module 'rxjs/operator/bufferCount' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Buffers a number of values from the source observable by `bufferSize` then
	 * emits the buffer and clears it, and starts a new buffer each
	 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
	 * `null`, then new buffers are started immediately at the start of the source
	 * and when each buffer closes and is emitted.
	 *
	 * <img src="./img/bufferCount.png" width="100%">
	 *
	 * @param {number} bufferSize the maximum size of the buffer emitted.
	 * @param {number} [startBufferEvery] optional interval at which to start a new
	 * buffer. (e.g. if `startBufferEvery` is `2`, then a new buffer will be started
	 * on every other value from the source.) A new buffer is started at the
	 * beginning of the source by default.
	 * @returns {Observable<T[]>} an Observable of arrays of buffered values.
	 */
	export function bufferCount<T>(bufferSize: number, startBufferEvery?: number): Observable<T[]>;
	export interface BufferCountSignature<T> {
	    (bufferSize: number, startBufferEvery?: number): Observable<T[]>;
	}

}
declare module 'rxjs/operator/bufferTime' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	/**
	 * Buffers values from the source for a specific time period. Optionally allows
	 * new buffers to be set up at an interval.
	 *
	 * <img src="./img/bufferTime.png" width="100%">
	 *
	 * @param {number} bufferTimeSpan the amount of time to fill each buffer for
	 * before emitting them and clearing them.
	 * @param {number} [bufferCreationInterval] the interval at which to start new
	 * buffers.
	 * @param {Scheduler} [scheduler] (optional, defaults to `asap` scheduler) The
	 * scheduler on which to schedule the intervals that determine buffer
	 * boundaries.
	 * @returns {Observable<T[]>} an observable of arrays of buffered values.
	 */
	export function bufferTime<T>(bufferTimeSpan: number, bufferCreationInterval?: number, scheduler?: Scheduler): Observable<T[]>;
	export interface BufferTimeSignature<T> {
	    (bufferTimeSpan: number, bufferCreationInterval?: number, scheduler?: Scheduler): Observable<T[]>;
	}

}
declare module 'rxjs/operator/bufferToggle' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Buffers values from the source by opening the buffer via signals from an
	 * Observable provided to `openings`, and closing and sending the buffers when
	 * an Observable returned by the `closingSelector` emits.
	 *
	 * <img src="./img/bufferToggle.png" width="100%">
	 *
	 * @param {Observable<O>} openings An observable of notifications to start new
	 * buffers.
	 * @param {Function} closingSelector a function that takes the value emitted by
	 * the `openings` observable and returns an Observable, which, when it emits,
	 * signals that the associated buffer should be emitted and cleared.
	 * @returns {Observable<T[]>} an observable of arrays of buffered values.
	 */
	export function bufferToggle<T, O>(openings: Observable<O>, closingSelector: (value: O) => Observable<any>): Observable<T[]>;
	export interface BufferToggleSignature<T> {
	    <O>(openings: Observable<O>, closingSelector: (value: O) => Observable<any>): Observable<T[]>;
	}

}
declare module 'rxjs/operator/bufferWhen' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Opens a buffer immediately, then closes the buffer when the observable
	 * returned by calling `closingSelector` emits a value. It that immediately
	 * opens a new buffer and repeats the process.
	 *
	 * <img src="./img/bufferWhen.png" width="100%">
	 *
	 * @param {function} closingSelector a function that takes no arguments and
	 * returns an Observable that signals buffer closure.
	 * @returns {Observable<T[]>} an observable of arrays of buffered values.
	 */
	export function bufferWhen<T>(closingSelector: () => Observable<any>): Observable<T[]>;
	export interface BufferWhenSignature<T> {
	    (closingSelector: () => Observable<any>): Observable<T[]>;
	}

}
declare module 'rxjs/operator/window' {
	import { Observable } from 'rxjs/Observable';
	export function window<T>(closingNotifier: Observable<any>): Observable<Observable<T>>;
	export interface WindowSignature<T> {
	    (closingNotifier: Observable<any>): Observable<Observable<T>>;
	}

}
declare module 'rxjs/operator/windowCount' {
	import { Observable } from 'rxjs/Observable';
	export function windowCount<T>(windowSize: number, startWindowEvery?: number): Observable<Observable<T>>;
	export interface WindowCountSignature<T> {
	    (windowSize: number, startWindowEvery?: number): Observable<Observable<T>>;
	}

}
declare module 'rxjs/operator/windowTime' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	export function windowTime<T>(windowTimeSpan: number, windowCreationInterval?: number, scheduler?: Scheduler): Observable<Observable<T>>;
	export interface WindowTimeSignature<T> {
	    (windowTimeSpan: number, windowCreationInterval?: number, scheduler?: Scheduler): Observable<Observable<T>>;
	}

}
declare module 'rxjs/operator/windowToggle' {
	import { Observable } from 'rxjs/Observable';
	export function windowToggle<T, O>(openings: Observable<O>, closingSelector: (openValue: O) => Observable<any>): Observable<Observable<T>>;
	export interface WindowToggleSignature<T> {
	    <O>(openings: Observable<O>, closingSelector: (openValue: O) => Observable<any>): Observable<Observable<T>>;
	}

}
declare module 'rxjs/operator/windowWhen' {
	import { Observable } from 'rxjs/Observable';
	export function windowWhen<T>(closingSelector: () => Observable<any>): Observable<Observable<T>>;
	export interface WindowWhenSignature<T> {
	    (closingSelector: () => Observable<any>): Observable<Observable<T>>;
	}

}
declare module 'rxjs/Observable' {
	import { PartialObserver } from 'rxjs/Observer';
	import { Operator } from 'rxjs/Operator';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { CoreOperators } from 'rxjs/CoreOperators';
	import { GroupedObservable } from 'rxjs/operator/groupBy';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	import { Subject } from 'rxjs/Subject';
	import { Notification } from 'rxjs/Notification';
	import { combineLatestStatic } from 'rxjs/operator/combineLatest';
	import { concatStatic } from 'rxjs/operator/concat';
	import { mergeStatic } from 'rxjs/operator/merge';
	import { zipStatic } from 'rxjs/operator/zip';
	import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';
	import { BoundNodeCallbackObservable } from 'rxjs/observable/BoundNodeCallbackObservable';
	import { DeferObservable } from 'rxjs/observable/DeferObservable';
	import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
	import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
	import { FromObservable } from 'rxjs/observable/FromObservable';
	import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
	import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
	import { FromEventPatternObservable } from 'rxjs/observable/FromEventPatternObservable';
	import { PromiseObservable } from 'rxjs/observable/PromiseObservable';
	import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
	import { TimerObservable } from 'rxjs/observable/TimerObservable';
	import { raceStatic } from 'rxjs/operator/race';
	import { RangeObservable } from 'rxjs/observable/RangeObservable';
	import { NeverObservable } from 'rxjs/observable/NeverObservable';
	import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
	import { AjaxCreationMethod } from 'rxjs/observable/dom/AjaxObservable';
	import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
	import { CombineLatestSignature } from 'rxjs/operator/combineLatest';
	import { WithLatestFromSignature } from 'rxjs/operator/withLatestFrom';
	import { ZipSignature } from 'rxjs/operator/zip';
	import { BufferSignature } from 'rxjs/operator/buffer';
	import { BufferCountSignature } from 'rxjs/operator/bufferCount';
	import { BufferTimeSignature } from 'rxjs/operator/bufferTime';
	import { BufferToggleSignature } from 'rxjs/operator/bufferToggle';
	import { BufferWhenSignature } from 'rxjs/operator/bufferWhen';
	import { WindowSignature } from 'rxjs/operator/window';
	import { WindowCountSignature } from 'rxjs/operator/windowCount';
	import { WindowTimeSignature } from 'rxjs/operator/windowTime';
	import { WindowToggleSignature } from 'rxjs/operator/windowToggle';
	import { WindowWhenSignature } from 'rxjs/operator/windowWhen';
	export type ObservableOrPromise<T> = Observable<T> | Promise<T>;
	export type ArrayOrIterator<T> = Iterator<T> | ArrayLike<T>;
	export type ObservableInput<T> = ObservableOrPromise<T> | ArrayOrIterator<T>;
	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	export class Observable<T> implements CoreOperators<T> {
	    _isScalar: boolean;
	    protected source: Observable<any>;
	    protected operator: Operator<any, T>;
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is
	     * called when the Observable is initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or `complete` can be called to notify
	     * of a successful completion.
	     */
	    constructor(subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void);
	    /**
	     * @static
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @returns {Observable} a new cold observable
	     * @description creates a new cold Observable by calling the Observable constructor
	     */
	    static create: Function;
	    /**
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @returns {Observable} a new observable with the Operator applied
	     * @description creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     */
	    lift<R>(operator: Operator<T, R>): Observable<R>;
	    /**
	     * @method subscribe
	     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
	     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
	     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
	     *  the error will be thrown as unhandled
	     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
	     * @returns {Subscription} a subscription reference to the registered handlers
	     * @description registers handlers for handling emitted values, error and completions from the observable, and
	     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
	     */
	    subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscription;
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {any} [thisArg] a `this` context for the `next` handler function
	     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	     * @returns {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    forEach(next: (value: T) => void, thisArg: any, PromiseCtor?: typeof Promise): Promise<void>;
	    protected _subscribe(subscriber: Subscriber<any>): Subscription | Function | void;
	    static ajax: AjaxCreationMethod;
	    static bindCallback: typeof BoundCallbackObservable.create;
	    static bindNodeCallback: typeof BoundNodeCallbackObservable.create;
	    static combineLatest: typeof combineLatestStatic;
	    static concat: typeof concatStatic;
	    static defer: typeof DeferObservable.create;
	    static empty: typeof EmptyObservable.create;
	    static forkJoin: typeof ForkJoinObservable.create;
	    static from: typeof FromObservable.create;
	    static fromArray: typeof ArrayObservable.create;
	    static fromEvent: typeof FromEventObservable.create;
	    static fromEventPattern: typeof FromEventPatternObservable.create;
	    static fromPromise: typeof PromiseObservable.create;
	    static interval: typeof IntervalObservable.create;
	    static merge: typeof mergeStatic;
	    static never: typeof NeverObservable.create;
	    static of: typeof ArrayObservable.of;
	    static race: typeof raceStatic;
	    static range: typeof RangeObservable.create;
	    static throw: typeof ErrorObservable.create;
	    static timer: typeof TimerObservable.create;
	    static webSocket: typeof WebSocketSubject.create;
	    static zip: typeof zipStatic;
	    buffer: BufferSignature<T>;
	    bufferCount: BufferCountSignature<T>;
	    bufferTime: BufferTimeSignature<T>;
	    bufferToggle: BufferToggleSignature<T>;
	    bufferWhen: BufferWhenSignature<T>;
	    cache: (bufferSize?: number, windowTime?: number, scheduler?: Scheduler) => Observable<T>;
	    catch: (selector: (err: any, source: Observable<T>, caught: Observable<any>) => Observable<any>) => Observable<T>;
	    combineAll: <R>(project?: (...values: Array<any>) => R) => Observable<R>;
	    combineLatest: CombineLatestSignature<T>;
	    concat: <R>(...observables: (Observable<any> | Scheduler)[]) => Observable<R>;
	    concatAll: () => Observable<any>;
	    concatMap: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    concatMapTo: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    count: (predicate?: (value: T, index: number, source: Observable<T>) => boolean) => Observable<number>;
	    dematerialize: () => Observable<any>;
	    debounce: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    debounceTime: <R>(dueTime: number, scheduler?: Scheduler) => Observable<R>;
	    defaultIfEmpty: <R>(defaultValue?: T | R) => Observable<T> | Observable<R>;
	    delay: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    delayWhen: (delayDurationSelector: (value: T) => Observable<any>, subscriptionDelay?: Observable<any>) => Observable<T>;
	    distinctUntilChanged: (compare?: (x: T, y: T) => boolean) => Observable<T>;
	    do: (next?: (x: T) => void, error?: (e: any) => void, complete?: () => void) => Observable<T>;
	    expand: <R>(project: (x: T, ix: number) => Observable<R>, concurrent: number, scheduler: Scheduler) => Observable<R>;
	    filter: (predicate: (x: T) => boolean, ix?: number, thisArg?: any) => Observable<T>;
	    finally: (finallySelector: () => void) => Observable<T>;
	    first: <R>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: any) => Observable<T> | Observable<R>;
	    flatMap: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    flatMapTo: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    groupBy: <K, R>(keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (group: GroupedObservable<K, R>) => Observable<any>) => Observable<GroupedObservable<K, R>>;
	    ignoreElements: () => Observable<T>;
	    inspect: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    inspectTime: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    last: <R>(predicate?: (value: T, index: number) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: any) => Observable<T> | Observable<R>;
	    let: <T, R>(func: (selector: Observable<T>) => Observable<R>) => Observable<R>;
	    letBind: <T, R>(func: (selector: Observable<T>) => Observable<R>) => Observable<R>;
	    every: (predicate: (value: T, index: number) => boolean, thisArg?: any) => Observable<T>;
	    map: <R>(project: (x: T, ix?: number) => R, thisArg?: any) => Observable<R>;
	    mapTo: <R>(value: R) => Observable<R>;
	    materialize: () => Observable<Notification<T>>;
	    merge: (...observables: any[]) => Observable<any>;
	    mergeAll: (concurrent?: any) => Observable<any>;
	    mergeMap: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    mergeMapTo: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    multicast: (subjectOrSubjectFactory: Subject<T> | (() => Subject<T>)) => ConnectableObservable<T>;
	    observeOn: (scheduler: Scheduler, delay?: number) => Observable<T>;
	    partition: (predicate: (x: T) => boolean) => Observable<T>[];
	    pluck: (...properties: string[]) => Observable<any>;
	    publish: () => ConnectableObservable<T>;
	    publishBehavior: (value: any) => ConnectableObservable<T>;
	    publishReplay: (bufferSize?: number, windowTime?: number, scheduler?: Scheduler) => ConnectableObservable<T>;
	    publishLast: () => ConnectableObservable<T>;
	    race: (...observables: Array<Observable<T>>) => Observable<T>;
	    reduce: <R>(project: (acc: R, x: T) => R, seed?: R) => Observable<R>;
	    repeat: (count?: number) => Observable<T>;
	    retry: (count?: number) => Observable<T>;
	    retryWhen: (notifier: (errors: Observable<any>) => Observable<any>) => Observable<T>;
	    sample: (notifier: Observable<any>) => Observable<T>;
	    sampleTime: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    scan: <R>(accumulator: (acc: R, x: T) => R, seed?: T | R) => Observable<R>;
	    share: () => Observable<T>;
	    single: (predicate?: (value: T, index: number) => boolean) => Observable<T>;
	    skip: (count: number) => Observable<T>;
	    skipUntil: (notifier: Observable<any>) => Observable<T>;
	    skipWhile: (predicate: (x: T, index: number) => boolean) => Observable<T>;
	    startWith: (x: T) => Observable<T>;
	    subscribeOn: (scheduler: Scheduler, delay?: number) => Observable<T>;
	    switch: <R>() => Observable<R>;
	    switchMap: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    switchMapTo: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    take: (count: number) => Observable<T>;
	    takeLast: (count: number) => Observable<T>;
	    takeUntil: (notifier: Observable<any>) => Observable<T>;
	    takeWhile: (predicate: (value: T, index: number) => boolean) => Observable<T>;
	    throttle: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    throttleTime: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    timeout: (due: number | Date, errorToSend?: any, scheduler?: Scheduler) => Observable<T>;
	    timeoutWith: <R>(due: number | Date, withObservable: Observable<R>, scheduler?: Scheduler) => Observable<T> | Observable<R>;
	    toArray: () => Observable<T[]>;
	    toPromise: (PromiseCtor?: typeof Promise) => Promise<T>;
	    window: WindowSignature<T>;
	    windowCount: WindowCountSignature<T>;
	    windowTime: WindowTimeSignature<T>;
	    windowToggle: WindowToggleSignature<T>;
	    windowWhen: WindowWhenSignature<T>;
	    withLatestFrom: WithLatestFromSignature<T>;
	    zip: ZipSignature<T>;
	    zipAll: <R>(project?: (...values: Array<any>) => R) => Observable<R>;
	}

}
declare module 'rxjs/CoreOperators' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	import { Subject } from 'rxjs/Subject';
	import { GroupedObservable } from 'rxjs/operator/groupBy';
	import { Notification } from 'rxjs/Notification';
	import { CombineLatestSignature } from 'rxjs/operator/combineLatest';
	import { WithLatestFromSignature } from 'rxjs/operator/withLatestFrom';
	import { ZipSignature } from 'rxjs/operator/zip';
	import { BufferSignature } from 'rxjs/operator/buffer';
	import { BufferCountSignature } from 'rxjs/operator/bufferCount';
	import { BufferTimeSignature } from 'rxjs/operator/bufferTime';
	import { BufferToggleSignature } from 'rxjs/operator/bufferToggle';
	import { BufferWhenSignature } from 'rxjs/operator/bufferWhen';
	import { WindowSignature } from 'rxjs/operator/window';
	import { WindowCountSignature } from 'rxjs/operator/windowCount';
	import { WindowTimeSignature } from 'rxjs/operator/windowTime';
	import { WindowToggleSignature } from 'rxjs/operator/windowToggle';
	import { WindowWhenSignature } from 'rxjs/operator/windowWhen';
	export interface CoreOperators<T> {
	    buffer: BufferSignature<T>;
	    bufferCount: BufferCountSignature<T>;
	    bufferTime: BufferTimeSignature<T>;
	    bufferToggle: BufferToggleSignature<T>;
	    bufferWhen: BufferWhenSignature<T>;
	    catch?: (selector: (err: any, source: Observable<T>, caught: Observable<any>) => Observable<any>) => Observable<T>;
	    combineAll?: <R>(project?: (...values: Array<any>) => R) => Observable<R>;
	    combineLatest: CombineLatestSignature<T>;
	    concat?: <R>(...observables: (Observable<any> | Scheduler)[]) => Observable<R>;
	    concatAll?: () => Observable<T>;
	    concatMap?: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    concatMapTo?: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    count?: (predicate?: (value: T, index: number, source: Observable<T>) => boolean) => Observable<number>;
	    dematerialize?: () => Observable<any>;
	    debounce?: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    debounceTime?: <R>(dueTime: number, scheduler?: Scheduler) => Observable<R>;
	    defaultIfEmpty?: <R>(defaultValue?: T | R) => Observable<T> | Observable<R>;
	    delay?: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    delayWhen?: (delayDurationSelector: (value: T) => Observable<any>, subscriptionDelay?: Observable<any>) => Observable<T>;
	    distinctUntilChanged?: (compare?: (x: T, y: T) => boolean) => Observable<T>;
	    do?: (next?: (x: T) => void, error?: (e: any) => void, complete?: () => void) => Observable<T>;
	    expand?: <R>(project: (x: T, ix: number) => Observable<R>, concurrent: number, scheduler: Scheduler) => Observable<R>;
	    filter?: (predicate: (x: T) => boolean, ix?: number, thisArg?: any) => Observable<T>;
	    finally?: (finallySelector: () => void) => Observable<T>;
	    first?: <R>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: any) => Observable<T> | Observable<R>;
	    flatMap?: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    flatMapTo?: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    groupBy?: <K, R>(keySelector: (value: T) => string, elementSelector?: (value: T) => R, durationSelector?: (group: GroupedObservable<K, R>) => Observable<any>) => Observable<GroupedObservable<K, R>>;
	    ignoreElements?: () => Observable<T>;
	    inspect?: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    inspectTime?: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    last?: <R>(predicate?: (value: T, index: number) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: any) => Observable<T> | Observable<R>;
	    every?: (predicate: (value: T, index: number) => boolean, thisArg?: any) => Observable<T>;
	    map?: <R>(project: (x: T, ix?: number) => R, thisArg?: any) => Observable<R>;
	    mapTo?: <R>(value: R) => Observable<R>;
	    materialize?: () => Observable<Notification<T>>;
	    merge?: (...observables: any[]) => Observable<any>;
	    mergeAll?: (concurrent?: number) => Observable<T>;
	    mergeMap?: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    mergeMapTo?: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R, concurrent?: number) => Observable<R>;
	    multicast?: (subjectOrSubjectFactory: Subject<T> | (() => Subject<T>)) => ConnectableObservable<T>;
	    observeOn?: (scheduler: Scheduler, delay?: number) => Observable<T>;
	    partition?: (predicate: (x: T) => boolean) => Observable<T>[];
	    publish?: () => ConnectableObservable<T>;
	    publishBehavior?: (value: any) => ConnectableObservable<T>;
	    publishReplay?: (bufferSize?: number, windowTime?: number, scheduler?: Scheduler) => ConnectableObservable<T>;
	    publishLast?: () => ConnectableObservable<T>;
	    reduce?: <R>(project: (acc: R, x: T) => R, seed?: R) => Observable<R>;
	    repeat?: (count?: number) => Observable<T>;
	    retry?: (count?: number) => Observable<T>;
	    retryWhen?: (notifier: (errors: Observable<any>) => Observable<any>) => Observable<T>;
	    sample?: (notifier: Observable<any>) => Observable<T>;
	    sampleTime?: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    scan?: <R>(project: (acc: R, x: T) => R, acc?: R) => Observable<R>;
	    share?: () => Observable<T>;
	    single?: (predicate?: (value: T, index: number) => boolean) => Observable<T>;
	    skip?: (count: number) => Observable<T>;
	    skipUntil?: (notifier: Observable<any>) => Observable<T>;
	    skipWhile?: (predicate: (x: T, index: number) => boolean) => Observable<T>;
	    startWith?: (x: T) => Observable<T>;
	    subscribeOn?: (scheduler: Scheduler, delay?: number) => Observable<T>;
	    switch?: () => Observable<T>;
	    switchMap?: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    switchMapTo?: <R>(observable: Observable<any>, projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	    take?: (count: number) => Observable<T>;
	    takeLast?: (count: number) => Observable<T>;
	    takeUntil?: (notifier: Observable<any>) => Observable<T>;
	    takeWhile?: (predicate: (value: T, index: number) => boolean) => Observable<T>;
	    throttle?: (durationSelector: (value: T) => Observable<any> | Promise<any>) => Observable<T>;
	    throttleTime?: (delay: number, scheduler?: Scheduler) => Observable<T>;
	    timeout?: (due: number | Date, errorToSend?: any, scheduler?: Scheduler) => Observable<T>;
	    timeoutWith?: <R>(due: number | Date, withObservable: Observable<R>, scheduler?: Scheduler) => Observable<T> | Observable<R>;
	    toArray?: () => Observable<T[]>;
	    toPromise?: (PromiseCtor: typeof Promise) => Promise<T>;
	    window: WindowSignature<T>;
	    windowCount: WindowCountSignature<T>;
	    windowTime: WindowTimeSignature<T>;
	    windowToggle: WindowToggleSignature<T>;
	    windowWhen: WindowWhenSignature<T>;
	    withLatestFrom: WithLatestFromSignature<T>;
	    zip: ZipSignature<T>;
	    zipAll?: <R>(project?: (...values: Array<any>) => R) => Observable<R>;
	}

}
declare module 'rxjs/subject/ReplaySubject' {
	import { Subject } from 'rxjs/Subject';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class ReplaySubject<T> extends Subject<T> {
	    private events;
	    private scheduler;
	    private bufferSize;
	    private _windowTime;
	    constructor(bufferSize?: number, windowTime?: number, scheduler?: Scheduler);
	    protected _next(value: T): void;
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	    private _getNow();
	    private _trimBufferThenGetEvents(now);
	}

}
declare module 'rxjs/subject/BehaviorSubject' {
	import { Subject } from 'rxjs/Subject';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class BehaviorSubject<T> extends Subject<T> {
	    private _value;
	    constructor(_value: T);
	    getValue(): T;
	    value: T;
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	    protected _next(value: T): void;
	    protected _error(err: any): void;
	}

}
declare module 'rxjs/util/EmptyError' {
	export class EmptyError extends Error {
	    constructor();
	}

}
declare module 'rxjs/util/ArgumentOutOfRangeError' {
	export class ArgumentOutOfRangeError extends Error {
	    constructor();
	}

}
declare module 'rxjs/util/ObjectUnsubscribedError' {
	/**
	 * an error thrown when an action is invalid because the object
	 * has been unsubscribed
	 */
	export class ObjectUnsubscribedError extends Error {
	    constructor();
	}

}
declare module 'rxjs/scheduler/FutureAction' {
	import { Action } from 'rxjs/scheduler/Action';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscription } from 'rxjs/Subscription';
	export class FutureAction<T> extends Subscription implements Action {
	    scheduler: Scheduler;
	    work: (x?: any) => Subscription | void;
	    id: any;
	    state: any;
	    delay: number;
	    constructor(scheduler: Scheduler, work: (x?: any) => Subscription | void);
	    execute(): void;
	    schedule(state?: any, delay?: number): Action;
	    protected _schedule(state?: any, delay?: number): Action;
	    protected _unsubscribe(): void;
	}

}
declare module 'rxjs/scheduler/QueueAction' {
	import { Action } from 'rxjs/scheduler/Action';
	import { FutureAction } from 'rxjs/scheduler/FutureAction';
	export class QueueAction<T> extends FutureAction<T> {
	    protected _schedule(state?: any, delay?: number): Action;
	}

}
declare module 'rxjs/scheduler/QueueScheduler' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { QueueAction } from 'rxjs/scheduler/QueueAction';
	import { Subscription } from 'rxjs/Subscription';
	import { Action } from 'rxjs/scheduler/Action';
	export class QueueScheduler implements Scheduler {
	    active: boolean;
	    actions: QueueAction<any>[];
	    scheduledId: number;
	    now(): number;
	    flush(): void;
	    schedule<T>(work: (x?: any) => Subscription | void, delay?: number, state?: any): Subscription;
	    scheduleNow<T>(work: (x?: any) => Subscription | void, state?: any): Action;
	    scheduleLater<T>(work: (x?: any) => Subscription | void, delay: number, state?: any): Action;
	}

}
declare module 'rxjs/scheduler/AsapScheduler' {
	import { Action } from 'rxjs/scheduler/Action';
	import { Subscription } from 'rxjs/Subscription';
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
	export class AsapScheduler extends QueueScheduler {
	    scheduleNow<T>(work: (x?: any) => Subscription, state?: any): Action;
	}

}
declare module 'rxjs/scheduler/AnimationFrameScheduler' {
	import { Action } from 'rxjs/scheduler/Action';
	import { Subscription } from 'rxjs/Subscription';
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
	export class AnimationFrameScheduler extends QueueScheduler {
	    scheduleNow<T>(work: (x?: any) => Subscription, state?: any): Action;
	}

}
declare module 'rxjs/Rx.DOM' {
	import { Subject } from 'rxjs/Subject';
	import { Observable } from 'rxjs/Observable';
	import { Subscription, UnsubscriptionError } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	import { AsyncSubject } from 'rxjs/subject/AsyncSubject';
	import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
	import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	import { Notification } from 'rxjs/Notification';
	import { EmptyError } from 'rxjs/util/EmptyError';
	import { ArgumentOutOfRangeError } from 'rxjs/util/ArgumentOutOfRangeError';
	import { ObjectUnsubscribedError } from 'rxjs/util/ObjectUnsubscribedError';
	import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
	import { AnimationFrameScheduler } from 'rxjs/scheduler/AnimationFrameScheduler';
	import { AjaxResponse, AjaxError, AjaxTimeoutError } from 'rxjs/observable/dom/AjaxObservable'; var Scheduler: {
	    asap: AsapScheduler;
	    queue: QueueScheduler;
	    animationFrame: AnimationFrameScheduler;
	}; var Symbol: {
	    rxSubscriber: any;
	};
	export { AjaxResponse, AjaxError, AjaxTimeoutError, Subject, Scheduler, Observable, Subscriber, Subscription, Symbol, AsyncSubject, ReplaySubject, BehaviorSubject, ConnectableObservable, Notification, EmptyError, ArgumentOutOfRangeError, ObjectUnsubscribedError, UnsubscriptionError };

}
declare module 'rxjs/operator/timeInterval' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	export function timeInterval<T>(scheduler?: Scheduler): Observable<TimeInterval<T>>;
	export class TimeInterval<T> {
	    value: T;
	    interval: number;
	    constructor(value: T, interval: number);
	}

}
declare module 'rxjs/scheduler/VirtualTimeScheduler' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscription } from 'rxjs/Subscription';
	import { Action } from 'rxjs/scheduler/Action';
	export class VirtualTimeScheduler implements Scheduler {
	    actions: Action[];
	    active: boolean;
	    scheduledId: number;
	    index: number;
	    sorted: boolean;
	    frame: number;
	    maxFrames: number;
	    protected static frameTimeFactor: number;
	    now(): number;
	    flush(): void;
	    addAction<T>(action: Action): void;
	    schedule<T>(work: (x?: any) => Subscription | void, delay?: number, state?: any): Subscription;
	}

}
declare module 'rxjs/testing/TestMessage' {
	import { Notification } from 'rxjs/Notification';
	export interface TestMessage {
	    frame: number;
	    notification: Notification<any>;
	}

}
declare module 'rxjs/testing/SubscriptionLog' {
	export class SubscriptionLog {
	    subscribedFrame: number;
	    unsubscribedFrame: number;
	    constructor(subscribedFrame: number, unsubscribedFrame?: number);
	}

}
declare module 'rxjs/testing/TestScheduler' {
	import { Observable } from 'rxjs/Observable';
	import { VirtualTimeScheduler } from 'rxjs/scheduler/VirtualTimeScheduler';
	import { Subject } from 'rxjs/Subject';
	import { TestMessage } from 'rxjs/testing/TestMessage';
	import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
	export type observableToBeFn = (marbles: string, values?: any, errorValue?: any) => void;
	export type subscriptionLogsToBeFn = (marbles: string | string[]) => void;
	export class TestScheduler extends VirtualTimeScheduler {
	    assertDeepEqual: (actual: any, expected: any) => boolean | void;
	    private hotObservables;
	    private coldObservables;
	    private flushTests;
	    constructor(assertDeepEqual: (actual: any, expected: any) => boolean | void);
	    createTime(marbles: string): number;
	    createColdObservable<T>(marbles: string, values?: any, error?: any): Observable<T>;
	    createHotObservable<T>(marbles: string, values?: any, error?: any): Subject<T>;
	    private materializeInnerObservable(observable, outerFrame);
	    expectObservable(observable: Observable<any>, unsubscriptionMarbles?: string): ({
	        toBe: observableToBeFn;
	    });
	    expectSubscriptions(actualSubscriptionLogs: SubscriptionLog[]): ({
	        toBe: subscriptionLogsToBeFn;
	    });
	    flush(): void;
	    static parseMarblesAsSubscriptions(marbles: string): SubscriptionLog;
	    static parseMarbles(marbles: string, values?: any, errorValue?: any, materializeInnerObservables?: boolean): TestMessage[];
	}

}
declare module 'rxjs/Rx.KitchenSink' {
	import { Subject } from 'rxjs/Subject';
	import { Observable } from 'rxjs/Observable';
	import { CoreOperators } from 'rxjs/CoreOperators';
	import { Scheduler as IScheduler } from 'rxjs/Scheduler';
	export interface KitchenSinkOperators<T> extends CoreOperators<T> {
	    isEmpty?: () => Observable<boolean>;
	    elementAt?: (index: number, defaultValue?: any) => Observable<T>;
	    distinct?: (compare?: (x: T, y: T) => boolean, flushes?: Observable<any>) => Observable<T>;
	    distinctKey?: (key: string, compare?: (x: T, y: T) => boolean, flushes?: Observable<any>) => Observable<T>;
	    distinctUntilKeyChanged?: (key: string, compare?: (x: any, y: any) => boolean) => Observable<T>;
	    find?: (predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any) => Observable<T>;
	    findIndex?: (predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any) => Observable<number>;
	    max?: <T, R>(comparer?: (x: R, y: T) => R) => Observable<R>;
	    min?: <T, R>(comparer?: (x: R, y: T) => R) => Observable<R>;
	    pairwise?: <R>() => Observable<R>;
	    timeInterval?: <T>(scheduler?: IScheduler) => Observable<T>;
	    mergeScan?: <T, R>(project: (acc: R, x: T) => Observable<R>, seed: R, concurrent?: number) => Observable<R>;
	    exhaust?: () => Observable<T>;
	    exhaustMap?: <R>(project: ((x: T, ix: number) => Observable<any>), projectResult?: (x: T, y: any, ix: number, iy: number) => R) => Observable<R>;
	}
	import { Observer } from 'rxjs/Observer';
	import { Subscription, UnsubscriptionError } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	import { AsyncSubject } from 'rxjs/subject/AsyncSubject';
	import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
	import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	import { Notification } from 'rxjs/Notification';
	import { EmptyError } from 'rxjs/util/EmptyError';
	import { ObjectUnsubscribedError } from 'rxjs/util/ObjectUnsubscribedError';
	import { ArgumentOutOfRangeError } from 'rxjs/util/ArgumentOutOfRangeError';
	import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
	import { TimeInterval } from 'rxjs/operator/timeInterval';
	import { TestScheduler } from 'rxjs/testing/TestScheduler';
	import { VirtualTimeScheduler } from 'rxjs/scheduler/VirtualTimeScheduler'; var Scheduler: {
	    asap: AsapScheduler;
	    queue: QueueScheduler;
	}; var Symbol: {
	    rxSubscriber: any;
	};
	export { Subject, Scheduler, Observable, Observer, Subscriber, Subscription, AsyncSubject, ReplaySubject, BehaviorSubject, ConnectableObservable, Notification, EmptyError, ArgumentOutOfRangeError, ObjectUnsubscribedError, UnsubscriptionError, TestScheduler, VirtualTimeScheduler, TimeInterval, Symbol };

}
declare module 'rxjs/Rx' {
	import { Subject } from 'rxjs/Subject';
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Observer } from 'rxjs/Observer';
	import { Subscription, UnsubscriptionError } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	import { AsyncSubject } from 'rxjs/subject/AsyncSubject';
	import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
	import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	import { Notification } from 'rxjs/Notification';
	import { EmptyError } from 'rxjs/util/EmptyError';
	import { ArgumentOutOfRangeError } from 'rxjs/util/ArgumentOutOfRangeError';
	import { ObjectUnsubscribedError } from 'rxjs/util/ObjectUnsubscribedError';
	import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler'; var Scheduler: {
	    asap: AsapScheduler;
	    queue: QueueScheduler;
	}; var Symbol: {
	    rxSubscriber: any;
	};
	export { Subject, Scheduler, Observable, Observer, Operator, Subscriber, Subscription, Symbol, AsyncSubject, ReplaySubject, BehaviorSubject, ConnectableObservable, Notification, EmptyError, ArgumentOutOfRangeError, ObjectUnsubscribedError, UnsubscriptionError };

}
declare module 'rxjs/add/observable/bindCallback' {
	export var _void: void;

}
declare module 'rxjs/add/observable/bindNodeCallback' {
	export var _void: void;

}
declare module 'rxjs/add/observable/combineLatest' {
	export var _void: void;

}
declare module 'rxjs/add/observable/concat' {
	export var _void: void;

}
declare module 'rxjs/add/observable/defer' {
	export var _void: void;

}
declare module 'rxjs/add/observable/empty' {
	export var _void: void;

}
declare module 'rxjs/add/observable/forkJoin' {
	export var _void: void;

}
declare module 'rxjs/add/observable/from' {
	export var _void: void;

}
declare module 'rxjs/add/observable/fromArray' {
	export var _void: void;

}
declare module 'rxjs/add/observable/fromEvent' {
	export var _void: void;

}
declare module 'rxjs/add/observable/fromEventPattern' {
	export var _void: void;

}
declare module 'rxjs/add/observable/fromPromise' {
	export var _void: void;

}
declare module 'rxjs/add/observable/interval' {
	export var _void: void;

}
declare module 'rxjs/add/observable/merge' {
	export var _void: void;

}
declare module 'rxjs/add/observable/never' {
	export var _void: void;

}
declare module 'rxjs/add/observable/of' {
	export var _void: void;

}
declare module 'rxjs/add/observable/race' {
	export var _void: void;

}
declare module 'rxjs/add/observable/range' {
	export var _void: void;

}
declare module 'rxjs/add/observable/throw' {
	export var _void: void;

}
declare module 'rxjs/add/observable/timer' {
	export var _void: void;

}
declare module 'rxjs/add/observable/zip' {
	export var _void: void;

}
declare module 'rxjs/add/observable/dom/ajax' {
	export var _void: void;

}
declare module 'rxjs/add/observable/dom/webSocket' {
	export var _void: void;

}
declare module 'rxjs/add/operator/buffer' {
	export var _void: void;

}
declare module 'rxjs/add/operator/bufferCount' {
	export var _void: void;

}
declare module 'rxjs/add/operator/bufferTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/bufferToggle' {
	export var _void: void;

}
declare module 'rxjs/add/operator/bufferWhen' {
	export var _void: void;

}
declare module 'rxjs/add/operator/cache' {
	export var _void: void;

}
declare module 'rxjs/add/operator/catch' {
	export var _void: void;

}
declare module 'rxjs/add/operator/combineAll' {
	export var _void: void;

}
declare module 'rxjs/add/operator/combineLatest' {
	export var _void: void;

}
declare module 'rxjs/add/operator/concat' {
	export var _void: void;

}
declare module 'rxjs/add/operator/concatAll' {
	export var _void: void;

}
declare module 'rxjs/add/operator/concatMap' {
	export var _void: void;

}
declare module 'rxjs/add/operator/concatMapTo' {
	export var _void: void;

}
declare module 'rxjs/add/operator/count' {
	export var _void: void;

}
declare module 'rxjs/add/operator/debounce' {
	export var _void: void;

}
declare module 'rxjs/add/operator/debounceTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/defaultIfEmpty' {
	export var _void: void;

}
declare module 'rxjs/add/operator/delay' {
	export var _void: void;

}
declare module 'rxjs/add/operator/delayWhen' {
	export var _void: void;

}
declare module 'rxjs/add/operator/dematerialize' {
	export var _void: void;

}
declare module 'rxjs/add/operator/distinct' {
	export var _void: void;

}
declare module 'rxjs/add/operator/distinctKey' {
	export var _void: void;

}
declare module 'rxjs/add/operator/distinctUntilChanged' {
	export var _void: void;

}
declare module 'rxjs/add/operator/distinctUntilKeyChanged' {
	export var _void: void;

}
declare module 'rxjs/add/operator/do' {
	export var _void: void;

}
declare module 'rxjs/add/operator/elementAt' {
	export var _void: void;

}
declare module 'rxjs/add/operator/every' {
	export var _void: void;

}
declare module 'rxjs/add/operator/exhaust' {
	export var _void: void;

}
declare module 'rxjs/add/operator/exhaustMap' {
	export var _void: void;

}
declare module 'rxjs/add/operator/expand' {
	export var _void: void;

}
declare module 'rxjs/add/operator/filter' {
	export var _void: void;

}
declare module 'rxjs/add/operator/finally' {
	export var _void: void;

}
declare module 'rxjs/add/operator/find' {
	export var _void: void;

}
declare module 'rxjs/add/operator/findIndex' {
	export var _void: void;

}
declare module 'rxjs/add/operator/first' {
	export var _void: void;

}
declare module 'rxjs/add/operator/groupBy' {
	export var _void: void;

}
declare module 'rxjs/add/operator/ignoreElements' {
	export var _void: void;

}
declare module 'rxjs/add/operator/inspect' {
	export var _void: void;

}
declare module 'rxjs/add/operator/inspectTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/isEmpty' {
	export var _void: void;

}
declare module 'rxjs/add/operator/last' {
	export var _void: void;

}
declare module 'rxjs/add/operator/let' {
	export var _void: void;

}
declare module 'rxjs/add/operator/map' {
	export var _void: void;

}
declare module 'rxjs/add/operator/mapTo' {
	export var _void: void;

}
declare module 'rxjs/add/operator/materialize' {
	export var _void: void;

}
declare module 'rxjs/add/operator/max' {
	export var _void: void;

}
declare module 'rxjs/add/operator/merge' {
	export var _void: void;

}
declare module 'rxjs/add/operator/mergeAll' {
	export var _void: void;

}
declare module 'rxjs/add/operator/mergeMap' {
	export var _void: void;

}
declare module 'rxjs/add/operator/mergeMapTo' {
	export var _void: void;

}
declare module 'rxjs/add/operator/mergeScan' {
	export var _void: void;

}
declare module 'rxjs/add/operator/min' {
	export var _void: void;

}
declare module 'rxjs/add/operator/multicast' {
	export var _void: void;

}
declare module 'rxjs/add/operator/observeOn' {
	export var _void: void;

}
declare module 'rxjs/add/operator/pairwise' {
	export var _void: void;

}
declare module 'rxjs/add/operator/partition' {
	export var _void: void;

}
declare module 'rxjs/add/operator/pluck' {
	export var _void: void;

}
declare module 'rxjs/add/operator/publish' {
	export var _void: void;

}
declare module 'rxjs/add/operator/publishBehavior' {
	export var _void: void;

}
declare module 'rxjs/add/operator/publishLast' {
	export var _void: void;

}
declare module 'rxjs/add/operator/publishReplay' {
	export var _void: void;

}
declare module 'rxjs/add/operator/race' {
	export var _void: void;

}
declare module 'rxjs/add/operator/reduce' {
	export var _void: void;

}
declare module 'rxjs/add/operator/repeat' {
	export var _void: void;

}
declare module 'rxjs/add/operator/retry' {
	export var _void: void;

}
declare module 'rxjs/add/operator/retryWhen' {
	export var _void: void;

}
declare module 'rxjs/add/operator/sample' {
	export var _void: void;

}
declare module 'rxjs/add/operator/sampleTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/scan' {
	export var _void: void;

}
declare module 'rxjs/add/operator/share' {
	export var _void: void;

}
declare module 'rxjs/add/operator/single' {
	export var _void: void;

}
declare module 'rxjs/add/operator/skip' {
	export var _void: void;

}
declare module 'rxjs/add/operator/skipUntil' {
	export var _void: void;

}
declare module 'rxjs/add/operator/skipWhile' {
	export var _void: void;

}
declare module 'rxjs/add/operator/startWith' {
	export var _void: void;

}
declare module 'rxjs/add/operator/subscribeOn' {
	export var _void: void;

}
declare module 'rxjs/add/operator/switch' {
	export var _void: void;

}
declare module 'rxjs/add/operator/switchMap' {
	export var _void: void;

}
declare module 'rxjs/add/operator/switchMapTo' {
	export var _void: void;

}
declare module 'rxjs/add/operator/take' {
	export var _void: void;

}
declare module 'rxjs/add/operator/takeLast' {
	export var _void: void;

}
declare module 'rxjs/add/operator/takeUntil' {
	export var _void: void;

}
declare module 'rxjs/add/operator/takeWhile' {
	export var _void: void;

}
declare module 'rxjs/add/operator/throttle' {
	export var _void: void;

}
declare module 'rxjs/add/operator/throttleTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/timeInterval' {
	export var _void: void;

}
declare module 'rxjs/add/operator/timeout' {
	export var _void: void;

}
declare module 'rxjs/add/operator/timeoutWith' {
	export var _void: void;

}
declare module 'rxjs/add/operator/toArray' {
	export var _void: void;

}
declare module 'rxjs/add/operator/toPromise' {
	export var _void: void;

}
declare module 'rxjs/add/operator/window' {
	export var _void: void;

}
declare module 'rxjs/add/operator/windowCount' {
	export var _void: void;

}
declare module 'rxjs/add/operator/windowTime' {
	export var _void: void;

}
declare module 'rxjs/add/operator/windowToggle' {
	export var _void: void;

}
declare module 'rxjs/add/operator/windowWhen' {
	export var _void: void;

}
declare module 'rxjs/add/operator/withLatestFrom' {
	export var _void: void;

}
declare module 'rxjs/add/operator/zip' {
	export var _void: void;

}
declare module 'rxjs/add/operator/zipAll' {
	export var _void: void;

}
declare module 'rxjs/observable/ArrayLikeObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class ArrayLikeObservable<T> extends Observable<T> {
	    private arrayLike;
	    private scheduler;
	    private mapFn;
	    static create<T>(arrayLike: ArrayLike<T>, mapFn: (x: any, y: number) => T, thisArg: any, scheduler?: Scheduler): Observable<T>;
	    static dispatch(state: any): void;
	    private value;
	    constructor(arrayLike: ArrayLike<T>, mapFn: (x: any, y: number) => T, thisArg: any, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/IteratorObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscription } from 'rxjs/Subscription';
	import { Subscriber } from 'rxjs/Subscriber';
	export class IteratorObservable<T> extends Observable<T> {
	    private iterator;
	    static create<T>(iterator: any, project?: ((x?: any, i?: number) => T) | any, thisArg?: any | Scheduler, scheduler?: Scheduler): IteratorObservable<{}>;
	    static dispatch(state: any): void;
	    private thisArg;
	    private project;
	    private scheduler;
	    constructor(iterator: any, project?: ((x?: any, i?: number) => T) | any, thisArg?: any | Scheduler, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/ScalarObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	export class ScalarObservable<T> extends Observable<T> {
	    value: T;
	    private scheduler;
	    static create<T>(value: T, scheduler?: Scheduler): ScalarObservable<T>;
	    static dispatch(state: any): void;
	    _isScalar: boolean;
	    constructor(value: T, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription | Function | void;
	}

}
declare module 'rxjs/observable/SubscribeOnObservable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { Observable } from 'rxjs/Observable';
	export class SubscribeOnObservable<T> extends Observable<T> {
	    source: Observable<T>;
	    private delayTime;
	    private scheduler;
	    static create<T>(source: Observable<T>, delay?: number, scheduler?: Scheduler): Observable<T>;
	    static dispatch<T>({source, subscriber}: {
	        source: any;
	        subscriber: any;
	    }): Subscription;
	    constructor(source: Observable<T>, delayTime?: number, scheduler?: Scheduler);
	    protected _subscribe(subscriber: Subscriber<T>): Subscription;
	}

}
declare module 'rxjs/operator/cache' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	export function cache<T>(bufferSize?: number, windowTime?: number, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/catch' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
	 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
	 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
	 *  is returned by the `selector` will be used to continue the observable chain.
	 * @return {Observable} an observable that originates from either the source or the observable returned by the
	 *  catch `selector` function.
	 */
	export function _catch<T, R>(selector: (err: any, caught: Observable<T>) => Observable<R>): Observable<R>;

}
declare module 'rxjs/operator/combineAll' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Takes an Observable of Observables, and collects all observables from it. Once the outer observable
	 * completes, it subscribes to all collected observables and "combines" their values, such that:
	 *  - every time an observable emits, the returned observable emits
	 *  - when the returned observable emits, it emits all of the most recent values by:
	 *    - if a `project` function is provided, it is called with each recent value from each observable in whatever order they arrived,
	 *      and the result of the `project` function is what is emitted by the returned observable
	 *    - if there is no `project` function, an array of all of the most recent values is emitted by the returned observable.
	 * @param {function} [project] an optional function to map the most recent values from each observable into a new result. Takes each of the
	 *   most recent values from each collected observable as arguments, in order.
	 * @returns {Observable} an observable of projected results or arrays of recent values.
	 */
	export function combineAll<T, R>(project?: (...values: Array<any>) => R): Observable<R>;

}
declare module 'rxjs/operator/concatAll' {
	/**
	 * Joins every Observable emitted by the source (an Observable of Observables), in a serial
	 * fashion. Subscribing to each one only when the previous one has completed, and merging
	 * all of their values into the returned observable.
	 *
	 * __Warning:__ If the source Observable emits Observables quickly and endlessly, and the
	 * Observables it emits generally complete slower than the source emits, you can run into
	 * memory issues as the incoming observables collect in an unbounded buffer.
	 *
	 * @returns {Observable} an observable of values merged from the incoming observables.
	 */
	export function concatAll<T>(): T;

}
declare module 'rxjs/operator/concatMap' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Maps values from the source observable into new Observables, then merges them in a serialized fashion,
	 * waiting for each one to complete before merging the next.
	 *
	 * __Warning:__ if incoming values arrive endlessly and faster than the observables they're being mapped
	 * to can complete, it will result in memory issues as created observables amass in an unbounded buffer
	 * waiting for their turn to be subscribed to.
	 *
	 * @param {function} project a function to map incoming values into Observables to be concatenated. accepts
	 * the `value` and the `index` as arguments.
	 * @param {function} [resultSelector] an optional result selector that is applied to values before they're
	 * merged into the returned observable. The arguments passed to this function are:
	 * - `outerValue`: the value that came from the source
	 * - `innerValue`: the value that came from the projected Observable
	 * - `outerIndex`: the "index" of the value that came from the source
	 * - `innerIndex`: the "index" of the value from the projected Observable
	 * @returns {Observable} an observable of values merged from the projected Observables as they were subscribed to,
	 * one at a time. Optionally, these values may have been projected from a passed `projectResult` argument.
	 */
	export function concatMap<T, R, R2>(project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2): any;

}
declare module 'rxjs/operator/concatMapTo' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Maps values from the source to a specific observable, and merges them together in a serialized fashion.
	 *
	 * @param {Observable} observable the observable to map each source value to
	 * @param {function} [resultSelector] an optional result selector that is applied to values before they're
	 * merged into the returned observable. The arguments passed to this function are:
	 * - `outerValue`: the value that came from the source
	 * - `innerValue`: the value that came from the projected Observable
	 * - `outerIndex`: the "index" of the value that came from the source
	 * - `innerIndex`: the "index" of the value from the projected Observable
	 * @returns {Observable} an observable of values merged together by joining the passed observable
	 * with itself, one after the other, for each value emitted from the source.
	 */
	export function concatMapTo<T, R, R2>(observable: Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2): Observable<R2>;

}
declare module 'rxjs/operator/count' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an observable of a single number that represents the number of items that either:
	 * Match a provided predicate function, _or_ if a predicate is not provided, the number
	 * represents the total count of all items in the source observable. The count is emitted
	 * by the returned observable when the source observable completes.
	 * @param {function} [predicate] a boolean function to select what values are to be counted.
	 * it is provided with arguments of:
	 *   - `value`: the value from the source observable
	 *   - `index`: the "index" of the value from the source observable
	 *   - `source`: the source observable instance itself.
	 * @returns {Observable} an observable of one number that represents the count as described
	 * above
	 */
	export function count<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<number>;

}
declare module 'rxjs/operator/debounce' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns the source Observable delayed by the computed debounce duration,
	 * with the duration lengthened if a new source item arrives before the delay
	 * duration ends.
	 * In practice, for each item emitted on the source, this operator holds the
	 * latest item, waits for a silence as long as the `durationSelector` specifies,
	 * and only then emits the latest source item on the result Observable.
	 * @param {function} durationSelector function for computing the timeout duration for each item.
	 * @returns {Observable} an Observable the same as source Observable, but drops items.
	 */
	export function debounce<T>(durationSelector: (value: T) => Observable<number> | Promise<number>): Observable<T>;

}
declare module 'rxjs/operator/debounceTime' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	/**
	 * Returns the source Observable delayed by the computed debounce duration,
	 * with the duration lengthened if a new source item arrives before the delay
	 * duration ends.
	 * In practice, for each item emitted on the source, this operator holds the
	 * latest item, waits for a silence for the `dueTime` length, and only then
	 * emits the latest source item on the result Observable.
	 * Optionally takes a scheduler for manging timers.
	 * @param {number} dueTime the timeout value for the window of time required to not drop the item.
	 * @param {Scheduler} [scheduler] the Scheduler to use for managing the timers that handle the timeout for each item.
	 * @returns {Observable} an Observable the same as source Observable, but drops items.
	 */
	export function debounceTime<T>(dueTime: number, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/defaultIfEmpty' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the elements of the source or a specified default value if empty.
	 * @param {any} defaultValue the default value used if source is empty; defaults to null.
	 * @returns {Observable} an Observable of the items emitted by the where empty values are replaced by the specified default value or null.
	 */
	export function defaultIfEmpty<T, R>(defaultValue?: R): Observable<T | R>;

}
declare module 'rxjs/operator/delay' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that delays the emission of items from the source Observable
	 * by a given timeout or until a given Date.
	 * @param {number|Date} delay the timeout value or date until which the emission of the source items is delayed.
	 * @param {Scheduler} [scheduler] the Scheduler to use for managing the timers that handle the timeout for each item.
	 * @returns {Observable} an Observable that delays the emissions of the source Observable by the specified timeout or Date.
	 */
	export function delay<T>(delay: number | Date, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/delayWhen' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that delays the emission of items from the source Observable
	 * by a subscription delay and a delay selector function for each element.
	 * @param {Function} selector function to retrieve a sequence indicating the delay for each given element.
	 * @param {Observable} sequence indicating the delay for the subscription to the source.
	 * @returns {Observable} an Observable that delays the emissions of the source Observable by the specified timeout or Date.
	 */
	export function delayWhen<T>(delayDurationSelector: (value: T) => Observable<any>, subscriptionDelay?: Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/dematerialize' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that transforms Notification objects into the items or notifications they represent.
	 * @returns {Observable} an Observable that emits items and notifications embedded in Notification objects emitted by the source Observable.
	 */
	export function dematerialize<T>(): Observable<any>;

}
declare module 'rxjs/operator/distinct' {
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
	 * An optional paramter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
	 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
	 * @returns {Observable} an Observable that emits items from the source Observable with distinct values.
	 */
	export function distinct<T>(compare?: (x: T, y: T) => boolean, flushes?: Observable<any>): Observable<T>;
	export class DistinctSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private values;
	    constructor(destination: Subscriber<T>, compare: (x: T, y: T) => boolean, flushes: Observable<any>);
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    notifyError(error: any, innerSub: InnerSubscriber<T, R>): void;
	    protected _next(value: T): void;
	    private compare(x, y);
	}

}
declare module 'rxjs/operator/distinctKey' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items,
	 * using a property accessed by using the key provided to check if the two items are distinct.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
	 * An optional paramter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
	 * @param {string} key string key for object property lookup on each item.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
	 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
	 * @returns {Observable} an Observable that emits items from the source Observable with distinct values.
	 */
	export function distinctKey<T>(key: string, compare?: (x: T, y: T) => boolean, flushes?: Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/distinctUntilChanged' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
	 * @returns {Observable} an Observable that emits items from the source Observable with distinct values.
	 */
	export function distinctUntilChanged<T>(compare?: (x: T, y: T) => boolean): Observable<T>;
	export function distinctUntilChanged<T, K>(compare: (x: K, y: K) => boolean, keySelector?: (x: T) => K): Observable<T>;

}
declare module 'rxjs/operator/distinctUntilKeyChanged' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item,
	 * using a property accessed by using the key provided to check if the two items are distinct.
	 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
	 * If a comparator function is not provided, an equality check is used by default.
	 * @param {string} key string key for object property lookup on each item.
	 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
	 * @returns {Observable} an Observable that emits items from the source Observable with distinct values based on the key specified.
	 */
	export function distinctUntilKeyChanged<T>(key: string, compare?: (x: T, y: T) => boolean): Observable<T>;

}
declare module 'rxjs/operator/do' {
	import { Observer } from 'rxjs/Observer';
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns a mirrored Observable of the source Observable, but modified so that the provided Observer is called
	 * for every item emitted by the source.
	 * This operator is useful for debugging your observables for the correct values or performing other side effects.
	 * @param {Observer|function} [nextOrObserver] a normal observer callback or callback for onNext.
	 * @param {function} [error] callback for errors in the source.
	 * @param {function} [complete] callback for the completion of the source.
	 * @reurns {Observable} a mirrored Observable with the specified Observer or callback attached for each item.
	 */
	export function _do<T>(nextOrObserver?: Observer<T> | ((x: T) => void), error?: (e: any) => void, complete?: () => void): Observable<T>;

}
declare module 'rxjs/operator/elementAt' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the item at the specified index in the source Observable.
	 * If default is given, missing indices will output this value on next; otherwise, outputs error.
	 * @param {number} index the index of the value to be retrieved.
	 * @param {any} [defaultValue] the default value returned for missing indices.
	 * @returns {Observable} an Observable that emits a single item, if it is found. Otherwise, will emit the default value if given.
	 */
	export function elementAt<T>(index: number, defaultValue?: T): Observable<T>;

}
declare module 'rxjs/operator/every' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
	 * @param {function} predicate a function for determining if an item meets a specified condition.
	 * @param {any} [thisArg] optional object to use for `this` in the callback
	 * @returns {Observable} an Observable of booleans that determines if all items of the source Observable meet the condition specified.
	 */
	export function every<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<boolean>;

}
declare module 'rxjs/operator/exhaust' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that takes a source of observables and propagates the first observable exclusively
	 * until it completes before subscribing to the next.
	 * Items that come in before the first has exhausted will be dropped.
	 * Similar to `concatAll`, but will not hold on to items that come in before the first is exhausted.
	 * @returns {Observable} an Observable which contains all of the items of the first Observable and following Observables in the source.
	 */
	export function exhaust<T>(): Observable<T>;

}
declare module 'rxjs/operator/exhaustMap' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that applies the given function to each item of the source Observable
	 * to create a new Observable, which are then concatenated together to produce a new Observable.
	 * @param {function} project function called for each item of the source to produce a new Observable.
	 * @param {function} [resultSelector] optional function for then selecting on each inner Observable.
	 * @returns {Observable} an Observable containing all the projected Observables of each item of the source concatenated together.
	 */
	export function exhaustMap<T, R, R2>(project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2): Observable<R2>;

}
declare module 'rxjs/operator/expand' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	/**
	 * Returns an Observable where for each item in the source Observable, the supplied function is applied to each item,
	 * resulting in a new value to then be applied again with the function.
	 * @param {function} project the function for projecting the next emitted item of the Observable.
	 * @param {number} [concurrent] the max number of observables that can be created concurrently. defaults to infinity.
	 * @param {Scheduler} [scheduler] The Scheduler to use for managing the expansions.
	 * @returns {Observable} an Observable containing the expansions of the source Observable.
	 */
	export function expand<T, R>(project: (value: T, index: number) => Observable<R>, concurrent?: number, scheduler?: Scheduler): Observable<R>;
	export class ExpandOperator<T, R> implements Operator<T, R> {
	    private project;
	    private concurrent;
	    private scheduler;
	    constructor(project: (value: T, index: number) => Observable<R>, concurrent: number, scheduler: Scheduler);
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}
	export class ExpandSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private project;
	    private concurrent;
	    private scheduler;
	    private index;
	    private active;
	    private hasCompleted;
	    private buffer;
	    constructor(destination: Subscriber<R>, project: (value: T, index: number) => Observable<R>, concurrent: number, scheduler: Scheduler);
	    private static dispatch({subscriber, result, value, index});
	    protected _next(value: any): void;
	    private subscribeToProjection(result, value, index);
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    notifyComplete(innerSub: Subscription): void;
	}

}
declare module 'rxjs/operator/filter' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Similar to the well-known `Array.prototype.filter` method, this operator filters values down to a set
	 * allowed by a `select` function
	 *
	 * @param {Function} select a function that is used to select the resulting values
	 *  if it returns `true`, the value is emitted, if `false` the value is not passed to the resulting observable
	 * @param {any} [thisArg] an optional argument to determine the value of `this` in the `select` function
	 * @returns {Observable} an observable of values allowed by the select function
	 */
	export function filter<T>(select: (value: T, index: number) => boolean, thisArg?: any): Observable<T>;

}
declare module 'rxjs/operator/finally' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that mirrors the source Observable, but will call a specified function when
	 * the source terminates on complete or error.
	 * @param {function} finallySelector function to be called when source terminates.
	 * @returns {Observable} an Observable that mirrors the source, but will call the specified function on termination.
	 */
	export function _finally<T>(finallySelector: () => void): Observable<T>;

}
declare module 'rxjs/operator/find' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	/**
	 * Returns an Observable that searches for the first item in the source Observable that
	 * matches the specified condition, and returns the first occurence in the source.
	 * @param {function} predicate function called with each item to test for condition matching.
	 * @returns {Observable} an Observable of the first item that matches the condition.
	 */
	export function find<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<T>;
	export class FindValueOperator<T> implements Operator<T, T> {
	    private predicate;
	    private source;
	    private yieldIndex;
	    private thisArg;
	    constructor(predicate: (value: T, index: number, source: Observable<T>) => boolean, source: Observable<T>, yieldIndex: boolean, thisArg?: any);
	    call(observer: Subscriber<T>): Subscriber<T>;
	}
	export class FindValueSubscriber<T> extends Subscriber<T> {
	    private predicate;
	    private source;
	    private yieldIndex;
	    private thisArg;
	    private index;
	    constructor(destination: Subscriber<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, source: Observable<T>, yieldIndex: boolean, thisArg?: any);
	    private notifyComplete(value);
	    protected _next(value: T): void;
	    protected _complete(): void;
	}

}
declare module 'rxjs/operator/findIndex' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that searches for the first item in the source Observable that
	 * matches the specified condition, and returns the the index of the item in the source.
	 * @param {function} predicate function called with each item to test for condition matching.
	 * @returns {Observable} an Observable of the index of the first item that matches the condition.
	 */
	export function findIndex<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<number>;

}
declare module 'rxjs/operator/first' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the first item of the source Observable that matches the specified condition.
	 * Throws an error if matching element is not found.
	 * @param {function} predicate function called with each item to test for condition matching.
	 * @returns {Observable} an Observable of the first item that matches the condition.
	 */
	export function first<T, R>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: R): Observable<T> | Observable<R>;

}
declare module 'rxjs/operator/ignoreElements' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
	 *
	 * <img src="./img/ignoreElements.png" width="100%">
	 *
	 * @returns {Observable} an empty Observable that only calls `complete`
	 * or `error`, based on which one is called by the source Observable.
	 */
	export function ignoreElements<T>(): Observable<T>;

}
declare module 'rxjs/operator/inspect' {
	import { Observable } from 'rxjs/Observable';
	export function inspect<T>(durationSelector: (value: T) => Observable<any> | Promise<any>): Observable<T>;

}
declare module 'rxjs/operator/inspectTime' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	export function inspectTime<T>(delay: number, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/isEmpty' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
	 *
	 * <img src="./img/isEmpty.png" width="100%">
	 *
	 * @returns {Observable} an Observable that emits a Boolean.
	 */
	export function isEmpty(): Observable<boolean>;

}
declare module 'rxjs/operator/last' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits only the last item emitted by the source Observable.
	 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
	 * the last item from the source Observable, the resulting Observable will emit the last item
	 * from the source Observable that satisfies the predicate.
	 *
	 * <img src="./img/last.png" width="100%">
	 *
	 * @param {function} predicate - the condition any source emitted item has to satisfy.
	 * @returns {Observable} an Observable that emits only the last item satisfying the given condition
	 * from the source, or an NoSuchElementException if no such items are emitted.
	 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
	 */
	export function last<T, R>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: R): Observable<T> | Observable<R>;

}
declare module 'rxjs/operator/let' {
	import { Observable } from 'rxjs/Observable';
	export function letProto<T, R>(func: (selector: Observable<T>) => Observable<R>): Observable<R>;

}
declare module 'rxjs/operator/map' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Similar to the well known `Array.prototype.map` function, this operator
	 * applies a projection to each value and emits that projection in the returned observable
	 *
	 * <img src="./img/map.png" width="100%">
	 *
	 * @param {Function} project the function to create projection
	 * @param {any} [thisArg] an optional argument to define what `this` is in the project function
	 * @returns {Observable} a observable of projected values
	 */
	export function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): Observable<R>;

}
declare module 'rxjs/operator/mapTo' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Maps every value to the same value every time.
	 *
	 * <img src="./img/mapTo.png" width="100%">
	 *
	 * @param {any} value the value to map each incoming value to
	 * @returns {Observable} an observable of the passed value that emits everytime the source does
	 */
	export function mapTo<T, R>(value: R): Observable<R>;

}
declare module 'rxjs/operator/materialize' {
	import { Observable } from 'rxjs/Observable';
	import { Notification } from 'rxjs/Notification';
	/**
	 * Returns an Observable that represents all of the emissions and notifications
	 * from the source Observable into emissions marked with their original types
	 * within a `Notification` objects.
	 *
	 * <img src="./img/materialize.png" width="100%">
	 *
	 * @scheduler materialize does not operate by default on a particular Scheduler.
	 * @returns {Observable} an Observable that emits items that are the result of
	 * materializing the items and notifications of the source Observable.
	 */
	export function materialize<T>(): Observable<Notification<T>>;

}
declare module 'rxjs/operator/max' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * The Max operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
	 * and when source Observable completes it emits a single item: the item with the largest number.
	 *
	 * <img src="./img/max.png" width="100%">
	 *
	 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two
	 * items.
	 * @returns {Observable} an Observable that emits item with the largest number.
	 */
	export function max<T>(comparer?: (value1: T, value2: T) => T): Observable<T>;

}
declare module 'rxjs/operator/mergeAll' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Observer } from 'rxjs/Observer';
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	export function mergeAll<T>(concurrent?: number): T;
	export class MergeAllOperator<T> implements Operator<Observable<T>, T> {
	    private concurrent;
	    constructor(concurrent: number);
	    call(observer: Observer<T>): MergeAllSubscriber<T>;
	}
	export class MergeAllSubscriber<T> extends OuterSubscriber<Observable<T>, T> {
	    private concurrent;
	    private hasCompleted;
	    private buffer;
	    private active;
	    constructor(destination: Observer<T>, concurrent: number);
	    protected _next(observable: Observable<T>): void;
	    protected _complete(): void;
	    notifyComplete(innerSub: Subscription): void;
	}

}
declare module 'rxjs/operator/mergeMap' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	/**
	 * Returns an Observable that emits items based on applying a function that you supply to each item emitted by the
	 * source Observable, where that function returns an Observable, and then merging those resulting Observables and
	 * emitting the results of this merger.
	 *
	 * <img src="./img/mergeMap.png" width="100%">
	 *
	 * @param {Function} a function that, when applied to an item emitted by the source Observable, returns an Observable.
	 * @returns {Observable} an Observable that emits the result of applying the transformation function to each item
	 * emitted by the source Observable and merging the results of the Observables obtained from this transformation
	 */
	export function mergeMap<T, R, R2>(project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2 | number, concurrent?: number): Observable<R2>;
	export class MergeMapOperator<T, R, R2> implements Operator<T, R> {
	    private project;
	    private resultSelector;
	    private concurrent;
	    constructor(project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2, concurrent?: number);
	    call(observer: Subscriber<R>): Subscriber<T>;
	}
	export class MergeMapSubscriber<T, R, R2> extends OuterSubscriber<T, R> {
	    private project;
	    private resultSelector;
	    private concurrent;
	    private hasCompleted;
	    private buffer;
	    private active;
	    protected index: number;
	    constructor(destination: Subscriber<R>, project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2, concurrent?: number);
	    protected _next(value: any): void;
	    protected _tryNext(value: any): void;
	    private _innerSub(ish, value, index);
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    _notifyResultSelector(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number): void;
	    notifyComplete(innerSub: Subscription): void;
	}

}
declare module 'rxjs/operator/mergeMapTo' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	export function mergeMapTo<T, R, R2>(observable: Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2 | number, concurrent?: number): Observable<R2>;
	export class MergeMapToOperator<T, R, R2> implements Operator<Observable<T>, R2> {
	    private ish;
	    private resultSelector;
	    private concurrent;
	    constructor(ish: Observable<R> | Promise<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2, concurrent?: number);
	    call(observer: Subscriber<R2>): Subscriber<any>;
	}
	export class MergeMapToSubscriber<T, R, R2> extends OuterSubscriber<T, R> {
	    private ish;
	    private resultSelector;
	    private concurrent;
	    private hasCompleted;
	    private buffer;
	    private active;
	    protected index: number;
	    constructor(destination: Subscriber<R2>, ish: Observable<R> | Promise<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2, concurrent?: number);
	    protected _next(value: any): void;
	    private _innerSub(ish, destination, resultSelector, value, index);
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    private trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
	    notifyError(err: any): void;
	    notifyComplete(innerSub: Subscription): void;
	}

}
declare module 'rxjs/operator/mergeScan' {
	import { Operator } from 'rxjs/Operator';
	import { Observable } from 'rxjs/Observable';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	import { InnerSubscriber } from 'rxjs/InnerSubscriber';
	export function mergeScan<T, R>(project: (acc: R, value: T) => Observable<R>, seed: R, concurrent?: number): Observable<R>;
	export class MergeScanOperator<T, R> implements Operator<T, R> {
	    private project;
	    private seed;
	    private concurrent;
	    constructor(project: (acc: R, value: T) => Observable<R>, seed: R, concurrent: number);
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}
	export class MergeScanSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private project;
	    private acc;
	    private concurrent;
	    private hasValue;
	    private hasCompleted;
	    private buffer;
	    private active;
	    protected index: number;
	    constructor(destination: Subscriber<R>, project: (acc: R, value: T) => Observable<R>, acc: R, concurrent: number);
	    protected _next(value: any): void;
	    private _innerSub(ish, value, index);
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    notifyComplete(innerSub: Subscription): void;
	}

}
declare module 'rxjs/operator/min' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * The Min operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
	 * and when source Observable completes it emits a single item: the item with the smallest number.
	 *
	 * <img src="./img/min.png" width="100%">
	 *
	 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two items.
	 * @returns {Observable<R>} an Observable that emits item with the smallest number.
	 */
	export function min<T>(comparer?: (value1: T, value2: T) => T): Observable<T>;

}
declare module 'rxjs/operator/multicast' {
	import { Subject } from 'rxjs/Subject';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	/**
	 * Returns an Observable that emits the results of invoking a specified selector on items
	 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
	 *
	 * <img src="./img/multicast.png" width="100%">
	 *
	 * @param {Function} selector - a function that can use the multicasted source stream
	 * as many times as needed, without causing multiple subscriptions to the source stream.
	 * Subscribers to the given source will receive all notifications of the source from the
	 * time of the subscription forward.
	 * @returns {Observable} an Observable that emits the results of invoking the selector
	 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
	 * the underlying stream.
	 */
	export function multicast<T>(subjectOrSubjectFactory: Subject<T> | (() => Subject<T>)): ConnectableObservable<T>;

}
declare module 'rxjs/operator/observeOn' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	export function observeOn<T>(scheduler: Scheduler, delay?: number): Observable<T>;
	export class ObserveOnOperator<T> implements Operator<T, T> {
	    private scheduler;
	    private delay;
	    constructor(scheduler: Scheduler, delay?: number);
	    call(subscriber: Subscriber<T>): Subscriber<T>;
	}
	export class ObserveOnSubscriber<T> extends Subscriber<T> {
	    private scheduler;
	    private delay;
	    static dispatch({notification, destination}: {
	        notification: any;
	        destination: any;
	    }): void;
	    constructor(destination: Subscriber<T>, scheduler: Scheduler, delay?: number);
	    private scheduleMessage(notification);
	    protected _next(value: T): void;
	    protected _error(err: any): void;
	    protected _complete(): void;
	}

}
declare module 'rxjs/operator/pairwise' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns a new observable that triggers on the second and following inputs.
	 * An input that triggers an event will return an pair of [(N - 1)th, Nth].
	 * The (N-1)th is stored in the internal state until Nth input occurs.
	 *
	 * <img src="./img/pairwise.png" width="100%">
	 *
	 * @returns {Observable<R>} an observable of pairs of values.
	 */
	export function pairwise<T>(): Observable<[T, T]>;

}
declare module 'rxjs/operator/partition' {
	import { Observable } from 'rxjs/Observable';
	export function partition<T>(predicate: (value: T) => boolean, thisArg?: any): [Observable<T>, Observable<T>];

}
declare module 'rxjs/operator/pluck' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Retrieves the value of a specified nested property from all elements in
	 * the Observable sequence. If a property can't be resolved, it will return
	 * `undefined` for that value.
	 *
	 * @param {...args} properties the nested properties to pluck
	 * @returns {Observable} Returns a new Observable sequence of property values
	 */
	export function pluck(...properties: string[]): Observable<any>;

}
declare module 'rxjs/operator/publish' {
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	/**
	 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
	 * before it begins emitting items to those Observers that have subscribed to it.
	 *
	 * <img src="./img/publish.png" width="100%">
	 *
	 * @returns a ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
	 */
	export function publish<T>(): ConnectableObservable<T>;

}
declare module 'rxjs/operator/publishBehavior' {
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	export function publishBehavior<T>(value: T): ConnectableObservable<T>;

}
declare module 'rxjs/operator/publishLast' {
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	export function publishLast<T>(): ConnectableObservable<T>;

}
declare module 'rxjs/operator/publishReplay' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
	export function publishReplay<T>(bufferSize?: number, windowTime?: number, scheduler?: Scheduler): ConnectableObservable<T>;

}
declare module 'rxjs/operator/reduce' {
	import { Observable } from 'rxjs/Observable';
	import { Operator } from 'rxjs/Operator';
	import { Subscriber } from 'rxjs/Subscriber';
	/**
	 * Returns an Observable that applies a specified accumulator function to the first item emitted by a source Observable,
	 * then feeds the result of that function along with the second item emitted by the source Observable into the same
	 * function, and so on until all items have been emitted by the source Observable, and emits the final result from
	 * the final call to your function as its sole item.
	 * This technique, which is called "reduce" here, is sometimes called "aggregate," "fold," "accumulate," "compress," or
	 * "inject" in other programming contexts.
	 *
	 * <img src="./img/reduce.png" width="100%">
	 *
	 * @param {initialValue} the initial (seed) accumulator value
	 * @param {accumulator} an accumulator function to be invoked on each item emitted by the source Observable, the
	 * result of which will be used in the next accumulator call.
	 * @returns {Observable} an Observable that emits a single item that is the result of accumulating the output from the
	 * items emitted by the source Observable.
	 */
	export function reduce<T, R>(project: (acc: R, value: T) => R, seed?: R): Observable<R>;
	export class ReduceOperator<T, R> implements Operator<T, R> {
	    private project;
	    private seed;
	    constructor(project: (acc: R, value: T) => R, seed?: R);
	    call(subscriber: Subscriber<R>): Subscriber<T>;
	}
	export class ReduceSubscriber<T, R> extends Subscriber<T> {
	    acc: T | R;
	    hasSeed: boolean;
	    hasValue: boolean;
	    project: (acc: R, value: T) => R;
	    constructor(destination: Subscriber<R>, project: (acc: R, value: T) => R, seed?: R);
	    protected _next(value: T): void;
	    private _tryReduce(value);
	    protected _complete(): void;
	}

}
declare module 'rxjs/operator/repeat' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times,
	 * on a particular Scheduler.
	 *
	 * <img src="./img/repeat.png" width="100%">
	 *
	 * @param {Scheduler} [scheduler] the Scheduler to emit the items on.
	 * @param {number} [count] the number of times the source Observable items are repeated, a count of 0 will yield
	 * an empty Observable.
	 * @returns {Observable} an Observable that repeats the stream of items emitted by the source Observable at most
	 * count times.
	 */
	export function repeat<T>(count?: number): Observable<T>;

}
declare module 'rxjs/operator/retry' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that mirrors the source Observable, resubscribing to it if it calls `error` and the
	 * predicate returns true for that specific exception and retry count.
	 * If the source Observable calls `error`, this method will resubscribe to the source Observable for a maximum of
	 * count resubscriptions (given as a number parameter) rather than propagating the `error` call.
	 *
	 * <img src="./img/retry.png" width="100%">
	 *
	 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
	 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
	 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
	 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
	 * @param {number} number of retry attempts before failing.
	 * @returns {Observable} the source Observable modified with the retry logic.
	 */
	export function retry<T>(count?: number): Observable<T>;

}
declare module 'rxjs/operator/retryWhen' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the same values as the source observable with the exception of an `error`.
	 * An `error` will cause the emission of the Throwable that cause the error to the Observable returned from
	 * notificationHandler. If that Observable calls onComplete or `error` then retry will call `complete` or `error`
	 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
	 * Scheduler.
	 *
	 * <img src="./img/retryWhen.png" width="100%">
	 *
	 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
	 * aborting the retry.
	 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
	 * @returns {Observable} the source Observable modified with retry logic.
	 */
	export function retryWhen<T>(notifier: (errors: Observable<any>) => Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/sample' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that, when the specified sampler Observable emits an item or completes, it then emits the most
	 * recently emitted item (if any) emitted by the source Observable since the previous emission from the sampler
	 * Observable.
	 *
	 * <img src="./img/sample.png" width="100%">
	 *
	 * @param {Observable} sampler - the Observable to use for sampling the source Observable.
	 * @returns {Observable<T>} an Observable that emits the results of sampling the items emitted by this Observable
	 * whenever the sampler Observable emits an item or completes.
	 */
	export function sample<T>(notifier: Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/sampleTime' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	export function sampleTime<T>(delay: number, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/scan' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that applies a specified accumulator function to each item emitted by the source Observable.
	 * If a seed value is specified, then that value will be used as the initial value for the accumulator.
	 * If no seed value is specified, the first item of the source is used as the seed.
	 * @param {function} accumulator The accumulator function called on each item.
	 *
	 * <img src="./img/scan.png" width="100%">
	 *
	 * @param {any} [seed] The initial accumulator value.
	 * @returns {Obervable} An observable of the accumulated values.
	 */
	export function scan<T, R>(accumulator: (acc: R, x: T) => R, seed?: T | R): Observable<R>;

}
declare module 'rxjs/operator/share' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
	 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
	 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
	 * This is an alias for .publish().refCount().
	 *
	 * <img src="./img/share.png" width="100%">
	 *
	 * @returns {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
	 */
	export function share<T>(): Observable<T>;

}
declare module 'rxjs/operator/single' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
	 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
	 * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
	 *
	 * <img src="./img/single.png" width="100%">
	 *
	 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
	 * @returns {Observable<T>} an Observable that emits the single item emitted by the source Observable that matches
	 * the predicate.
	 .
	 */
	export function single<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<T>;

}
declare module 'rxjs/operator/skip' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that skips `n` items emitted by an Observable.
	 *
	 * <img src="./img/skip.png" width="100%">
	 *
	 * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
	 * @returns {Observable} an Observable that skips values emitted by the source Observable.
	 *
	 */
	export function skip<T>(total: number): Observable<T>;

}
declare module 'rxjs/operator/skipUntil' {
	import { Observable } from 'rxjs/Observable';
	/**
	* Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
	*
	* <img src="./img/skipUntil.png" width="100%">
	*
	* @param {Observable} the second Observable that has to emit an item before the source Observable's elements begin to
	* be mirrored by the resulting Observable.
	* @returns {Observable<T>} an Observable that skips items from the source Observable until the second Observable emits
	* an item, then emits the remaining items.
	*/
	export function skipUntil<T>(notifier: Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/skipWhile' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
	 * true, but emits all further source items as soon as the condition becomes false.
	 *
	 * <img src="./img/skipWhile.png" width="100%">
	 *
	 * @param {Function} predicate - a function to test each item emitted from the source Observable.
	 * @returns {Observable<T>} an Observable that begins emitting items emitted by the source Observable when the
	 * specified predicate becomes false.
	 */
	export function skipWhile<T>(predicate: (value: T, index: number) => boolean): Observable<T>;

}
declare module 'rxjs/operator/startWith' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
	 * source Observable.
	 *
	 * <img src="./img/startWith.png" width="100%">
	 *
	 * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
	 * @returns {Observable} an Observable that emits the items in the specified Iterable and then emits the items
	 * emitted by the source Observable.
	 */
	export function startWith<T>(...array: Array<T | Scheduler>): Observable<T>;

}
declare module 'rxjs/operator/subscribeOn' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	/**
	 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
	 *
	 * <img src="./img/subscribeOn.png" width="100%">
	 *
	 * @param {Scheduler} the Scheduler to perform subscription actions on.
	 * @returns {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
	 .
	 */
	export function subscribeOn<T>(scheduler: Scheduler, delay?: number): Observable<T>;

}
declare module 'rxjs/operator/switch' {
	/**
	 * Converts an Observable that emits Observables into an Observable that emits the items emitted by the most recently
	 * emitted of those Observables.
	 *
	 * <img src="./img/switch.png" width="100%">
	 *
	 * Switch subscribes to an Observable that emits Observables. Each time it observes one of these emitted Observables,
	 * the Observable returned by switchOnNext begins emitting the items emitted by that Observable. When a new Observable
	 * is emitted, switchOnNext stops emitting items from the earlier-emitted Observable and begins emitting items from the
	 * new one.
	 *
	 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
	 * @returns {Observable<T>} an Observable that emits the items emitted by the Observable most recently emitted by the
	 * source Observable.
	 */
	export function _switch<T>(): T;

}
declare module 'rxjs/operator/switchMap' {
	import { Observable } from 'rxjs/Observable';
	/**
	 * Returns a new Observable by applying a function that you supply to each item emitted by the source Observable that
	 * returns an Observable, and then emitting the items emitted by the most recently emitted of these Observables.
	 *
	 * <img src="./img/switchMap.png" width="100%">
	 *
	 * @param {Observable} a function that, when applied to an item emitted by the source Observable, returns an Observable.
	 * @returns {Observable} an Observable that emits the items emitted by the Observable returned from applying func to
	 * the most recently emitted item emitted by the source Observable.
	 */
	export function switchMap<T, R, R2>(project: (value: T, index: number) => Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2): Observable<R2>;

}
declare module 'rxjs/operator/switchMapTo' {
	import { Observable } from 'rxjs/Observable';
	export function switchMapTo<T, R, R2>(observable: Observable<R>, resultSelector?: (outerValue: T, innerValue: R, outerIndex: number, innerIndex: number) => R2): Observable<R2>;

}
declare module 'rxjs/operator/take' {
	import { Observable } from 'rxjs/Observable';
	export function take<T>(total: number): Observable<T>;

}
declare module 'rxjs/operator/takeLast' {
	import { Observable } from 'rxjs/Observable';
	export function takeLast<T>(total: number): Observable<T>;

}
declare module 'rxjs/operator/takeUntil' {
	import { Observable } from 'rxjs/Observable';
	export function takeUntil<T>(notifier: Observable<any>): Observable<T>;

}
declare module 'rxjs/operator/takeWhile' {
	import { Observable } from 'rxjs/Observable';
	export function takeWhile<T>(predicate: (value: T, index: number) => boolean): Observable<T>;

}
declare module 'rxjs/operator/throttle' {
	import { Observable } from 'rxjs/Observable';
	export function throttle<T>(durationSelector: (value: T) => Observable<number> | Promise<number>): Observable<T>;

}
declare module 'rxjs/operator/throttleTime' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	export function throttleTime<T>(delay: number, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/timeout' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	export function timeout<T>(due: number | Date, errorToSend?: any, scheduler?: Scheduler): Observable<T>;

}
declare module 'rxjs/operator/timeoutWith' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { Observable } from 'rxjs/Observable';
	export function timeoutWith<T, R>(due: number | Date, withObservable: Observable<R>, scheduler?: Scheduler): Observable<T | R>;

}
declare module 'rxjs/operator/toArray' {
	import { Observable } from 'rxjs/Observable';
	export function toArray<T>(): Observable<T[]>;

}
declare module 'rxjs/operator/toPromise' {
	export function toPromise<T>(PromiseCtor?: typeof Promise): Promise<T>;

}
declare module 'rxjs/operator/zipAll' {
	import { Observable } from 'rxjs/Observable';
	export function zipAll<T, R>(project?: (...values: Array<any>) => R): Observable<R>;

}
declare module 'rxjs/scheduler/AnimationFrameAction' {
	import { Action } from 'rxjs/scheduler/Action';
	import { FutureAction } from 'rxjs/scheduler/FutureAction';
	export class AnimationFrameAction<T> extends FutureAction<T> {
	    protected _schedule(state?: any, delay?: number): Action;
	    protected _unsubscribe(): void;
	}

}
declare module 'rxjs/scheduler/AsapAction' {
	import { Action } from 'rxjs/scheduler/Action';
	import { FutureAction } from 'rxjs/scheduler/FutureAction';
	export class AsapAction<T> extends FutureAction<T> {
	    protected _schedule(state?: any, delay?: number): Action;
	    protected _unsubscribe(): void;
	}

}
declare module 'rxjs/scheduler/animationFrame' {
	import { AnimationFrameScheduler } from 'rxjs/scheduler/AnimationFrameScheduler';
	export const animationFrame: AnimationFrameScheduler;

}
declare module 'rxjs/scheduler/asap' {
	import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';
	export const asap: AsapScheduler;

}
declare module 'rxjs/scheduler/queue' {
	import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
	export const queue: QueueScheduler;

}
declare module 'rxjs/subject/SubjectSubscription' {
	import { Subject } from 'rxjs/Subject';
	import { Observer } from 'rxjs/Observer';
	import { Subscription } from 'rxjs/Subscription';
	export class SubjectSubscription extends Subscription {
	    subject: Subject<any>;
	    observer: Observer<any>;
	    isUnsubscribed: boolean;
	    constructor(subject: Subject<any>, observer: Observer<any>);
	    unsubscribe(): void;
	}

}
declare module 'rxjs/symbol/rxSubscriber' {
	/**
	 * rxSubscriber symbol is a symbol for retreiving an "Rx safe" Observer from an object
	 * "Rx safety" can be defined as an object that has all of the traits of an Rx Subscriber,
	 * including the ability to add and remove subscriptions to the subscription chain and
	 * guarantees involving event triggering (can't "next" after unsubscription, etc).
	 */
	export const rxSubscriber: any;

}
declare module 'rxjs/testing/SubscriptionLoggable' {
	import { Scheduler } from 'rxjs/Scheduler';
	import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
	export class SubscriptionLoggable {
	    subscriptions: SubscriptionLog[];
	    scheduler: Scheduler;
	    logSubscribedFrame(): number;
	    logUnsubscribedFrame(index: number): void;
	}

}
declare module 'rxjs/testing/ColdObservable' {
	import { Observable } from 'rxjs/Observable';
	import { Scheduler } from 'rxjs/Scheduler';
	import { TestMessage } from 'rxjs/testing/TestMessage';
	import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
	import { SubscriptionLoggable } from 'rxjs/testing/SubscriptionLoggable';
	import { Subscriber } from 'rxjs/Subscriber';
	export class ColdObservable<T> extends Observable<T> implements SubscriptionLoggable {
	    messages: TestMessage[];
	    subscriptions: SubscriptionLog[];
	    scheduler: Scheduler;
	    logSubscribedFrame: () => number;
	    logUnsubscribedFrame: (index: number) => void;
	    constructor(messages: TestMessage[], scheduler: Scheduler);
	    scheduleMessages(subscriber: Subscriber<any>): void;
	}

}
declare module 'rxjs/testing/HotObservable' {
	import { Subject } from 'rxjs/Subject';
	import { Subscriber } from 'rxjs/Subscriber';
	import { Subscription } from 'rxjs/Subscription';
	import { Scheduler } from 'rxjs/Scheduler';
	import { TestMessage } from 'rxjs/testing/TestMessage';
	import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
	import { SubscriptionLoggable } from 'rxjs/testing/SubscriptionLoggable';
	export class HotObservable<T> extends Subject<T> implements SubscriptionLoggable {
	    messages: TestMessage[];
	    subscriptions: SubscriptionLog[];
	    scheduler: Scheduler;
	    logSubscribedFrame: () => number;
	    logUnsubscribedFrame: (index: number) => void;
	    constructor(messages: TestMessage[], scheduler: Scheduler);
	    protected _subscribe(subscriber: Subscriber<any>): Subscription | Function | void;
	    setup(): void;
	}

}
declare module 'rxjs/util/AnimationFrame' {
	export class RequestAnimationFrameDefinition {
	    cancelAnimationFrame: (handle: number) => void;
	    requestAnimationFrame: (cb: () => void) => number;
	    constructor(root: any);
	}
	export const AnimationFrame: RequestAnimationFrameDefinition;

}
declare module 'rxjs/util/FastMap' {
	export class FastMap {
	    private values;
	    delete(key: string): boolean;
	    set(key: string, value: any): FastMap;
	    get(key: string): any;
	    forEach(cb: (value: any, key: any) => void, thisArg?: any): void;
	    clear(): void;
	}

}
declare module 'rxjs/util/Immediate' {
	export class ImmediateDefinition {
	    private root;
	    setImmediate: (cb: () => void) => number;
	    clearImmediate: (handle: number) => void;
	    private identify(o);
	    tasksByHandle: any;
	    nextHandle: number;
	    currentlyRunningATask: boolean;
	    constructor(root: any);
	    canUseProcessNextTick(): boolean;
	    canUseMessageChannel(): boolean;
	    canUseReadyStateChange(): boolean;
	    canUsePostMessage(): boolean;
	    partiallyApplied(handler: any, ...args: any[]): () => void;
	    addFromSetImmediateArguments(args: any[]): number;
	    createProcessNextTickSetImmediate(): () => any;
	    createPostMessageSetImmediate(): () => any;
	    runIfPresent(handle: any): void;
	    createMessageChannelSetImmediate(): () => any;
	    createReadyStateChangeSetImmediate(): () => any;
	    createSetTimeoutSetImmediate(): () => any;
	}
	export const Immediate: ImmediateDefinition;

}
declare module 'rxjs/util/Map' {
	export const Map: any;

}
declare module 'rxjs/util/MapPolyfill' {
	export class MapPolyfill {
	    size: number;
	    private _values;
	    private _keys;
	    get(key: any): any;
	    set(key: any, value: any): this;
	    delete(key: any): boolean;
	    clear(): void;
	    forEach(cb: Function, thisArg: any): void;
	}

}
declare module 'rxjs/util/SymbolShim' {
	export function polyfillSymbol(root: any): any;
	export function ensureFor(Symbol: any): void;
	export function ensureSymbol(root: any): any;
	export function symbolForPolyfill(key: any): string;
	export function ensureIterator(Symbol: any, root: any): void;
	export function ensureObservable(Symbol: any): void;
	export const SymbolShim: any;

}
declare module 'rxjs/util/applyMixins' {
	export function applyMixins(derivedCtor: any, baseCtors: any[]): void;

}
declare module 'rxjs/util/assign' {
	export const assign: (target: Object, ...sources: Array<Object>) => Object;

}
declare module 'rxjs/util/errorObject' {
	export var errorObject: any;

}
declare module 'rxjs/util/isArray' {
	export const isArray: (arg: any) => arg is any[];

}
declare module 'rxjs/util/isDate' {
	export function isDate(value: any): value is Date;

}
declare module 'rxjs/util/isFunction' {
	export function isFunction(x: any): x is Function;

}
declare module 'rxjs/util/isNumeric' {
	export function isNumeric(val: any): val is number;

}
declare module 'rxjs/util/isObject' {
	export function isObject(x: any): x is Object;

}
declare module 'rxjs/util/isPromise' {
	export function isPromise<T>(value: any | Promise<T>): value is Promise<T>;

}
declare module 'rxjs/util/isScheduler' {
	import { Scheduler } from 'rxjs/Scheduler';
	export function isScheduler<T>(value: any): value is Scheduler;

}
declare module 'rxjs/util/noop' {
	export function noop(): void;

}
declare module 'rxjs/util/not' {
	export function not(pred: Function, thisArg: any): Function;

}
declare module 'rxjs/util/root' {
	export let root: any;

}
declare module 'rxjs/util/subscribeToResult' {
	import { Subscription } from 'rxjs/Subscription';
	import { OuterSubscriber } from 'rxjs/OuterSubscriber';
	export function subscribeToResult<T, R>(outerSubscriber: OuterSubscriber<T, R>, result: any, outerValue?: T, outerIndex?: number): Subscription;

}
declare module 'rxjs/util/throwError' {
	export function throwError(e: any): void;

}
declare module 'rxjs/util/toSubscriber' {
	import { PartialObserver } from 'rxjs/Observer';
	import { Subscriber } from 'rxjs/Subscriber';
	export function toSubscriber<T>(nextOrObserver?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscriber<T>;

}
declare module 'rxjs/util/tryCatch' {
	export function tryCatch<T extends Function>(fn: T): T;

}
