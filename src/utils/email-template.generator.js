export const generateResetPasswordEmail = (userName, otp) => {
    const otpDigits = otp.toString().split('').map(digit => {
        return `
            <div style="
                display: inline-block; 
                width: 48px; 
                height: 48px; 
                margin: 6px; 
                border: 2px solid #4CAF50; 
                border-radius: 8px; 
                background-color: #f9fff9; 
                text-align: center; 
                line-height: 48px; 
                font-size: 1.5rem; 
                font-weight: 600; 
                color: #2e7d32; 
                font-family: Arial, Helvetica, sans-serif;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            ">
                ${digit}
            </div>
        `;
    }).join('');

    return {
        body: {
            name: userName,
            intro: `
                <p style="font-size: 16px; color: #333;">
                    You have requested to reset your password.<br/>
                    Please use the OTP below:
                </p>
            `,
            table: {
                data: [
                    {
                        'Your OTP': `<div style="text-align: center; margin-top: 12px;">${otpDigits}</div>`
                    }
                ]
            },
            outro: `
                <p style="font-size: 14px; color: #555;">
                    If you did not request a password reset, you can safely ignore this email or 
                    <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">contact support</a>.
                </p>
            `,
        }
    };
};

export const generateWorkspaceInviteEmail = (workspace) => {
    const url = `http://localhost:5173/invite/${workspace.inviteCode}?name=${encodeURIComponent(workspace.name)}`;

    return {
        body: {
            intro: `
                <p style="font-size: 16px; color: #333;">
                    You have been invited to join the workspace <b>${workspace.name}</b>.
                </p>
                <p style="font-size: 14px; color: #555; margin-top: 4px;">
                    Click the button below to accept the invitation:
                </p>
            `,
            table: {
                data: [
                    {
                        'Invitation': `
                            <div style="text-align: center; margin-top: 16px;">
                                <a href="${url}" target="_blank" 
                                    style="
                                        display: inline-block; 
                                        padding: 12px 24px; 
                                        background-color: #4CAF50; 
                                        color: white; 
                                        text-decoration: none; 
                                        font-size: 16px; 
                                        font-weight: 600; 
                                        border-radius: 6px;
                                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                                        font-family: Arial, Helvetica, sans-serif;
                                    ">
                                    Join Workspace
                                </a>
                            </div>
                        `
                    }
                ]
            },
            outro: `
                <p style="font-size: 14px; color: #777;">
                    This is a system-generated email. Please do not reply.
                </p>
            `,
        }
    }
};
