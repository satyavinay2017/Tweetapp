import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {  
  minDate = new Date(1900, 1, 1);
  maxDate = new Date();
  
  displayError = false;
  displayLoading = false;
  
  ForgotPasswordForm = this._lf.group({
    userName: [''],    
    mobilePhone:[''],
    
  });

  submit() {
    this.displayLoading = true;

    
      this._userservice
      .forgotPassword
        (
        this.ForgotPasswordForm.value.userName,        
        this.ForgotPasswordForm.value.mobilePhone        
        ).subscribe(
        (result) => {
          this._router.navigateByUrl('login');
          this.displayLoading = false;
          alert(result.password);
        },
        (error) => {
          this.displayError = true;
          this.displayLoading = false;
          alert(error.error.error.description);
        }
      );
    
    
  }


  constructor(
    private _lf: FormBuilder,
    private _userservice: UserService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('JwtToken') != null) {
      this._router.navigateByUrl('home');
    }
    
    this.ForgotPasswordForm.valueChanges.subscribe((value) => {
      this.displayError = false;
    });
  }
}
