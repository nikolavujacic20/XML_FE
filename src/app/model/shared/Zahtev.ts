import {SimpleUser} from "./User";

export class Request {
  applicationNumber: string;
  submissionDate: string;
  submitterEmail: string;
  processed: boolean = false;
}

export class RequestDetails  {
  request: Request = new Request();
  processing: RequestProcessing  | undefined;
}

export class RequestProcessing  {
  officer!: SimpleUser;
  processingDate!: string;
  rejected: boolean = false;
  rejectionReason: string = "";
}

export class RequestProcessingDTO  {
  officer!: SimpleUser;
  processingDate!: string;
  rejected: boolean = false;
  rejectionReason: string = "";
  applicationNumber!: string;
}
