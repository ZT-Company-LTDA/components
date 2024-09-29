interface TableProps {
  dataInitial: { count: number; results: { [key: string]: string | number }[] };
  columns: Column[];
  urlFetcher: string;
  token: string | undefined;
  elementName: string;
  size: string;
  modalInputs: Array<{
    label: string;
    value: string;
    name: string;
    trigger?: () => boolean;
    type: string;
    placeholder: string;
    autocompleteUrl?: string;
    hiddenValue?: string;
  }>;
  add?: boolean;
  urlModalGetElement?: string;
  addModalUrl?: string;
  updateModalUrl?: string;
}