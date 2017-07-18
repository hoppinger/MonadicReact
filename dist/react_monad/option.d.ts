export declare type Methods<A> = {
    map: <B>(f: (_: A) => B) => Option<B>;
};
export declare type Option<A> = ({
    kind: "none";
} | {
    kind: "some";
    value: A;
}) & Methods<A>;
export declare let none: <A>() => Option<A>;
export declare let some: <A>(x: A) => Option<A>;
