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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'templater';


  outputTemplate: string;
  outputComponent: string;



  header: string;
  items: FieldItem[] = [];

  templates: any[];


  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.reset();
    this.templates = [];

    this.templates.push({
      name: 'component.map',
      value: ''
    })
    this.templates.push({
      name: 'defaultField.map',
      value: ''
    })
    this.templates.push({
      name: 'form.map',
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
      type: "text",
      name: ''
    })
  }

  reset() {
    this.outputComponent = '';
    this.outputTemplate = '';
    this.header = '';
    this.items = [];
  }

  generate() {
    let componentText = this.generateComponent('component.map', this.header, this.items);
    let combinedFields = this.generateFields(this.items);

  

    var formText = this.templates["form.map"];
    formText = formText.replace(/@@CONTENT/g, combinedFields.join('\n<br/>'));
  

    this.outputComponent = componentText;
    this.outputTemplate = formText;

  }
 
  generateFields(objectFields): any[] {

    var combinedFields = [];

    for (let index = 0; index < objectFields.length; index++) {
      const e = objectFields[index];
 
    
      try {

        console.log(e);
        if (e['name'] == null || e['name'] == undefined) {
          throw Error('name field is missing in input component');
        }
        if (e['type'] == null || e['type'] == undefined) {
          throw Error('type field is missing in input component');
        }



       var fieldTemplate = this.templates['defaultField.map'];

       console.log(fieldTemplate);

        fieldTemplate = fieldTemplate.replace(/@@ID/g, this.getDefaultValue(e.id, e.name));
        fieldTemplate = fieldTemplate.replace(/@@TYPE/g, this.getDefaultValue(e.type, 'text'));
        fieldTemplate = fieldTemplate.replace(/@@LABEL/g, (this.getDefaultValue(e.label, e.name).replace(/([A-Z])/g, " $1")).toUpperCase());
        fieldTemplate = fieldTemplate.replace(/@@TITLE/g, this.getDefaultValue(e.title));
        fieldTemplate = fieldTemplate.replace(/@@CLASS/g, this.getDefaultValue(e.class));
        fieldTemplate = fieldTemplate.replace(/@@HELPTEXT/g, this.getDefaultValue(e.help));
        fieldTemplate = fieldTemplate.replace(/@@FORMCONTROLNAME/g, this.getDefaultValue(e.name));
        fieldTemplate = fieldTemplate.replace(/@@ALT/g, e.name);


        combinedFields.push(fieldTemplate + "\n\n");

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
  generateComponent(componentPath, name,e): string {
    var component = this.templates[componentPath]; //, 'utf-8');

    //Todo: get list of all selectors in text;
    //var availableSelectors = /(@@[A-Z]+)/.exec(component);
    //console.log(availableSelectors);

    //2 selectors @@SELECTOR @@@@INPUTFORMINIT\r\n

    console.log(e);

    if (name ===null || name === undefined) {
      throw Error('name field missing in input');
    }
    if (e === null || e === undefined) {
      throw Error('fields are missing in input');
    }

    component = component.replace(/@@SELECTOR/gi, name);

    var formInit = "this.formBuilder.group({";

    for (let index = 0; index < e.length; index++) {
      const x = e[index];

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
          required = '\n\t\tValidators.compose(' + validators.join('\n\t\t,') + ')';
        }
      }

      if (required != null && required !== undefined && required.length > 0) {
        required = "," + required

        if (required.endsWith(",")) required = required.substring(0, required.length - 1);
      }


      formInit += '\n\t ' + x.name + ': [""' + required + '],';
    }

    if (formInit.endsWith(",")) formInit = formInit.substring(0, formInit.length - 1);

    formInit += "});";

    component = component.replace('@@INPUTFORMINIT', formInit);

    return component;
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
}
