import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  isHTML?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // In production, this would integrate with a real email service (SendGrid, AWS SES, etc.)
  
  sendEmail(options: EmailOptions): Observable<{ success: boolean; message: string }> {
    console.log('=== EMAIL SENT ===');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.body}`);
    console.log('==================');

    // Simulate email sending delay
    return of({
      success: true,
      message: 'Email sent successfully'
    }).pipe(delay(500));
  }

  sendOTPEmail(email: string, otp: string): Observable<{ success: boolean; message: string }> {
    const body = `
      <h2>BioStream - Your OTP Code</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for logging into BioStream is:</p>
      <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <br>
      <p>Best regards,<br>BioStream Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'BioStream - Your OTP Code',
      body,
      isHTML: true
    });
  }

  sendVerificationEmail(email: string, verificationLink: string): Observable<{ success: boolean; message: string }> {
    const body = `
      <h2>BioStream - Email Verification</h2>
      <p>Hello,</p>
      <p>Thank you for registering with BioStream!</p>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <br>
      <p>Best regards,<br>BioStream Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'BioStream - Verify Your Email',
      body,
      isHTML: true
    });
  }

  sendWelcomeEmail(email: string, firstName: string, role: string): Observable<{ success: boolean; message: string }> {
    const body = `
      <h2>Welcome to BioStream!</h2>
      <p>Hello ${firstName},</p>
      <p>Your email has been verified successfully!</p>
      <p>You are now registered as a <strong>${role}</strong>.</p>
      <p>You can now log in to your account and start using BioStream.</p>
      <p><a href="${window.location.origin}/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Login Now</a></p>
      <br>
      <p>Best regards,<br>BioStream Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to BioStream!',
      body,
      isHTML: true
    });
  }

  sendPasswordResetEmail(email: string, resetLink: string): Observable<{ success: boolean; message: string }> {
    const body = `
      <h2>BioStream - Password Reset</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>BioStream Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'BioStream - Password Reset',
      body,
      isHTML: true
    });
  }
}
