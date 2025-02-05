export const generateResetPasswordEmail = (userName, otp) => {
    const otpDigits = otp.split('').map(digit => {
        return `<div style="display: inline-block; width: 40px; height: 40px; margin: 5px; border: 2px solid #4CAF50; border-radius: 5px; text-align: center; line-height: 40px; font-size: 1.5rem; font-weight: bold; color: #4CAF50;">${digit}</div>`;
    }).join('');
    return {
        body: {
            name: userName,
            intro: `You have requested to reset your password.\nHere is your 4-digit OTP to reset your password:`,
            table: {
                data: [
                    {
                        'Your OTP': `<div style="text-align: center;">${otpDigits}</div>`
                    }
                ]
            },
            outro: 'If you did not request a password reset, please ignore this email or contact support for assistance.',
        }
    };
};

export const generateWorkspaceInviteEmail = (workspace) => {
    const url = `http://localhost:5173/invite/${workspace.inviteCode}?name=${workspace.name}`;
    console.log(url);
    return {
        body: {
            intro: `You have been invited to join the workspace. Click the link below to accept the invitation:`,
            table: {
                data: [
                    {
                        'Invitation Link': `<div style="text-align: center;"><a href="${url}" target="_blank">"Click to join "</a></div>`
                    }
                ]
            },
            outro: `This is a system generated email. Please do not reply to this email.`,
        }
    }
};
