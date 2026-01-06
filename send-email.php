<?php
// Set content type to JSON
header('Content-Type: application/json');

// Load configuration
require 'config.php';

// Load PHPMailer
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get form data
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$interest = isset($_POST['interest']) ? trim($_POST['interest']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($fullName) || empty($email) || empty($interest) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required.'
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

try {
    // Send email to company (both recipients)
    $company_mail = new PHPMailer(true);
    $company_mail->isSMTP();
    $company_mail->Host = 'smtp.gmail.com';
    $company_mail->SMTPAuth = true;
    $company_mail->Username = GMAIL_EMAIL;
    $company_mail->Password = GMAIL_APP_PASSWORD;
    $company_mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $company_mail->Port = 587;

    $company_mail->setFrom(GMAIL_EMAIL, 'Contact Form - ' . COMPANY_NAME);
    
    // Add both recipients
    foreach (RECIPIENT_EMAILS as $recipient_email) {
        $company_mail->addAddress($recipient_email);
    }
    
    $company_mail->addReplyTo($email, $fullName);

    $company_mail->isHTML(true);
    $company_mail->Subject = 'Pash Medical Solutions - New Contact Form Submission';
    $company_mail->Body = prepare_company_email($fullName, $email, $interest, $message);
    $company_mail->AltBody = strip_tags(prepare_company_email($fullName, $email, $interest, $message));

    $company_mail->send();

    // Send confirmation email to user
    $user_mail = new PHPMailer(true);
    $user_mail->isSMTP();
    $user_mail->Host = 'smtp.gmail.com';
    $user_mail->SMTPAuth = true;
    $user_mail->Username = GMAIL_EMAIL;
    $user_mail->Password = GMAIL_APP_PASSWORD;
    $user_mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $user_mail->Port = 587;

    $user_mail->setFrom(COMPANY_EMAIL, COMPANY_NAME);
    $user_mail->addAddress($email, $fullName);

    $user_mail->isHTML(true);
    $user_mail->Subject = 'Thank you for contacting Pash Medical Solutions';
    $user_mail->Body = prepare_user_email($fullName);
    $user_mail->AltBody = strip_tags(prepare_user_email($fullName));

    $user_mail->send();

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will contact you soon.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email: ' . $e->getMessage()
    ]);
}

// Function to prepare company email
function prepare_company_email($fullName, $email, $interest, $message) {
    $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $interest = htmlspecialchars($interest, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $message = nl2br($message);

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #2d3748; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #1b5e20; margin-bottom: 5px; }
        .value { color: #555; word-break: break-word; }
        .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .badge { display: inline-block; background-color: #a5d6a7; color: #1b5e20; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>Someone has reached out through the Pash Medical Solutions website</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <div class='label'>Full Name</div>
                <div class='value'>{$fullName}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email Address</div>
                <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Area of Interest</div>
                <div class='value'><span class='badge'>{$interest}</span></div>
            </div>
            
            <div class='field'>
                <div class='label'>Message</div>
                <div class='value'>{$message}</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>This is an automated email from your contact form on pashmedinnov.com</p>
            <p>&copy; 2025 Pash Medical Solutions. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
HTML;
}

// Function to prepare user confirmation email
function prepare_user_email($fullName) {
    $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #2d3748; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You, {$fullName}!</h2>
        </div>
        
        <div class='content'>
            <p>Thank you for reaching out to Pash Medical Solutions. We have received your message and will get back to you as soon as possible.</p>
            
            <p>Our team will review your inquiry and contact you within 24-48 hours.</p>
            
            <p>Best regards,<br><strong>Pash Medical Solutions Team</strong></p>
        </div>
        
        <div class='footer'>
            <p>&copy; 2025 Pash Medical Solutions. All rights reserved.</p>
            <p><a href='https://pashmedinnov.com'>Visit our website</a></p>
        </div>
    </div>
</body>
</html>
HTML;
}
?>
