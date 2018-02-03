import {writeFileSync} from 'fs';
import * as path from 'path';
import {ParameterReflection, ProjectReflection, ReflectionKind} from 'typedoc';
import {Comment, Type} from 'typedoc/dist/lib/models';
import {ReflectionGroup} from 'typedoc/dist/lib/models/ReflectionGroup';
import {ContainerReflection} from 'typedoc/dist/lib/models/reflections/container';
import {DeclarationReflection} from 'typedoc/dist/lib/models/reflections/declaration';
import {SignatureReflection} from 'typedoc/dist/lib/models/reflections/signature';
import {SourceReference} from 'typedoc/dist/lib/models/sources/file';
import {ReflectionFlags} from 'typedoc/dist/lib/models/reflections/abstract';
import sortBy = require('lodash/sortBy');
import upperFirst = require('lodash/upperFirst');
import map = require('lodash/map');

//tslint:disable:no-var-requires variable-name

const kindNameHeadingReplacements = new Map<ReflectionKind, string>([
  [ReflectionKind.Function, 'Decorators']
]);

const kindPriority: ReflectionKind[] = [
  ReflectionKind.Function,
  ReflectionKind.Property,
  ReflectionKind.Method
];

function defTyped(packageName: string): string {
  return `https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/${packageName}/index.d.ts`;
}

//tslint:disable:max-line-length
const typeLinks = {
  Application: defTyped('express'),
  Error: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
  PathParams: defTyped('express-serve-static-core'),
  RequestHandler: defTyped('express'),
  RouterOptions: defTyped('express-serve-static-core')
};

//tslint:enable:max-line-length

function declarationFilter(dec: DeclarationReflection): boolean {
  if (dec.inheritedFrom && dec.inheritedFrom.name.startsWith('Error.')) {
    return false;
  }
  if (dec.kind === ReflectionKind.Property && dec.name === 'Error' && dec.flags.isStatic) {
    return false;
  }

  return true;
}

const json: ProjectReflection = require('../api/api.json');
const projectVersion: string = require('../package.json').version;
const startHeaderLevel = 2;

function makeDefinitionLink(src: SourceReference): string | null {
  return `https://github.com/Alorel/express-decorated-router/blob/${projectVersion}/src/${src.fileName}#L${src.line}`;
}

function groupSorter(a: ReflectionGroup, b: ReflectionGroup): number {
  const idxA: number = kindPriority.indexOf(a.kind);
  const idxB: number = kindPriority.indexOf(b.kind);

  if (idxA !== -1 && idxB === -1) {
    return -1;
  } else if (idxA === -1 && idxB !== -1) {
    return 1;
  } else if (idxA !== -1 && idxB !== -1) {
    return idxA - idxB;
  }

  return 0;
}

function getChildById(parent: ContainerReflection, id: number): DeclarationReflection {
  for (const child of parent.children) {
    if (child.id === id) {
      return child;
    }
  }

  throw new Error(`Child ${id} not found in parent ${parent.id}`);
}

json.groups = json.groups.sort(groupSorter);

let html = '';

type NamedType = Type & { name: string };
type NamedParamReflection = ParameterReflection & { type: NamedType; elementType: NamedType };

function extractParamType(param: NamedParamReflection): string {
  if (param.flags.isRest) {
    return param.type.elementType.name;
  }

  return param.type.name;
}

function getTypeLink(type: string): string | null {
  if (typeLinks[type]) {
    return typeLinks[type];
  }

  return null;
}

function getCallableHeaderParams(params: ParameterReflection[]): string {
  return map(params, (param: NamedParamReflection): string => {
    const name = param.name + (param.flags.isOptional || param.defaultValue !== undefined ? '?' : '');

    if (param.flags.isRest) {
      return `...${name}: </span><code>${extractParamType(param)}[]</code>`;
    }

    return `<span>${name}: </span><code>${extractParamType(param)}</code>`;
  }).join(', ');
}

