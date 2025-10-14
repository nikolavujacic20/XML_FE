export class MetadataSearchParamsDTO {
  property: string;
  value: string = "";
  operator: string = "I";
  status: string = "prihvaceni";
}

export class TextSearchDTO {
  textSearch: string = "";
  casesensitive: boolean;
  status: string = "prihvaceni";
}
