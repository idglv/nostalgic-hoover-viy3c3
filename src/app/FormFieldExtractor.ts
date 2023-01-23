import {
  IFormSchema,
  IFormSchemaCodeListOption,
  IFormSchemaNode,
} from './formStructureTypes';

export class FormFieldExtractor {
  data: IFormSchema;

  constructor(data: IFormSchema) {
    this.data = data;
  }

  extractFields(fields: IFormSchemaNode[], nodes?: IFormSchemaNode[]) {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === 'field') {
        fields.push(node);
      } else {
        this.extractFields(fields, node.nodes);
      }
    }
  }

  getAllFields() {
    const fields: IFormSchemaNode[] = [];
    this.extractFields(fields, this.data.nodes);
    return fields;
  }

  getFieldsOptions() {
    const fields = this.getAllFields();
    const options = new Map<string, IFormSchemaCodeListOption[]>();

    fields.forEach((field) => {
      if ('options' in field) {
        options.set(field.id, field.options as IFormSchemaCodeListOption[]);
      }
    });

    return options;
  }
}
