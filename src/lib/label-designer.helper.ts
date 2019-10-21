import { FieldType, ILabelField, ISetup } from './label-designer.interface';
import { LabelService } from './label.service';

/**
 * @internal
 */
export class LabelDesignerHelper {

  /**
   * Merges fields to setup.
   * This is mutable operation
   */
  static mergeFieldsToSetup(fields: ILabelField[], setup: ISetup): ISetup {
    if (!setup || !Array.isArray(fields) || fields.length === 0) {
      return setup;
    }
    const map: {[field: string]: ILabelField} = {};
    fields.forEach(field => map[field.field] = field);

    LabelService.forEachField(setup, (field) => {
      if (map[field.field]) {
        if (map[field.field].type === FieldType.text) {
          return;
        }
        // merge values that are mapped
        if (map[field.field].valueMap) {
          if (!field.valueMap) {
            field.valueMap = {};
          }
          const valueMap = map[field.field].valueMap;
          Object.keys(valueMap).forEach(key => {
            if (typeof field.valueMap[key] === 'undefined') {
              field.valueMap[key] = valueMap[key];
            }
          });
        }

        // update label to match
        if (field.label !== map[field.field].label) {
          field.label = map[field.field].label;
        }
      }
    });
  }
}
