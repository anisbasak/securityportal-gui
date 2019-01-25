import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import _map from 'lodash-es/map';
import _forOwn from 'lodash-es/forOwn';
import _filter from 'lodash-es/filter';

import { Resource } from '@app/core/models';
import { ResolvedData, isResolvedData, LayoutItem } from '@app/shared';
import { TraitUtil } from '../util/trait.util';


@Injectable()
export class LayoutService {

  /**
   * Iterate over a layout descriptor and store resolved data in resolvedLayout
   * @param descriptor Description of how to select traits for display.
   * @param data The resource to be resolved.
   * @returns A resolved layout filled with ResolvedData.
   */
  resolve(descriptor: any, data: Resource): any {
    const resolvedLayout = {};

    // Return if the descriptor does not exist
    if (!descriptor) { return resolvedLayout; }

    // Build out each of detail's sections
    _forOwn(descriptor, (sectionValue, sectionName) => {

      // Each section may be a LayoutItem, an array of LayoutItems, or an object of subsections
      if (sectionValue.name) {
        this.setIfResolvedData(resolvedLayout, sectionName, this.resolveItem(data, sectionValue));
      } else if (Array.isArray(sectionValue)) {
        this.setIfResolvedData(resolvedLayout, sectionName, _map(sectionValue, sv => this.resolveItem(data, sv)));
      } else {
        // Each subsection may be a LayoutItem or an array of LayoutItems
        const resolvedSection: any = {};
        _forOwn(sectionValue, (subsectionValue, subsectionName) => {
          if (Array.isArray(subsectionValue)) {
            this.setIfResolvedData(resolvedSection, subsectionName, _map(subsectionValue, ssv => this.resolveItem(data, ssv)));
          } else {
            this.setIfResolvedData(resolvedSection, subsectionName, this.resolveItem(data, subsectionValue));
          }
        });
        resolvedLayout[sectionName] = resolvedSection;
      }
    });

    return resolvedLayout;
  }

  /**
   * Resolve a layout item into real data in the form of ResolvedData.
   * @param resource The data resource.
   * @param item The layout item that needs to be resolved as real data.
   * @returns Resolved name and data (of any form).
   */
  private resolveItem(resource: Resource, item: LayoutItem): ResolvedData {

    // Method
    if (item.method && TraitUtil[item.method]) {
      return this.resolveAsMethod(resource, item);
    }

    // Trait
    else if (item.trait) {
      return this.resolveAsTrait(resource, item);
    }

    // Invalid LayoutItem
    else {
      return item.allowNull
        ? { name: item.name, value: of(null) }
        : null;
    }
  }

  /**
   * Supplies all the resource's traits to a TraitUtil method. An optional
   * array of `args` can be passed to the method as well.
   * @param resource The resource to resolve.
   * @param item A layout navigation item that uses a method for identification.
   * @returns Resolved name and data (of any form).
   */
  private resolveAsMethod(resource: Resource, item: LayoutItem): ResolvedData {
    const methodValue = TraitUtil[item.method](resource, ...(item.args || []));
    return methodValue || item.allowNull
      ? { name: item.name, value: of(methodValue) }
      : null;
  }

  /**
   * Locates the best trait matching by rule.
   * @param resource The resource to resolve.
   * @param item A layout navigation item that uses a trait for identification.
   * @returns Resolved name and data (of any form).
   */
  private resolveAsTrait(resource: Resource, item: LayoutItem): ResolvedData {
    let matchingTraits: any[] = [];
    let trait: any;

    // Select matching traits based on identifier
    if (item.trait) {
      matchingTraits = _filter(resource.traits, { rule: item.trait });
    }

    // Return when no matching traits found
    if (!matchingTraits.length) {
      return item.allowNull
        ? { name: item.name, value: of(null) }
        : null;
    }

    // Select the preferred trait
    trait = TraitUtil.selectTrait(matchingTraits);

    // Return when selectTrait disagrees with all matchingTraits
    if (!trait) {
      return item.allowNull
        ? { name: item.name, value: of(null) }
        : null;
    }

    // Return the trait's value in an observable
    return { name: item.name, value: of(trait.value) };
  }

  /**
   * Sets value on obj[key] only if the value matches the form of ResolvedData.
   * If value is an array, it is filtered to only contain object in the form
   * of ResolvedData.
   * @param obj Object to be mutated by optionally setting value to key
   * @param key Key on obj to be optionally set
   * @param value Value to be set on obj if, in fact, is instance of ResolvedData
   */
  private setIfResolvedData(obj: any, key: string, value: any) {
    if (Array.isArray(value)) {
      value = value.filter(x => isResolvedData(x));
      obj[key] = value;
    } else if (isResolvedData(value)) {
      obj[key] = value;
    }
  }
}
