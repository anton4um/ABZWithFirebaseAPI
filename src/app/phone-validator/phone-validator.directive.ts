import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {CheerfulUsersComponent} from '../cheerful-users/cheerful-users.component';

@Directive({
  selector: "[phoneValid]"
})
export class PhoneValidatorDirective implements OnInit{
  constructor( private elementRef: ElementRef, private renderer: Renderer2, private cheerComponent: CheerfulUsersComponent){}

  ngOnInit(){
    // if(this.elementRef.nativeElement.value.length > 1 && this.elementRef.nativeElement.value.length < 18){
    //   this.renderer.setStyle(this.elementRef.nativeElement, 'background-color' ,'blue');
    // }else{
    //   this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
    // }

    this.renderer.listen(this.elementRef.nativeElement, 'change',(event: any)=>{
      // console.log('from form Validity: ',
      //   this.cheerComponent.signupForm.get('phone').valid,
      //   'Phone Value length: ',this.cheerComponent.signupForm.get('phone').value.length);
      // if(this.elementRef.nativeElement.value.length < 15)
      // {this.elementRef.nativeElement.valid.set;
      // console.log('setted to False!! ');}
      // else
      // {this.elementRef.nativeElement.valid.set(true);
      // console.log('setted to True');}
      // console.log('processed el ref: ',this.elementRef.nativeElement.valid,' ');
    })
  }
}
