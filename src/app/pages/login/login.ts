import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = signal(false);
  isSubmitting = signal(false);
  submittedFields = signal<string[]>([]);

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false],
      },
      { updateOn: 'blur' }
    );
  }

  togglePassword(): void {
    this.showPassword.update(prev => !prev);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.loginForm.value;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', {
        email: formData.email,
        rememberMe: formData.rememberMe,
      });
      // Call AuthService to set isLoggedIn to true
      this.authService.login(formData.email, formData.password);
      this.isSubmitting.set(false);
      // Navigate to dashboard on successful login
      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}
