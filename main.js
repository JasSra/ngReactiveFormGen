var process = require('process');
var fs = require('fs');

console.log('Starting Angular Template Generator');
console.log(process.cwd());
console.log('Validating args');
var args = process.argv;

if (args == null || args == undefined || args.length < 3) {
    console.error("Missing input arguments. Use syntax: node main myfile.json");
    return;
}

var input = args[2];
var output = "";

if (args.length > 3) {
    output = args[3];
}

console.log('Input file : ' + input);

fs.stat(input, (a, b) => {

    if (a) throw a;

    fs.readFile(input, 'utf-8', (err, data) => {
        if (err) throw err;

        var obj = JSON.parse(data);

        var objectFields = obj.fields

        var componentText = generateComponent('./templates/component.map', obj)

        var combinedFields = generateFields(objectFields);       

        console.log('-----------------------');
        console.log('Component Generated');
        console.log('-----------------------');
        console.log(componentText);
        console.log('-----------------------');
        console.log('Form Generated');
        console.log('-----------------------');

        var formText = fs.readFileSync('./templates/form.map','utf-8');
        formText = formText.replace(/@@CONTENT/g,combinedFields.join('\n<br/>'));
        console.log(formText);


        var outputComponentFile = obj.name + ".component.ts";
        var outputTemplateFile =  obj.name + ".component.html"; 

        
        fs.writeFile(outputComponentFile,componentText,{encoding:'utf8',flag:'w'},()=> console.log('Component File saved: ' + outputComponentFile));
        fs.writeFile(outputTemplateFile,formText,{encoding:'utf8',flag:'w'},()=> console.log('Template File saved: ' + outputTemplateFile));
         
    });
});

function generateFields(objectFields){

    var combinedFields = [];

    for (let index = 0; index < objectFields.length; index++) {
        const e = objectFields[index];
        
        var fieldTemplate = '';
        var fieldTemplatePath = './templates/' + e.type.toLowerCase() + ".map";
        
        try {

            if (e['name'] == null || e['name'] == undefined) throw Error('name field is missing in input');
            if (e['type'] == null || e['type'] == undefined) throw Error('type field is missing in input');
          

            if (fs.existsSync(fieldTemplatePath)) {
                fieldTemplate = fs.readFileSync(fieldTemplatePath, 'utf-8');
            } else {
                fieldTemplate = fs.readFileSync('./templates/defaultField.map', 'utf-8');
                type = '';
            }
      
            fieldTemplate = fieldTemplate.replace(/@@ID/g,getDefaultValue(e.id,e.name));
            fieldTemplate = fieldTemplate.replace(/@@TYPE/g,getDefaultValue(e.type,'text'));
            fieldTemplate = fieldTemplate.replace(/@@LABEL/g,(getDefaultValue(e.label,e.name).replace(/([A-Z])/g, " $1")).toUpperCase());
            fieldTemplate = fieldTemplate.replace(/@@TITLE/g,getDefaultValue(e.title));
            fieldTemplate = fieldTemplate.replace(/@@CLASS/g,getDefaultValue(e.class));
            fieldTemplate = fieldTemplate.replace(/@@HELPTEXT/g,getDefaultValue(e.help));
            fieldTemplate = fieldTemplate.replace(/@@FORMCONTROLNAME/g,getDefaultValue(e.name));
            fieldTemplate = fieldTemplate.replace(/@@ALT/g,e.name);

            switch (e.type) {

                case 'checkbox':
                    break;
                case 'color':
                    break;
                case 'date':
                    break;
                case 'date-local':
                    break;
                case 'email':
                    break;
                case 'file':
                    break;
                case 'hidden':
                    break;
                case 'image':
                    fieldTemplate = fieldTemplate.replace(/@@ALT/g, e.alt);
                    break;
                case 'month':
                    break;
                case 'number':
                    break;
                case 'password':
                    break;
                case 'radio':
                    break;
                case 'range':
                    break;
                case 'search':
                    break;
                case 'tel':
                    break;
                case 'text':
                    break;
                case 'time':
                    break;
                case 'url':
                    break;
                case 'week':
                    break;
                default:
                    break;
            }


            combinedFields.push(fieldTemplate + "\n\n");

        } catch (error) {
            console.error(error);
        }
    }

    return combinedFields;
}
function getDefaultValue(val,defa) {

    var valToReplace;

    if(val!==null && val!==undefined){
        valToReplace = val;
    }else{
        valToReplace = defa;
    }

    if(valToReplace===null || valToReplace===undefined) valToReplace='';

    return  valToReplace;
}
function generateComponent(componentPath, e) {
    var component = fs.readFileSync(componentPath, 'utf-8');

    //Todo: get list of all selectors in text;
    //var availableSelectors = /(@@[A-Z]+)/.exec(component);
    //console.log(availableSelectors);

    //2 selectors @@SELECTOR @@@@INPUTFORMINIT\r\n

    if (e['name'] == null || e['name'] == undefined) throw Error('name field missing in input');
    if (e['fields'] == null || e['fields'] == undefined) throw Error('fields are missing in input');

    component = component.replace(/@@SELECTOR/gi, e.name);

    var formInit = "this.formBuilder.group({";

    for (let index = 0; index < e.fields.length; index++) {
        const x = e.fields[index];

        var validators = [];

        if (x['required'] !== null && x['required'] !== undefined & x.required === true) {
            validators.push('Validators.required');
        }

        if (x['requiredTrue'] !== null && x['requiredTrue'] !== undefined & x.requiredTrue === true) {
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