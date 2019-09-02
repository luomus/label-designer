import { Injectable } from '@angular/core';
import { ILabelField, ILabelStyle, ILabelValueMap, ISetup } from './label-designer.interface';

export interface IPageLayout {
  cols: number;
  rows: number;
}

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private pixelToMMRation;

  public static widthInner(style: ILabelStyle) {
    return style['width.mm'] - ((style['paddingRight.mm'] || 0) + (style['paddingLeft.mm'] || 0));
  }

  public static heightInner(style: ILabelStyle) {
    return style['height.mm'] - ((style['paddingTop.mm'] || 0) + (style['paddingBottom.mm'] || 0));
  }

  public static widthOuter(style: ILabelStyle) {
    return style['width.mm'] + ((style['marginRight.mm'] || 0) + (style['marginLeft.mm'] || 0));
  }

  public static heightOuter(style: ILabelStyle) {
    return style['height.mm'] + ((style['marginTop.mm'] || 0) + (style['marginBottom.mm'] || 0));
  }

  public static hasValue(value: any) {
    return !(
      typeof value === 'undefined' ||
      value === '' ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  public static getFieldValue(field: ILabelField, value: any, userValueMap?: ILabelValueMap, join: boolean = true): string|string[] {
    const map = userValueMap || {};
    return LabelService._getValue(LabelService._getValue(value, field.valueMap), map[field.field], join ? field.join : undefined);
  }

  public static getDefaultFieldValue(field: ILabelField, value: any, join = true): string|string[] {
    return LabelService._getValue(value, field.valueMap, join ? field.join : undefined);
  }

  public static parseUri(uri): {uri: string, id: string, domain: string} {
    if (!uri.startsWith('http')) {
      return {uri, id: '', domain: ''};
    }
    const uriParts = uri.split('/');
    const id = uriParts.pop();
    return {
      uri,
      id,
      domain: uriParts.join('/') + '/'
    };
  }

  private static _getValue(value: any, map?: {[values: string]: string}, join?: string): string|string[] {
    if (typeof value === 'undefined' || value === null || (Array.isArray(value) && value.length === 0)) {
      return '';
    }
    if (Array.isArray(value)) {
      return join ?
        value.map(val => LabelService._getValue(val, map)).join(join) :
        value.map(val => LabelService._getValue(val, map)) as string[];
    }
    value = value.trim();
    return map && map[value] || value;
  }

  constructor() {}

  public countLabelsPerPage(setup: ISetup): IPageLayout {
    const pageWidth = LabelService.widthInner(setup.page);
    const pageHeight = LabelService.heightInner(setup.page);
    const labelWidth = LabelService.widthOuter(setup.label);
    const labelHeight = LabelService.heightOuter(setup.label);

    return {
      cols: Math.floor(pageWidth / labelWidth),
      rows: Math.floor(pageHeight / labelHeight)
    };
  }

  public pixelToMm(pixels: number) {
    return pixels / this.pixelToMMRation;
  }

  public mmToPixel(mm: number) {
    return mm * this.pixelToMMRation;
  }

  public initPixelMMRatio(elem100mmHigh: HTMLDivElement) {
    if (this.pixelToMMRation) {
      return;
    }
    this.pixelToMMRation = elem100mmHigh.offsetHeight / 100;
  }

  public hasRation() {
    return !!this.pixelToMMRation;
  }

  public countMinLabelSize(setup: ISetup): {width: number, height: number} {
    let width = 0, height = 0;

    const max = (item => {
      if (item.x + item.style['width.mm'] > width) {
        width = item.x + item.style['width.mm'];
      }
      if (item.y + item.style['height.mm'] > height) {
        height = item.y + item.style['height.mm'];
      }
    });

    setup.labelItems.forEach(max);
    setup.backSideLabelItems.forEach(max);

    return {width, height};
  }

}
