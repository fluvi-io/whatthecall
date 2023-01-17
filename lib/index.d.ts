export declare const explain: (p: any, tx: {
    data: string;
    to: string;
}) => Promise<{
    title: string;
    description: string;
    normalForm: {
        type: string;
        token: any;
        amount: any;
    };
} | {
    title: string;
    description: string;
    suspicious: boolean;
    normalForm: {
        type: string;
        contents?: undefined;
    } | {
        type: string;
        contents: {
            token: any;
            amount: any;
        }[];
    };
} | {
    title: string;
    description: string;
    suspicious: boolean;
    normalForm: {
        type: string;
        from?: undefined;
        to?: undefined;
        exactness?: undefined;
    } | {
        type: string;
        from: {
            token: any;
            amount: any;
        };
        to: {
            token: any;
            amount: any;
        };
        exactness: string;
    };
} | {
    title: string;
}>;
