export class ErrorResponse {
    public status : number;
    public message :string;
    public errors: Map<string,string>;
}
