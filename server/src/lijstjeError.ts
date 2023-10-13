type LijstjeErrorProps = {
    status: number;
    message: string;
    receivedInput?: string;
}

/**
 * Custom Lijstje error providing ability to set statuscode & message on error for easy passthrough to client
 */
export class LijstjeError extends Error {
    public status: number;
    public message: string;

    constructor(props: LijstjeErrorProps) {
        super(props.message);
        Object.setPrototypeOf(this, LijstjeError.prototype);

        this.status = props.status;
        this.message = props.message;
    }
}