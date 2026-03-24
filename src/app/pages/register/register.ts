import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
        updateOn: 'blur',
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (password && confirmPassword && password === confirmPassword) {
      control.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword.update(prev => !prev);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(prev => !prev);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (!password) return 'empty';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'fair';
    if (strength <= 4) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts: { [key: string]: string } = {
      empty: '',
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong',
    };
    return texts[strength] || '';
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const formData = this.registerForm.value;

    try {
      // Firebase authentication - create new user
      await this.authService.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      // Navigate to dashboard on successful registration
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Error message is already set in AuthService, but we'll also capture it here
      this.errorMessage.set(this.authService.getErrorMessage());
      console.error('Registration error:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
    this.authService.clearErrorMessage();
  }
}
