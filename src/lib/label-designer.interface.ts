/**
 * @internal
 */
export type TLabelLocation = 'labelItems' | 'backSideLabelItems';

/**
 * Error correction level for the QR Code
 */
export enum QRCodeErrorCorrectionLevel {
  levelL = 'L',
  levelM = 'M',
  levelQ = 'Q',
  levelH = 'H',
}

/**
 * Different types are used for the following purposes:
 * * qrCode field is usable for QR Code.
 * * domain field contains only the domain part of the id.
 * * uri field contains the full uri.
 * * id field contains id without the domain.
 * * text field is containing free text.
 */
export enum FieldType {
  /**
   * for QR Code field
   */
  qrCode = 'qr-code',
  domain = 'domain',
  uri = 'uri',
  id = 'id',
  text = 'text'
}

/**
 * Preset setups that can be added to the editor so that they are easily accessible by the users.
 */
export interface PresetSetup {
  name: string;
  setup: ISetup;
  availableFields?: ILabelField[];
}

/**
 * Editor html event.
 */
export interface ILabelPdf {
  filename?: string;
  html: string;
}

/**
 * Styling for the fonts
 */
export interface IFontStyle {
  'font-family'?: string;
  'font-size.pt'?: number;
  'font-weight'?: string;
  'font-style'?: string;
  'text-decoration'?: string;
  'text-align'?: string;
  'line-height'?: string;
  'text-transform'?: string;
}

/**
 * General page style.
 */
export interface IPageStyle extends IFontStyle {
  'height.mm'?: number;
  'width.mm'?: number;
  'paddingTop.mm'?: number;
  'paddingLeft.mm'?: number;
  'paddingBottom.mm'?: number;
  'paddingRight.mm'?: number;
}

/**
 * Styling for the single label
 */
export interface ILabelStyle extends IFontStyle {
  'height.mm'?: number;
  'width.mm'?: number;
  'marginTop.mm'?: number;
  'marginLeft.mm'?: number;
  'marginBottom.mm'?: number;
  'marginRight.mm'?: number;
  'top.mm'?: number;
  'left.mm'?: number;
}

/**
 * Label item is the basic unit in the label designer. This can hold multiple fields, position and the styling for this label item.
 */
export interface ILabelItem {
  /**
   * @ignore
   */
  _id?: number;
  /**
   * x position in mm.
   */
  x: number;
  /**
   * y position in mm.
   */
  y: number;
  /**
   * Type of the label item.
   */
  type: 'field';
  /**
   * Fields that belong to this label item.
   */
  fields: ILabelField[];
  /**
   * Styling for this label item.
   */
  style?: ILabelStyle;
  /**
   * Order of the item.
   */
  order?: number;
}

export interface ILabelField {
  /**
   * Key value in the data object.
   */
  field: string;
  /**
   * Name of this field when picking from the available fields list.
   */
  label: string;
  /**
   * Prefix added to the data if there is a value.
   */
  prefix?: string;
  /**
   * Suffix added to the data if there is a value.
   */
  suffix?: string;
  /**
   * If the value can hold array of different values this is used to join the values together.
   */
  join?: string;
  /**
   * This is the content of the given fields.
   */
  content?: string;
  /**
   * This is what separates this field from the following field.
   */
  separator?: string;
  /**
   * If this is true then the separator is always displayed even when there no when.
   *
   * if this is false then the separator is not displayed if there is no value.
   */
  separatorAlways?: boolean;
  /**
   * This tells if the field can hold array value or not
   */
  isArray?: boolean;
  /**
   * What kind of field this is.
   */
  type?: FieldType;
  /**
   * Styling specific only for this field.
   */
  style?: IFontStyle;
  /**
   * Targets the styling only this part of the label.
   */
  styleAppliesTo?: 'content'|'prefix'|'suffix'|'all'|'contentPrefix'|'contentSuffix'|'prefixSuffix';
  /**
   * @ignore
   */
  _menuOpen?: boolean;
  /**
   * Map field value from the given to another.
   */
  valueMap?: {[from: string]: string};
}

export interface IViewSettings {
  /**
   * Editor is magnified by this amount.
   */
  magnification: number;
  /**
   * Preview is magnified by this amount.
   */
  previewMagnification?: number;
  /**
   * Grid density.
   */
  grid?: number;
  /**
   * Show grid or not.
   */
  gridVisible?: boolean;
  /**
   * Display the editor in fullscreen.
   */
  fullscreen?: boolean;
}

export interface ISetup {

  /**
   * Setup version. Used in the future if there is breaking changes introduced in the setup.
   */
  version?: number;

  /**
   * Pages size object
   */
  page: IPageStyle;

  /**
   * true - print odd pages using labelItems and even pages using backSideLabelItems
   * false - print all pages using labelItems
   */
  twoSided?: boolean;

  /**
   * Skip this many items from the start
   */
  skip?: number;

  /**
   * Global styling for the label.
   */
  label: ILabelStyle;

  /**
   * Items on the frontside of the label
   */
  labelItems: ILabelItem[];

  /**
   * Label items on the backside
   */
  backSideLabelItems?: ILabelItem[];

  /**
   * Border styling on the labels.
   */
  border?: string;

  /**
   * Map values to new one
   */
  valueMap?: ILabelValueMap;
}

/**
 * @internal
 */
export interface IAddLabelEvent {
  item: ILabelItem;
  location: TLabelLocation;
}

export interface ILabelValueMap {
  [field: string]: {
    [value: string]: string
  };
}

export interface IColumnMap {
  [col: string]: string;
}

export interface ILabelData {
  [key: string]: string|number|boolean|string[];
}
