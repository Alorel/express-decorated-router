import {writeFileSync} from 'fs';
import * as path from 'path';
import {ParameterReflection, ProjectReflection, ReflectionKind} from 'typedoc';
import {Type} from 'typedoc/dist/lib/models';
import {ReflectionGroup} from 'typedoc/dist/lib/models/ReflectionGroup';
import {ContainerReflection} from 'typedoc/dist/lib/models/reflections/container';
import {DeclarationReflection} from 'typedoc/dist/lib/models/reflections/declaration';
import {SignatureReflection} from 'typedoc/dist/lib/models/reflections/signature';
import {SourceReference} from 'typedoc/dist/lib/models/sources/file';
import sortBy = require('lodash/sortBy');
import upperFirst = require('lodash/upperFirst');

//tslint:disable:no-var-requires variable-name

const kindNameHeadingReplacements = new Map<Typedoc.ReflectionKind, string>([
  [ReflectionKind.Function, 'Decorators']
]);

const kindPriority: ReflectionKind[] = [
  ReflectionKind.Function
];

function defTyped(packageName: string): string {
  return `https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/${packageName}/index.d.ts`;
}

//tslint:disable:max-line-length
const typeLinks = {
  PathParams: defTyped('express-serve-static-core'),
  RequestHandler: defTyped('express'),
  RouterOptions: defTyped('express-serve-static-core')
};
//tslint:enable:max-line-length

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

function getCallSignatureHeader(sig: SignatureReflection): string {
  let out = `<h${startHeaderLevel + 1}><code>${sig.name}</code>(`;

  out += sig.parameters.map((param: NamedParamReflection): string => {
    const name = param.name + (param.flags.isOptional || param.defaultValue !== undefined ? '?' : '');

    if (param.flags.isRest) {
      return `...${name}: </span><code>${extractParamType(param)}[]</code>`;
    }

    return `<span>${name}: </span><code>${extractParamType(param)}</code>`;
  }).join(', ');

  // for (const param of sig.parameters) {
  //
  // }

  return out + `)</h${startHeaderLevel + 1}>`;
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
      const paramType = extractParamType(param);
      const paramLink = getTypeLink(paramType);

      out += '<tr>';
      out += `<td><b>${param.name}</b></td>`;

      out += '<td>';
      if (paramLink) {
        out += `<a href="${paramLink}">`;
      }
      out += `<code>${paramType + (param.flags.isRest ? '[]' : '')}</code>`;
      if (paramLink) {
        out += '</a>';
      }
      out += '</td>';

      out +=
        `<td>${param.flags.isOptional || param.flags.isRest || param.defaultValue ? ':x:' : ':heavy_check_mark:'}</td>`;

      if (hasDefaults) {
        out += `<td>${param.defaultValue !== undefined ? `<code>${param.defaultValue}</code>` : ''}</td>`;
      }

      out += `<td>${param.comment ? param.comment.text.trim() : ''}</td>`;

      out += '</tr>';
    }

//   <tr>
//   <td><b>Some param</b></td>
//   <td>:heavy_check_mark:</td>
//   <td>Foo</td>
//   <td>Some desc</td>
// </tr>
// </tbody>`;
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

function processFunction(fn: DeclarationReflection): void {
  for (let i = 0; i < fn.signatures.length; i++) {
    const signature: SignatureReflection = fn.signatures[i];
    const source: SourceReference = fn.sources[i];
    const hasTags: boolean = !!signature.comment && !!signature.comment.tags && !!signature.comment.tags.length;

    if (hasTags) {
      signature.comment.tags = sortedTags(signature.comment.tags);
    }

    html += getCallSignatureHeader(signature);

    if (signature.comment) {
      if (signature.comment.shortText) {
        html += `<p>${signature.comment.shortText.trim()}</p>`;
      }

      if (signature.comment.text) {
        html += `<p><i>${signature.comment.text.trim()}</i></p>`;
      }
    }

    html += getParams(signature);

    if (hasTags) {
      html += '<ul>';

      for (const tag of signature.comment.tags) {
        html += `<li><b>${upperFirst(tag.tag.toLowerCase())}</b>: ${tag.text}</li>`;
      }

      html += '</ul>';
    }

    const defLink = makeDefinitionLink(source);
    if (defLink) {
      html += `<p><i>Defined in <a href="${defLink}">${source.fileName}:${source.line}</a></i></p>`;
    }

    // const source = fn.sources[i];
    //
    // signature.parameters[0].html += `<h2></h2>`;
  }
  // html += `<h2>${fn.name}</h2>`;
}

for (const topLevelGroup of json.groups) {
  html +=
    `<h${startHeaderLevel}>${kindNameHeadingReplacements.get(topLevelGroup.kind) ||
    topLevelGroup.title}</${startHeaderLevel}>`;

  for (const childID of topLevelGroup.children) {
    const child: DeclarationReflection = getChildById(
      json,
      typeof childID === 'number' ? <any>childID : child.id
    );

    if (!child.flags.isExported) {
      continue;
    }

    if (child.kind === ReflectionKind.Function) {
      processFunction(child);
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
