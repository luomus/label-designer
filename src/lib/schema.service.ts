import { Injectable } from '@angular/core';
import { ILabelData, ILabelField } from './label-designer.interface';

export interface ISchemaOptions {
  skip?: string[];
  special?: {[field: string]: ILabelField[]};
}

interface ILabelFieldMap {
  [field: string]: ILabelField;
}

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  /**
   * Convert json schema to list of label fields. This list can be used for the
   * [LabelDesigner components availableFields]{@link LabelDesignerComponent#availableFields}.
   */
  schemaToAvailableFields(schema: any, base?: ILabelField[], options?: ISchemaOptions): ILabelField[] {
    if (!base) {
      base = [];
    }
    this.convertSchema('', '', schema, base, options);
    if (options && options.skip) {
      base = base.filter(field => options.skip.indexOf(field.field) === -1);
    }
    return base;
  }

  /**
   * Convert data matching schema to a data that can be displayed in the Label Designer.
   * @param select level to choose as a base in multidimensional arrays of objects.
   *        If there are levels under this only the first item will be picked. If there is no
   *        value given then the root will be used and only one item from arrays beneath it will be selected
   */
  convertSchemaDataToLabelData(schema: any, data: object[], select?: string, options?: ISchemaOptions): ILabelData[] {
    return this.convertDataToLabelData(this.schemaToAvailableFields(schema, [], options), data, select);
  }

  /**
   * Convert data matching label fields ({@link ILabelField}) to a data that can be displayed im the Label Designer.
   * @param select level to choose as a base in multidimensional arrays of objects.
   *        If there are levels under this only the first item will be picked. If there is no
   *        value given then the root will be used and only one item from arrays beneath it will be selected
   */
  convertDataToLabelData(fields: ILabelField[], data: object[], select?: string): ILabelData[] {
    const fieldMap: ILabelFieldMap = fields.reduce((cumulative, current) => {
      cumulative[current.field] = current;
      return cumulative;
    }, {});
    const result = [];
    try {
      (data || []).forEach(item => result.push(...this.convertData(item, fieldMap, select) as ILabelData[]));
    } catch (e) {
      console.error(e);
    }
    return result;
  }

  private convertData(
    data: object,
    fields: ILabelFieldMap,
    select?: string,
    result = [],
    base: ILabelData = {},
    parent = '',
    lvl = 0
  ): ILabelData|ILabelData[] {
    if (typeof data !== 'object' || data === null) {
      return base;
    }
    const arrays = [];
    const selected = [];
    for (const key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      const path = this.getPath(parent, key);
      if (fields[path]) {
        base[path] = data[key];
        if (path === select) {
          result.push(base);
        }
      } else if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          if (path === select) {
            selected.push(key);
          } else {
            arrays.push(key);
          }
        }
      } else {
        this.convertData(data[key], fields, select, result, base, path, lvl + 1);
      }
    }

    arrays.forEach(key => {
      const path = this.getPath(parent, key);
      data[key].forEach(item => this.convertData(item, fields, select, result, base, path, lvl + 1));
    });

    selected.forEach(key => {
      const path = this.getPath(parent, key);
      data[key].forEach(item => result.push(this.convertData(item, fields, select, result, {...base}, path, lvl + 1)));
    });

    if (lvl === 0) {
      return selected ? result : [base];
    }

    return base;
  }

  private convertSchema(path: string, parentLabel: string, schema: any, base: ILabelField[], options?: ISchemaOptions) {
    if (typeof schema !== 'object' || schema === null) {
      return base;
    }
    switch (schema.type) {
      case 'object':
        if (schema.properties) {
          Object.keys(schema.properties).forEach(field => {
            this.convertSchema(this.getPath(path, field), schema.title || parentLabel, schema.properties[field], base, options);
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

  private getPath(parent: string, field: string): string {
    return parent ? parent + '.' + field : field;
  }

  private getLabel(item, parent: string): string {
    return item.title + (parent ? ' - ' + parent : '');
  }

  private getValueMap(item): undefined|{[value: string]: string} {
    function pick(from) {
      const result = {};
      for (let i = 0; i < from.enum.length; i++) {
        result[from.enum[i]] = from.enumNames[i];
      }
      return result;
    }

    if (Array.isArray(item.enum) && Array.isArray(item.enumNames)) {
      return pick(item);
    }
    if (item.items && Array.isArray(item.items.enum) && Array.isArray(item.items.enumNames)) {
      return pick(item.items);
    }

    return undefined;
  }

}
