import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';

import hljs from 'highlight.js';
import {
  isArray
} from 'util';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'templater';


  outputTemplate: string;
  outputComponent: string;
  item: FieldItem = null;
  imported: string;
  inputTypes: string[];

  header: string;
  items: FieldItem[] = [];

  templates: any[];


  constructor(private http: HttpClient) {
    this.inputTypes = [];
    this.inputTypes.push('checkbox');
    this.inputTypes.push('color');
    this.inputTypes.push('composite');
    this.inputTypes.push('date');
    this.inputTypes.push('date-local');
    this.inputTypes.push('email');
    this.inputTypes.push('file');
    this.inputTypes.push('hidden');
    this.inputTypes.push('image');
    this.inputTypes.push('month');
    this.inputTypes.push('number');
    this.inputTypes.push('password');
    this.inputTypes.push('radio');
    this.inputTypes.push('range');
    this.inputTypes.push('search');
    this.inputTypes.push('tel');
    this.inputTypes.push('text');
    this.inputTypes.push('time');
    this.inputTypes.push('url');
    this.inputTypes.push('week');

  }

  ngOnInit(): void {
    this.reset();
    this.templates = [];

    this.templates.push({
      name: 'component.map',
      value: ''
    });
    this.templates.push({
      name: 'defaultField.map',
      value: ''
    });
    this.templates.push({
      name: 'form.map',
      value: ''
    });

    this.templates.push({
      name: 'hidden.map',
      value: ''
    });

    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.templates.length; index++) {
      const element = this.templates[index];

      this.getJSON('/assets/templates/' + element.name).subscribe(data => {
        this.templates[element.name] = data;
        console.log(this.templates);
      });
    }

  }

  public getJSON(jsonURL): Observable < any > {
    return this.http.get(jsonURL, {
      responseType: 'text'
    });
  }

  add() {
    this.items.push({
      type: 'text',
      name: ''
    });
  }

  reset() {
    this.outputComponent = '';
    this.outputTemplate = '';
    this.header = '';
    this.items = [];
    this.imported = '';
  }

  generate() {
    const componentText = this.generateComponent('component.map', this.header, this.items);
    const combinedFields = this.generateFields(this.items);
    let formText = this.templates['form.map'];
    formText = formText.replace(/@@CONTENT/g, combinedFields.join(' '));

    // this.outputComponent = hljs.highlight('typescript', componentText).value;
    // this.outputTemplate = hljs.highlight('html', formText).value;
    // hljs.initHighlightingOnLoad();

    this.outputComponent = componentText;
    this.outputTemplate = formText;

  }

  generateFields(objectFields: FieldItem[]): string[] {

    var combinedFields: string[] = [];

    for (let index = 0; index < objectFields.length; index++) {
      const e = objectFields[index];

      try {

        if (e.children !== null && e.children !== undefined && e.children.length > 0) {


          var groups: string[] = this.generateFields(e.children);;

          if (groups !== null && groups !== undefined && groups.length > 0) {
            var x = '<div formControlName="' + e.name + '">' + groups.join('') + '</div>';
            combinedFields.push(x);
          }


        } else {
          if (e['name'] == null || e['name'] == undefined) {
            throw Error('name field is missing in input component');
          }
          if (e['type'] == null || e['type'] == undefined) {
            if (e['isArray'] === true) {

            } else {
              throw Error('type field is missing in input component');
            }
          }


          var templ = 'defaultField.map';

          if (e.type === 'hidden') {
            templ = 'hidden.map';
          }
          var fieldTemplate = this.templates[templ];

          // tslint:disable: max-line-length
          fieldTemplate = fieldTemplate.replace(/@@ID/g, this.getDefaultValue(e.id, e.name));
          fieldTemplate = fieldTemplate.replace(/@@TYPE/g, this.getDefaultValue(e.type, 'text'));
          fieldTemplate = fieldTemplate.replace(/@@LABEL/g, (this.getDefaultValue(e.label, e.name).replace(/([A-Z])/g, " $1")).toUpperCase());
          fieldTemplate = fieldTemplate.replace(/@@TITLE/g, this.getDefaultValue(e.title));
          fieldTemplate = fieldTemplate.replace(/@@CLASS/g, this.getDefaultValue(e.class));
          fieldTemplate = fieldTemplate.replace(/@@HELPTEXT/g, this.getDefaultValue(e.help));
          fieldTemplate = fieldTemplate.replace(/@@FORMCONTROLNAME/g, this.getDefaultValue(e.name));
          fieldTemplate = fieldTemplate.replace(/@@PLACEHOLDER/g, e.placeholder !== null && e.placeholder !== undefined && e.placeholder ? '"placeholder"="' + e.placeholder + '"' : '');
          fieldTemplate = fieldTemplate.replace(/@@REQUIRED/g, e.required !== null && e.required !== undefined && e.required ? 'required' : '');
          fieldTemplate = fieldTemplate.replace(/@@PATTERN/g, e.pattern !== null && e.pattern !== undefined ? '"pattern"="' + e.pattern + '"' : '');
          fieldTemplate = fieldTemplate.replace(/@@READONLY/g, e.readonly !== null && e.readonly !== undefined && e.readonly ? 'readonly' : '');
          fieldTemplate = fieldTemplate.replace(/@@DISABLED/g, e.disabled !== null && e.disabled !== undefined && e.disabled ? '[disabled]=' + e.disabled : '');
          fieldTemplate = fieldTemplate.replace(/@@SIZE/g, e.size !== null && e.size !== undefined && !isNaN(e.size) ? '"size"=' + e.size : '');
          fieldTemplate = fieldTemplate.replace(/@@MAXLENGTH/g, e.maxlength !== null && e.maxlength !== undefined && !isNaN(e.maxlength) ? '"maxlength"=' + e.maxlength : '');
          fieldTemplate = fieldTemplate.replace(/@@AUTOCOMPLETE/g, e.autocomplete !== null && e.autocomplete !== undefined && e.autocomplete ? 'autocomplete' : '');
          fieldTemplate = fieldTemplate.replace(/@@NOVALIDATE/g, e.novalidate !== null && e.novalidate !== undefined && e.novalidate ? 'novalidate' : '');
          fieldTemplate = fieldTemplate.replace(/@@AUTOFOCUS/g, e.autofocus !== null && e.autofocus !== undefined && e.autofocus ? 'autofocus' : '');
          fieldTemplate = fieldTemplate.replace(/@@FORMENCTYPE/g, e.formenctype !== null && e.formenctype !== undefined ? '"formenctype"="' + e.formenctype + '"' : '');
          fieldTemplate = fieldTemplate.replace(/@@HEIGHT/g, e.height !== null && e.height !== undefined && !isNaN(e.height) ? '"height"=' + e.height : '');
          fieldTemplate = fieldTemplate.replace(/@@WIDTH/g, e.width !== null && e.width !== undefined && !isNaN(e.width) ? '"width"=' + e.width : '');
          fieldTemplate = fieldTemplate.replace(/@@MIN/g, e.min !== null && e.min !== undefined && !isNaN(e.min) ? '"min"=' + e.min : '');
          fieldTemplate = fieldTemplate.replace(/@@MAX/g, e.max !== null && e.max !== undefined && !isNaN(e.max) ? '"max"=' + e.max : '');
          fieldTemplate = fieldTemplate.replace(/@@MULTIPLE/g, e.multiple !== null && e.multiple !== undefined && e.multiple ? 'multiple' : '');
          fieldTemplate = fieldTemplate.replace(/@@STEP/g, e.step !== null && e.step !== undefined && !isNaN(e.step) ? '"step"=' + e.step : '');
          fieldTemplate = fieldTemplate.replace(/@@ALT/g, e.alt !== null && e.alt !== undefined ? e.alt : '');

          combinedFields.push(fieldTemplate);

        }


      } catch (error) {
        console.error(error);
      }
    }

    return combinedFields;
  }

  getDefaultValue(val, defa ? : any): any {

    var valToReplace;

    if (val !== null && val !== undefined) {
      valToReplace = val;
    } else {
      valToReplace = defa;
    }

    if (valToReplace === null || valToReplace === undefined) valToReplace = '';

    return valToReplace;
  }

  generateComponent(componentPath, name, e: FieldItem[]): string {
    var component = this.templates[componentPath]; //, 'utf-8');

    if (name === null || name === undefined) {
      throw Error('name field missing in input');
    }
    if (e === null || e === undefined) {
      throw Error('fields are missing in input');
    }

    component = component.replace(/@@SELECTOR/gi, name);

    let formInit = this.getComponentGroups(e);
    if (formInit.endsWith(",")) formInit = formInit.substring(0, formInit.length - 1);

    component = component.replace('@@INPUTFORMINIT', formInit);

    return component;
  }


  getComponentGroups(e: FieldItem[]): string {
    var formInit = "this.formBuilder.group({";

    if (e !== null && e !== undefined) {


      for (let index = 0; index < e.length; index++) {
        const x = e[index];


        if (x.children !== null && x.children !== undefined && x.children.length > 0) {

          var y = this.getComponentGroups(x.children);

          if (y !== null && y !== undefined && y.length > 0) {

            if (y.endsWith(";")) y = y.substring(0, y.length - 1);

            formInit += x.name + ': ' + y + ',';
          }
        } else {

          var validators = [];

          if (x['required'] !== null && x['required'] !== undefined && x.required === true) {
            validators.push('Validators.required');
          }

          if (x['requiredTrue'] !== null && x['requiredTrue'] !== undefined && x.requiredTrue === true) {
            validators.push('Validators.requiredTrue');
          }

          if (x['min'] !== null && x['min'] !== undefined && !isNaN(x.min)) {
            validators.push('Validators.min(' + x.min + ')');
          }

          if (x['max'] !== null && x['max'] !== undefined && !isNaN(x.max)) {
            validators.push('Validators.max(' + x.max + ')');
          }

          if (x['email'] !== null && x['email'] !== undefined) {
            validators.push('Validators.email(\'' + x.email + '\')');
          }

          if (x['minLength'] !== null && x['minLength'] !== undefined && !isNaN(x.minLength)) {
            validators.push('Validators.minLength(' + x.minLength + ')');
          }

          if (x['maxLength'] !== null && x['maxLength'] !== undefined && !isNaN(x.maxLength)) {
            validators.push('Validators.maxLength(' + x.maxLength + ')');
          }

          if (x['pattern'] !== null && x['pattern'] !== undefined && x.pattern.length > 0) {
            validators.push('Validators.pattern(\'' + x.pattern + '\')');
          }


          var required = '';

          if (validators.length > 0) {
            if (validators.length == 1) {
              required = validators[0];
            } else {
              required = 'Validators.compose(' + validators.join(',') + ')';
            }
          }

          if (required != null && required !== undefined && required.length > 0) {
            required = "," + required

            if (required.endsWith(",")) required = required.substring(0, required.length - 1);
          }


          formInit += '\n' + x.name + ': [""' + required + '],';


        }
      }
    }

    formInit += "});";

    return formInit;
  }

  showMore(item) {
    this.item = item;
    $('#myModal').modal('show');
  }
  closeShowMore() {
    this.item = null;
    $('#myModal').modal('hide');
  }



  showModal(modal: string) {

    if (this.items !== null && this.items.length > 0) {

      var r = confirm("Pending changes. Reset ?");
      if (r == true) {
        this.imported = '';
        this.reset();
        $('#' + modal +'').modal('show');
      }
    } else {
      this.imported = '';
      this.reset();
      $('#' + modal +'').modal('show');
    }
  } 
 
  import() {
    if (this.imported != null && this.imported.length > 0) {
      this.storeImportedObject('imported', this.imported);
      this.items = JSON.parse(this.imported);
      $('#importModal').modal('hide');
    }
  }

  importObject() {

    if (this.imported != null && this.imported.length > 0) {

      console.log(this.imported);
      this.items = this.parseObject(JSON.parse(this.imported), null);

      $('#importObjectModal').modal('hide');
    }
  }


  storeImportedObject(key, x) {
    if (x !== null && x !== undefined && x.length > 0) {
      var j = localStorage.getItem(key);
      var k = [];
      if (j !== null || j !== undefined || j.length > 0) {
        try {
          k = JSON.parse(j);
          if (!isArray(k)) {
            k = [];
          } else {
            if (k === null || k === undefined || k.length === 0) {
              k = [];
            }
          }

        } catch (error) {
          console.error('Local Storage item failed to parse');
        }
      }
      k.push(x);
      localStorage.setItem(key, JSON.stringify(k));
    }
  }

  parseObject(obj: any, name: string): FieldItem[] {

    const fi: FieldItem[] = [];

    if (obj !== null && obj !== undefined) {

      if (isArray(obj)) {
        for (let index = 0; index < obj.length; index++) {
          const element = obj[index];

          const x = this.parseObject(element, null);

          for (let index = 0; index < x.length; index++) {
            const u = x[index];
            fi.push(u);
          }


        }

      } else {

        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            const f = new FieldItem();
            f.name = prop;

            const x = typeof (obj[prop]);
            switch (x) {
              case 'object':
                f.children = this.parseObject(obj[prop], prop);
                f.type = 'composite';

                if (isArray(obj[prop])) {
                  f.isArray = true;
                } else {
                  f.isArray = false;
                }
                break;
              case 'number':
                f.type = 'number';
                break;
              case 'bigint':
                f.type = 'number';
                break;
              case 'boolean':
                f.type = 'checkbox';
                break;
              case 'symbol':
              case 'string':
              case 'undefined':
                f.type = 'text';
                break;
              default:
                f.type = 'text';
                break;
            }

            fi.push(f);
          }
        }
      }

    }

    return fi;
  }



  copyToClipboard(x: string) {
    navigator.clipboard.writeText(x);

  }
}






class FieldItem {
  type: string;
  label ? : string;
  name: string;
  id ? : string;
  placeholder ? : string;
  required ? : boolean;
  pattern ? : string;
  value ? : string;
  defaultVal ? : string;
  readonly ? : boolean;
  disabled ? : boolean;
  size ? : number;
  maxlength ? : number;
  autocomplete ? : string;
  novalidate ? : boolean;
  autofocus ? : true;
  action ? : string;
  formenctype ? : string;
  method ? : string;
  height ? : number;
  width ? : number;
  alt ? : string;
  min ? : number;
  max ? : number;
  multiple ? : true;
  step ? : number;
  isSmall ? : true;
  help ? : string;
  class ? : string;
  title ? : string;
  children ? : FieldItem[];
  minLength ? : number;
  maxLength ? : number;
  email ? : string;
  requiredTrue ? : boolean;
  isArray ? : boolean;
}
