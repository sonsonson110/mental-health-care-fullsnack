export interface ProblemDetail {
    title: string;
    status: number;
    detail: string;
    errors: ErrorsMap | null;
    exception: string | null;
}

type ErrorsMap = { [key: string]: string[] };