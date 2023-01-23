export const FORM_DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
export const FORM_DEFAULT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const FORM_DEFAULT_TIME_FORMAT = 'HH:mm';
export enum FormConditionKind {
  remove = 'remove',
  disable = 'disable',
}
export enum FormDataKeyKind {
  subject = 'subject',
  form = 'form',
}
export enum FormFieldRendererKind {
  checkbox = 'Checkbox',
  toggle = 'Toggle',
  inputNumber = 'InputNumber',
  slider = 'Slider',
  dateField = 'DateField',
  timeField = 'TimeField',
  dateTimeField = 'DateTimeField',
  singleLine = 'SingleLine',
  multiLine = 'MultiLine',
  dropdown = 'Dropdown',
  list = 'List',
}
export enum FormValidationKind {
  codeList = 'Codelist',
  numberRange = 'NumberRange',
  mandatory = 'Mandatory',
  dateRange = 'DateRange',
  stringLength = 'StringLength',
  dateFormat = 'DateFormat',
  expression = 'Expression',
}
export enum FormValidationBehaviourKind {
  warn = 'warn',
  error = 'error',
}
export enum FormOrientationKind {
  vertical = 'vertical',
  horizontal = 'horizontal',
}
export enum FormDataTypeKind {
  boolean = 'Boolean',
  string = 'String',
  date = 'Date',
  time = 'Time',
  datetime = 'DateTime',
  float = 'Float',
  integer = 'Int32',
  arrayOfFloat = 'FloatArray',
  arrayOfInteger = 'Int32Array',
  arrayOfString = 'StringArray',
}
export enum FormValidationMandatoryKind {
  optional = 'optional',
  mandatory = 'mandatory',
  critical = 'critical',
}
export type FormValidationType =
  | IFormSchemaValidationMandatory
  | IFormSchemaValidationStringLength
  | IFormSchemaValidationDateRange
  | IFormSchemaValidationCodeList
  | IFormSchemaValidationExpression
  | IFormSchemaValidationNumberRange;
export enum FormNodeSchemaKind {
  screen = 'screen',
  text = 'text',
  form = 'form',
  group = 'dataGroup',
  row = 'row',
  field = 'field',
}
export interface IFormSchemaNode {
  id: string;
  type: FormNodeSchemaKind;
  label: string;
  nodes?: IFormSchemaNode[];
}
export interface IFormSchema extends IFormSchemaNode {
  type: FormNodeSchemaKind.form;
  description: string;
  category: string;
  renderInstructions?: IFormSchemaRenderInstructions;
}
export interface IFormSchemaScreen extends IFormSchemaNode {
  type: FormNodeSchemaKind.screen;
}
export interface IFormSchemaGroup extends IFormSchemaNode {
  type: FormNodeSchemaKind.group;
  description: string;
  isRepeatable?: boolean;
  activeWhenCondition?: IFormSchemaExpression;
  renderInstructions?: {
    orientation?: FormOrientationKind;
  };
}
export interface IFormSchemaField extends IFormSchemaNode {
  type: FormNodeSchemaKind.field;
  dataType: FormDataTypeKind;
  isRequired: boolean;
  requiredMessage?: string;
  description?: string;
  format?: string;
  formatMessage?: string;
  isReadOnly?: boolean;
  decimals?: number;
  options?: IFormSchemaCodeListOption[];
  computedValue?: IFormSchemaExpression;
  activeWhenCondition?: IFormSchemaExpression;
  validations?: FormValidationType[];
  renderer: FormFieldRendererKind;
  inputInstructions?: string;
  renderInstructions?: {
    orientation: FormOrientationKind;
  };
  inputMask?: string;
}
export interface IFormSchemaText extends IFormSchemaNode {
  type: FormNodeSchemaKind.text;
}
export interface IFormSchemaValidationBase {
  type: FormValidationKind;
  behaviour: FormValidationBehaviourKind;
  message: string;
  activeWhenCondition?: IFormSchemaExpression;
}
export interface IFormSchemaValidationExpression
  extends IFormSchemaValidationBase {
  expression: IFormSchemaExpression;
}
export interface IFormSchemaValidationMandatory
  extends IFormSchemaValidationBase {
  status: FormValidationMandatoryKind;
}
export interface IFormSchemaValidationStringLength
  extends IFormSchemaValidationBase {
  min?: number;
  max?: number;
}
export interface IFormSchemaValidationDateRange
  extends IFormSchemaValidationBase {
  allowPast?: boolean;
  allowFuture?: boolean;
}
export interface IFormSchemaValidationNumberRange
  extends IFormSchemaValidationBase {
  min?: number;
  max?: number;
  minSoft?: number;
  maxSoft?: number;
}
export interface IFormSchemaValidationCodeList
  extends IFormSchemaValidationBase {
  codeList: IFormSchemaCodeList;
}
export interface IFormSchemaValidationDateFormat
  extends IFormSchemaValidationBase {
  iso8601Format: string;
}
export interface IFormSchemaCodeListOption {
  id: string;
  label: string;
  value: unknown;
  activeWhenCondition?: IFormSchemaExpression;
}
export interface IFormSchemaRenderInstructions {
  numberedWidgets?: boolean;
  theme?: string;
}
export interface IFormSchemaCodeList {
  id: string;
  dataType: FormDataTypeKind;
  options: IFormSchemaCodeListOption[];
}
export interface IFormSchemaExpression {
  id: string;
  engine: string;
  expression: string;
}
