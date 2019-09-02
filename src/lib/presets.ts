import { IPageStyle } from './label-designer.interface';

export class Presets {

  public static Border = {
    dashed: 'thin dashed #999',
    none: 'none',
    solid: 'thin solid #999'
  };

  public static A4: IPageStyle = {
    'height.mm': 297,
    'width.mm': 210
  };

  public static A4Landscape: IPageStyle = {
    'height.mm': 210,
    'width.mm': 297
  };
}
