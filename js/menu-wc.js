'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Label Designer</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="chapter inner">
                                        <a data-type="chapter-link" href="additional-documentation/usage.html" data-context-id="additional">
                                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#additional-page-bf49e065b0c0d60eafebe0842bcf56eb"' : 'data-target="#xs-additional-page-bf49e065b0c0d60eafebe0842bcf56eb"' }>
                                                <span class="link-name">Usage</span>
                                                <span class="icon ion-ios-arrow-down"></span>
                                            </div>
                                        </a>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="additional-page-bf49e065b0c0d60eafebe0842bcf56eb"' : 'id="xs-additional-page-bf49e065b0c0d60eafebe0842bcf56eb"' }>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/usage/angular-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Angular component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/usage/custom-html-element.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Custom html element</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/usage/standalone-app.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Standalone app</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/change-log.html" data-type="entity-link" data-context-id="additional">Change log</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/contributing.html" data-type="entity-link" data-context-id="additional">Contributing</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/contributor-code-of-conduct.html" data-type="entity-link" data-context-id="additional">Contributor Code of Conduct</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/LabelDesignerModule.html" data-type="entity-link">LabelDesignerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LabelDesignerModule-a2ea09d0de425058f70cfc7d97364b6b"' : 'data-target="#xs-components-links-module-LabelDesignerModule-a2ea09d0de425058f70cfc7d97364b6b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LabelDesignerModule-a2ea09d0de425058f70cfc7d97364b6b"' :
                                            'id="xs-components-links-module-LabelDesignerModule-a2ea09d0de425058f70cfc7d97364b6b"' }>
                                            <li class="link">
                                                <a href="components/LabelDesignerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelDesignerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LabelPreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelPreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LabelPrintComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelPrintComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Presets.html" data-type="entity-link">Presets</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/InfoWindowService.html" data-type="entity-link">InfoWindowService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchemaService.html" data-type="entity-link">SchemaService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IColumnMap.html" data-type="entity-link">IColumnMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFontStyle.html" data-type="entity-link">IFontStyle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInfoWindow.html" data-type="entity-link">IInfoWindow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelData.html" data-type="entity-link">ILabelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelField.html" data-type="entity-link">ILabelField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelFieldMap.html" data-type="entity-link">ILabelFieldMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelItem.html" data-type="entity-link">ILabelItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelPdf.html" data-type="entity-link">ILabelPdf</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelStyle.html" data-type="entity-link">ILabelStyle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILabelValueMap.html" data-type="entity-link">ILabelValueMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoadSetup.html" data-type="entity-link">ILoadSetup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPageLayout.html" data-type="entity-link">IPageLayout</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPageStyle.html" data-type="entity-link">IPageStyle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISchemaOptions.html" data-type="entity-link">ISchemaOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISetup.html" data-type="entity-link">ISetup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IViewSettings.html" data-type="entity-link">IViewSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LabelDesignerTranslationsInterface.html" data-type="entity-link">LabelDesignerTranslationsInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PresetSetup.html" data-type="entity-link">PresetSetup</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});