function getCallSignatureHeader(sig: SignatureReflection): string {
  let out = `<h${startHeaderLevel + 1}><code>${sig.name}</code>(`;

  out += getCallableHeaderParams(sig.parameters);

  return out + `)</h${startHeaderLevel + 1}>`;
}

function formatParam(param: ParameterReflection): string {
  const paramType = extractParamType(param);
  const paramLink = getTypeLink(paramType);

  let out = '';

  if (paramLink) {
    out += `<a href="${paramLink}">`;
  }
  out += `<code>${paramType + (param.flags.isRest ? '[]' : '')}</code>`;
  if (paramLink) {
    out += '</a>';
  }

  return out;
}

function getParams(sig: SignatureReflection): string {
  let out = '';
  if (sig.parameters && sig.parameters.length) {
    let hasDefaults = false;

    for (const param of sig.parameters) {
      if (param.defaultValue !== undefined) {
        hasDefaults = true;
        break;
      }
    }

    out = '<b>Parameters</b>';
    out += '<table>';
    out += '<thead>';
    out += '<tr>';
    out += '<th></th>';
    out += '<th>Type</th>';
    out += '<th>Required</th>';

    if (hasDefaults) {
      out += '<th>Default value</th>';
    }

    out += '<th>Description</th>';
    out += '</tr>';
    out += '</thead>';
    out += '<tbody>';

    for (const param of sig.parameters) {
      out += '<tr>';
      out += `<td><b>${param.name}</b></td>`;

      out += `<td>${formatParam(param)}</td>`;

      out +=
        `<td>${param.flags.isOptional || param.flags.isRest || param.defaultValue ? ':x:' : ':heavy_check_mark:'}</td>`;

      if (hasDefaults) {
        out += `<td>${param.defaultValue !== undefined ? `<code>${param.defaultValue}</code>` : ''}</td>`;
      }

      out += `<td>${param.comment ? param.comment.text.trim() : ''}</td>`;

      out += '</tr>';
    }
    out += `</tbody></table>`;
  }

  return out;
}

function sortedTags(tags: any[]): any[] {
  return sortBy(tags, (tag: any): any => {
    switch (tag.tag) {
      case 'throws':
        return 0;
      default:
        return tag.tag;
    }
  });
}

function getModifiers(flags: ReflectionFlags): string {
  const access = flags.isProtected ? 'protected' : flags.isPrivate ? 'private' : 'public';
  const isStatic = flags.isStatic ? ' static' : '';

  return access + isStatic;
}

function getMethodHeader(sig: SignatureReflection, method: DeclarationReflection): string {
  const hLevel = startHeaderLevel + 2; //tslint:disable-line:no-magic-numbers
  const flags = Object.assign({}, sig.flags, method.flags);

  let out = `<h${hLevel}>${getModifiers(flags)} <code>${sig.name}</code>(`;
  out += getCallableHeaderParams(sig.parameters);

  return out + `)</h${hLevel}>`;
}

function getPropertyHeader(prop: DeclarationReflection): string {
  const hLevel = startHeaderLevel + 2; //tslint:disable-line:no-magic-numbers

  return `<h${hLevel}>${getModifiers(prop.flags)} <code>${prop.name}</code></h${hLevel}>`;
}

function processTags(comment: Comment) {
  if (comment && comment.tags && comment.tags.length) {
    comment.tags = sortedTags(comment.tags);

    html += '<ul>';

    for (const tag of comment.tags) {
      html += `<li><b>${upperFirst(tag.tag.toLowerCase())}</b>: ${tag.text}</li>`;
    }

    html += '</ul>';
  }
}

function processSource(source: SourceReference) {
  if (source) {
    const defLink = makeDefinitionLink(source);
    if (defLink) {
      html += `<p><i>Defined in <a href="${defLink}">${source.fileName}:${source.line}</a></i></p>`;
    }
  }
}

