import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText, Button } from '@shared/components';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputText, Button],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        usuario: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    error: string = '';

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.error = '';

        const { usuario, password } = this.loginForm.value;

        this.authService.login(usuario, password).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.error = 'Usuario o contraseña incorrectos';
                console.error('Login error', err);
            }
        });
    }

    get usuarioError(): string {
        const control = this.loginForm.get('usuario');
        if (control?.touched && control?.hasError('required')) {
            return 'El usuario es requerido';
        }
        return '';
    }

    get passwordError(): string {
        const control = this.loginForm.get('password');
        if (control?.touched && control?.hasError('required')) {
            return 'La contraseña es requerida';
        }
        return '';
    }
}
