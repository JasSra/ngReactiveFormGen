import {
  Component,
  OnInit
} from '@angular/core';

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

  ngOnInit(): void {
    this.reset();
  }


  add(){
    this.items.push({
      type:"text",
      name:''
    })
  }

  reset() {
    this.outputComponent = '';
    this.outputTemplate = '';
    this.header = '';
    this.items = [];
  }
  
generate(){
  
}

}




class FieldItem {
  type: string;
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  value?: string;
  defaultVal?: string;
  readonly?: boolean;
  disabled?: boolean;
  size?: number;
  maxlength?: number;
  autocomplete?: string;
  novalidate?: boolean;
  autofocus?: true;
  action?: string;
  formenctype?: string;
  method?: string;
  height?: number;
  width?: number;
  alt?: string;
  min?: number;
  max?: number;
  multiple?: true;
  step?: number;
  isSmall?: true;
  help?: string;
  class?: string;
  title?: string;
}
