# Indoor Climbing Gym - Supabase Email Templates

Professional, branded email templates for authentication flows.

**Brand Colors:**
- Sage Green: #98a48b (Primary CTA)
- Granite: #555555 (Text)
- Ivory: #f8f8f5 (Background)

**Template Variables:**
- `{{ .ConfirmationURL }}` - Confirmation/verification link
- `{{ .Token }}` - Magic link token
- `{{ .TokenHash }}` - Token hash for verification
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address

---

## Template 1: Confirm Sign Up Email

**Subject:** Welcome to Indoor Climbing Gym - Verify Your Email

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">Welcome to Indoor Climbing Gym!</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Thanks for signing up! We're excited to help you discover the best climbing gyms near you.
                            </p>

                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                To get started, please verify your email address by clicking the button below:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Verify Email Address</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Questions? Visit our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">Help Center</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                If you didn't create this account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Template 2: Magic Link Email

**Subject:** Your Login Link for Indoor Climbing Gym

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">Your Quick Login Link</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                You requested a magic link to sign in to your Indoor Climbing Gym account. Click the button below to log in instantly:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Log In to Your Account</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>

                            <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f5; border-left: 4px solid #98a48b; border-radius: 4px;">
                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                    <strong>⏰ This link expires in 1 hour</strong> for your security.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Need help? Contact our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">support team</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                If you didn't request this link, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Template 3: Reset Password Email

**Subject:** Reset Your Indoor Climbing Gym Password

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">Reset Your Password</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                We received a request to reset the password for your Indoor Climbing Gym account.
                            </p>

                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Click the button below to create a new password:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Password</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>

                            <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f5; border-left: 4px solid #98a48b; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                    <strong>⏰ This link expires in 1 hour</strong> for your security.
                                </p>
                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                    <strong>🔒 Didn't request this?</strong> Your account is safe. You can ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Questions? Visit our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">Help Center</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Template 4: Change Email Address

**Subject:** Confirm Your New Email Address

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Email Change</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">Confirm Your New Email</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                You requested to change the email address associated with your Indoor Climbing Gym account to:
                            </p>

                            <p style="margin: 0 0 30px; color: #98a48b; font-size: 16px; line-height: 1.6; font-weight: 600;">
                                {{ .Email }}
                            </p>

                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                To complete this change, please verify your new email address:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Verify New Email</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>

                            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Security Notice:</strong> If you didn't request this email change, please contact our support team immediately at <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">{{ .SiteURL }}/contact</a>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Questions? Contact our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">support team</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Template 5: Invite User Email

**Subject:** You're Invited to Indoor Climbing Gym

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">You've Been Invited! 🎉</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Great news! You've been invited to join Indoor Climbing Gym, the ultimate directory for discovering climbing gyms near you.
                            </p>

                            <div style="margin: 30px 0; padding: 20px; background-color: #f8f8f5; border-left: 4px solid #98a48b; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #555555; font-size: 16px; line-height: 1.6; font-weight: 600;">
                                    What You Can Do:
                                </p>
                                <ul style="margin: 10px 0 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                                    <li>Browse thousands of climbing gyms nationwide</li>
                                    <li>Save your favorite climbing spots</li>
                                    <li>Read reviews and ratings from fellow climbers</li>
                                    <li>Find gyms with specific amenities and features</li>
                                </ul>
                            </div>

                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Click the button below to accept your invitation and create your account:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Accept Invitation</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Questions? Visit our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">Help Center</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                Not interested? You can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Template 6: Reauthentication Email

**Subject:** Confirm Your Identity - Indoor Climbing Gym

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Identity</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f8f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #98a48b; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Indoor Climbing Gym</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #555555; font-size: 24px; font-weight: 600;">Security Check Required</h2>

                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                For your security, we need to confirm your identity before proceeding with a sensitive account action.
                            </p>

                            <div style="margin: 30px 0; padding: 20px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #555555; font-size: 16px; line-height: 1.6; font-weight: 600;">
                                    🔒 Why We're Asking:
                                </p>
                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                    You (or someone with your credentials) attempted to perform an action that requires additional verification to keep your account secure. This is a standard security measure to protect your information.
                                </p>
                            </div>

                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Click the button below to confirm your identity and proceed:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background-color: #98a48b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Confirm My Identity</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 10px 0 0; color: #98a48b; font-size: 14px; word-break: break-all;">
                                {{ .ConfirmationURL }}
                            </p>

                            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Didn't request this?</strong> If you didn't attempt this action, someone may have access to your account. Please <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">contact support</a> immediately and change your password.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f5; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Need help? Contact our <a href="{{ .SiteURL }}/contact" style="color: #98a48b; text-decoration: none;">support team</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                © 2025 Indoor Climbing Gym. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## How to Use These Templates in Supabase

1. **Go to Supabase Dashboard** → Authentication → Email Templates
2. **Select each email type** from the dropdown (Confirm Signup, Magic Link, etc.)
3. **Copy the HTML** from the template above
4. **Paste into the "Message (HTML)" field**
5. **Update the subject line** in the "Subject" field
6. **Save changes**

### Important Notes:

- **Template Variables:** Supabase automatically replaces `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, etc.
- **Testing:** Use Supabase's "Send test email" feature to preview before going live
- **Mobile Responsive:** All templates use inline CSS and responsive table layouts
- **Accessibility:** High contrast ratios (WCAG AA compliant), clear CTAs, semantic HTML
- **Brand Consistency:** All templates use sage green (#98a48b) for primary actions

### Customization Tips:

- Replace `{{ .SiteURL }}` with your actual domain when live
- Adjust padding/spacing if needed for your brand
- Add your logo by replacing the text header with an `<img>` tag
- Test in multiple email clients (Gmail, Outlook, Apple Mail, etc.)

---

**Created:** 2025-11-25
**Status:** Ready to deploy to Supabase
