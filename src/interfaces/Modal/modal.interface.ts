interface ModalProps {
  table?: boolean;
  children?: React.ReactNode;
  trigger: JSX.Element;
  elementName: string;
  closeModal: () => void;
  isOpen: boolean;
  title: string;
  inputs?: Array<{
    label: string;
    value: string;
    name: string;
    trigger?: () => boolean;
    validation?: string;
    type: string;
    placeholder?: string;
    autocompleteUrl?: string;
    hiddenValue?: string;
  }>;
  isDelete?: boolean;
  mobile?: boolean;
  isAddModal?: boolean;
  isUpdate?: boolean;
  isViewModal?: boolean;
  isIcon?: boolean;
  id?: string | number;
  urlModalGetElement?: string;
  addModalUrl?: string;
  updateModalUrl?: string;
  searchTable: () => void;
  closeModalDropDown?: () => void;
}