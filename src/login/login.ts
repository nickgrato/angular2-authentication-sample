import { Component, OnInit, EventEmitter, Input, Output  } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { FormBuilder, FormGroup, FormControl,  Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
// DEBOUNCE 
import 'rxjs/add/operator/debounceTime';

const styles   = require('./login.css');
const template = require('./login.html');


@Component({
  selector: 'login',
  template: template,
  styles: [ styles ]
})
export class Login implements OnInit {

  loginForm: FormGroup;
 

  //Username
  userNameMessage: any[];  
  userNameError: boolean = false;

  //password
  passwordError: boolean;
  
  
//ANY VALIDATION OBJECT
  private validationMessages = {
        // these validation messages could easily be populated with a backend server. 
        required: 'please enter your Login',
        pattern: 'please enter a valid email address',
        minlength: 'I need more letters please'
   }


  constructor( public router: Router, 
               public http: Http,
               private fb: FormBuilder ) {}


  ngOnInit(){
          
          ///////////////////////////////////////////////
          // Creating the Form Group and Form Controls //
          ///////////////////////////////////////////////
          this.loginForm = this.fb.group({
              userName: ['', [Validators.minLength(2), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
              password: ['',[Validators.required]], 
          });

          const userNameControl = this.loginForm.get('userName');
          userNameControl.valueChanges.debounceTime(1000)
                    .subscribe( value =>  this.userNameMessage = this.setMessage(userNameControl, this.validationMessages, 'userNameError' ));

          // const passwordControl = this.loginForm.get('password');
          // passwordControl.valueChanges.debounceTime(1000)
          //           .subscribe( value =>  this.validationMessage = this.setMessage(passwordControl, this.validationMessages, 'passwordError' ));
  }


  login() {
    
    // GET USER NAME AND PASSWORD TO SEND TO SERVER.
    let body = { 'username': this.loginForm.get('userName').value , 
                 'password':this.loginForm.get('password').value }; 
    
    this.http.post('http://localhost:3001/sessions/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          //  SET ID TOKEN IN LOCAL STORE. 
          localStorage.setItem('id_token', response.json().id_token);
          // ROUTE LOGGED IN USER TO THE HOME PAGE. 
          this.router.navigate(['home']);
        },
        error => {
          // ALERT ERROR - NO ROUTING
          alert(error.text());
          console.log(error.text());
        }
      );

  }


  signup(event) {
    event.preventDefault();
    this.router.navigate(['signup']);
  }



  setMessage(control: AbstractControl, messages: any, errorId: string): any[] {
        //clear left over messages. If is has one
       
        this[errorId] = false;
    
        //put loguc here for input status, if it is touched or has changes and has erros then ....
        if ((control.touched || control.dirty) && control.errors) {
            
             this[errorId] = true;
             
            //to return an array of the error validation collection keys
            // Object.keys(c.errors) returns the key so in this case "pattern" or "require"

                return Object.keys(control.errors)
                //['require']
                .map(key => 
                // select the 'require' message from the validationMessages

                //Note: the map section is only here to handle mutiple error at once.
                // it is going to take each key in the and return a string in its place. 
                
                messages[key] )
                // ['please enter your email address']
        }
    }


}




@Component({
  selector: 'ts-textbox',
  styles: [ styles ],
  template: `
            <!-- error message -->
            <span class="help-block" *ngIf="hasError">
                          <p *ngFor="let message of messages">{{ message }}</p>
            </span>
            <div class="form-group" [ngClass]="{'has-error': hasError }">
              <label [ngClass]="{'has-error': hasError }" [attr.for]="inputFor">Username</label>
               <ng-content></ng-content>
             </div>`
})

export class TextBoxComponent implements OnInit {
  // @Input() className: string;
  // @Input() type: string;
  // @Input() identification: string;

  // // the name of the even handler on the component selector
  // @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

   @Input() inputFor: string;
   @Input() hasError: boolean;
   @Input() messages: any[];
   
  constructor() { }

  ngOnInit() {
    
    //for some reason this needs to be initiated to false from here. 
    this.hasError = false;
  }


}