import { Injectable } from '@angular/core';
import { ILabelField } from './label-designer.interface';

export interface ISchemaOptions {
  skip?: string[];
  special?: {[field: string]: ILabelField[]};
}

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  /**
   * Convert json schema to list of label fields. This list can be used for the
   * [LabelDesigner components availableFields]{@link LabelDesignerComponent#availableFields}.
   */
  schemaToAvailableFields(schema: any, base: ILabelField[], options?: ISchemaOptions): ILabelField[] {
    this.convertSchema('', '', schema, base, options);
    if (options) {
      if (options.skip) {
        base = base.filter(field => !options.skip.includes(field.field));
      }
    }
    return base;
  }

  private convertSchema(path: string, parentLabel: string, schema: any, base: ILabelField[], options?: ISchemaOptions) {
    switch (schema.type) {
      case 'object':
        if (schema.properties) {
          Object.keys(schema.properties).forEach(field => {
            this.convertSchema((path ? path + '.' : '') + field, schema.title || parentLabel, schema.properties[field], base, options);
          });
        }
        break;
      case 'array':
        if (schema.items) {
          if (schema.items.type !== 'object') {
            base.push({field: path, isArray: true, label: this.getLabel(schema, parentLabel), valueMap: this.getValueMap(schema)});
          } else {
            this.convertSchema(path, schema.title || parentLabel, schema.items, base, options);
          }
        }
        break;
      case 'string':
        base.push({field: path, label: this.getLabel(schema, parentLabel), valueMap: this.getValueMap(schema)});
        break;
      case 'boolean':
        base.push({field: path, label: this.getLabel(schema, parentLabel)});
        break;

    }
    return base;
  }

  private getLabel(item, parent: string) {
    return item.title + (parent ? ' - ' + parent : '');
  }

  private getValueMap(item): undefined|{[value: string]: string} {
    if (!Array.isArray(item.enum) || !Array.isArray(item.enumNames)) {
      return undefined;
    }
    const result = {};
    for (let i = 0; i < item.enum.length; i++) {
      result[item.enum[i]] = item.enumNames[i];
    }
    return result;
  }

}