function processFunction(fn: DeclarationReflection): void {
  for (let i = 0; i < fn.signatures.length; i++) {
    const signature: SignatureReflection = fn.signatures[i];
    const source: SourceReference = fn.sources[i];

    html += getCallSignatureHeader(signature);

    processDesc(signature.comment);

    html += getParams(signature);

    processTags(signature.comment);
    processSource(source);
  }
}

function processMethod(fn: DeclarationReflection): void {
  for (let i = 0; i < fn.signatures.length; i++) {
    const sig: SignatureReflection = fn.signatures[i];
    const source: SourceReference = fn.sources[i];

    html += getMethodHeader(sig, fn);
    processDesc(sig.comment);
    html += getParams(sig);
    processTags(sig.comment);
    processSource(source);
  }
}

function processProperty(prop: DeclarationReflection): void {
  html += getPropertyHeader(prop);
  processDesc(prop.comment);
  processTags(prop.comment);
  processSource((prop.sources || [])[0]);
}

function processExtends(clazz: DeclarationReflection): void {
  if (Array.isArray(clazz.extendedTypes) && clazz.extendedTypes.length) {
    html += `<div><b>Extends</b>: `;

    html += clazz.extendedTypes.map((ext: NamedType): string => {
      const link = getTypeLink(ext.name);

      let out = link ? `<a href="${link}">` : '';
      out += `<code>${ext.name}</code>`;
      if (link) {
        out += '</a>';
      }

      return out;
    }).join(', ');

    html += '</div>';
  }
}

function processClass(clazz: DeclarationReflection): void {
  html += `<h${startHeaderLevel + 1}>${clazz.name}</h${startHeaderLevel + 1}>`;
  processDesc(clazz.comment);
  processExtends(clazz);
  processTags(clazz.comment);

  if (Array.isArray(clazz.sources) && clazz.sources.length) {
    const source = clazz.sources[0];
    processSource(source);
  }
  clazz.groups = (clazz.groups || []).sort(groupSorter);

  for (const group of clazz.groups) {
    for (const groupChildID of group.children) {
      const groupChild: DeclarationReflection = getChildById(
        clazz,
        typeof groupChildID === 'number' ? <any>groupChildID : groupChildID.id
      );

      if (!groupChild.flags.isExported || groupChild.flags.isPrivate || !declarationFilter(groupChild)) {
        continue;
      }

      switch (groupChild.kind) {
        case ReflectionKind.Method:
          processMethod(groupChild);
          break;
        case ReflectionKind.Property:
          processProperty(groupChild);
          break;
        default:
          console.log(`Unsupported child kind: ${groupChild.kindString}`);
      }
    }
  }
}

function processDesc(comment: Comment) {
  if (comment) {
    if (comment.shortText) {
      html += `<p>${comment.shortText}</p>`;
    }
    if (comment.text) {
      html += `<p><i>${comment.text}</i></p>`;
    }
  }
}

for (const topLevelGroup of json.groups) {
  html +=
    `<h${startHeaderLevel}>${kindNameHeadingReplacements.get(topLevelGroup.kind) ||
    topLevelGroup.title}</${startHeaderLevel}>`;

  for (const childID of topLevelGroup.children) {
    const child: DeclarationReflection = getChildById(
      json,
      typeof childID === 'number' ? <any>childID : childID.id
    );

    if (!child.flags.isExported || !declarationFilter(child)) {
      continue;
    }

    if (child.kind === ReflectionKind.Function) {
      processFunction(child);
    } else if (child.kind === ReflectionKind.Class) {
      processClass(child);
    } else {
      console.log(`Unknown child kind: ${child.kindString}`);
      continue;
    }

    html += '<hr/>';
  }
}

const TurndownService = require('turndown');
const turndownService = new TurndownService({
  headingStyle: 'atx'
});

turndownService.use(require('turndown-plugin-gfm').gfm);

const markdown = turndownService.turndown(html);
writeFileSync(path.resolve(__dirname, '../api/api.md'), markdown);

// console.log(markdown);
