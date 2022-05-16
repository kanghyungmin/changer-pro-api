function getEmailResetPwHtml(toEmail: string, code: string) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://changer-resource.s3.ap-northeast-2.amazonaws.com/eamil_image_test.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 14px;">
        <div style="padding:20px 50px 20px 50px;">
            <p style="font-size:22px;color:#000000">Reset Password</p>
            <p>You’ve requested to reset the password linked with your Changer Account.</p>
            <p>To confirm your request, please use the 6-digit code below:</p>
            <p style="color:#007EFF;
            font-weight: 600;
            font-size: 50px;">${code}</p>
            <p>The verification code will be valid for 30 minutes. 
                Please do not share this code with anyone.</p>
            <p style="margin-top:10px;">Kind Regards,</p>
            <p>Changer</p>
            <p style="margin-top:10px;">This is an automated message. Please do not reply.</p>
        </div>
        <div style="text-align:center; padding:0px 0px 0px 0px;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 8px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;
  return EMAIL_HTML;
}

function getEmailVerifyHtml(toEmail: string, code: string) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${toEmail}</span>,</p><br>
            
            Greetings from Changer.io. If you recognize this recent activity, please confirm it with the verification code. Here is your verification code:<br>

            <p style="color:#007EFF;
            font-weight: 600;
            font-size: 50px;">${code}</p>

            <br>
            If you don’t recognize this activity, please log-in to your account
            and change your password or freeze your account immediately.<br><br>
            For further help, contact <span style="color:#007EFF;">help@changer.io.</span><br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
            padding:20px;
            text-align:center;
            font-family: Volte;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailWithdrawlReqToAdmin(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hi, Operator</p>
            <p>The following request is just received</p>
            <br>
            <table border="1" width=800 style="border-collapse:collapse;">
                <tr align ="center" style="display:table-row">
                    <th colspan="4" border="0" align="center">
                        Withdrawal Request
                    </th>
                </tr>
                <tr>
                    <td width="250" align="center"> Date(UTC) </td>
                    <td width="250" align="center"> Requester </td>
                    <td width="150" align="center"> Currency </td>
                    <td width="150" align="center"> Amount </td>
                </tr>
                <tr>
                    <td align="center"> ${data.date} </td>
                    <td align="center"> ${data.requester} </td>
                    <td align="center"> ${data.currency} </td>
                    <td align="center"> ${data.amount} </td>
                </tr>

            </table>
            <br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}
function getEmailWithdrawlReqToCustomer(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${data.requester}</span>,</p><br>
            We noticed that you made a following withdrawal request.<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Currency : ${data.currency}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Amount : ${data.amount}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Address : ${data.address}<br>
            <br>
            Thanks for your patience as Changer reviews and processes your request.
            If you don’t recognize this activity, your account may have been compromised.
            <br>Please log-in to your account and change your password or freeze your account immediately.<br><br>

            You can find out details of your withdrawal request status at  "History > Withdrawals".<br>For further help, contact <span style="color:#007EFF;">help@changer.io</span>.<br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailDeptAlarm(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${toEmails[1]}</span>,</p>
            <br>
            At ${data.daytime}(UTC), your Account Value was <b>${data.acountValue} USDT</b>, and the Max Credit, which is
            ten times of your Account Value, was <b>${data.maxCredit} USDT</b>.<br><br>
            Your "Credit Used" amount was <b>${data.creditUsed} USDT</b>, and you were using <b>${data.deptRatio}%</b> of your Max Credit.<br><br>
            Check “Credit Available” to prevent unintentional liquidation of your assets.<br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailPreLiquidationAlarm(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
        <p>Hello  <span style="color:#007EFF;">${data.email}</span>,</p><br>
        At ${data.daytime}(UTC), you were using "Credit", which means that you had negative-valued assets.<br><br>

        At the approaching settlement time, 16:00(UTC), if your negative-valued assets are not cleared
        either by deposit or purchase, your positive-valued asset will be liquidated to turn your negative-valued assets back to positive.<br><br>
        
        Check “Credit Available” to prevent unintentional liquidation of your assets.<br><br>
        <p>- Changer.io Support</p> 
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailSettlementDone(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${toEmails[1]}</span>,</p>
            <br>
            At ${data.daytime}(UTC), you were using "Credit", which means that you had assets, whose value was negative.<br>
            We partially liquidated your asset to cover those negative-valued asset.<br>
            You can find out liquidation details in "Trading History".
            <br><br>
            <p>-Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailLiquidationDone(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${toEmails[1]}</span>,</p>
            <br>
            At ${data.daytime}(UTC), your Account Value was <b>${data.acountValue} USDT</b>, and  the Max Credit, which is
            which is ten times of your Account Value, was <b>${data.maxCredit} USDT</b>. Your Used Credit was <b>${data.creditUsed} USDT</b>,
            which exceeded your Max Credit. Your assets were liquidated to decrease your “Credit Used”.<br>You can check the liquidation details in “Trading History”.<br><br>

            Check “Credit Available” to prevent unintentional liquidation of your assets.<br><br>
            <p>- Changer.io Support<p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">help@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getEmailWithDraw(toEmails: string[], data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${data.email}</span></p>
            <br>
            We executed your following withdrawal request.<br>
            
            &nbsp;&nbsp;&nbsp;&nbsp;- Currency : ${data.currency}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Amount : ${data.amount}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Address : ${data.address}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;- Tx ID : ${data.txid}
            <br><br>
            If you don’t recognize this activity, your account may have been compromised.
            <br>Please log in to your account and change your password or freeze your account immediately.<br><br>

            
            You can find out details of p2p network status of your withdrawal request at  "History > Withdrawals"<br><br>

            For further help, contact <span style="color:#007EFF;">help@changer.io</span>.
            
            <br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}
function getVerifyForRegister(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
                        <div style="height:125px;">
                            <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
                        </div>
                        <div style="
                        background: #FEFEFE;
                        box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
                        border-radius: 0px 0px 0px 0px;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        ">
                        <div style="padding:40px 50px 20px 50px;">
                            <p>Hello <span style="color:#007EFF;">${data.toEmail},</span></p><br>
                            Please enter the following confirmation code into the verification prompt on Changer to confirm your account:<br>
                            <p style="color:#007EFF;
                            font-weight: 600;
                            font-size: 50px;">${data.verifyKey}</p>
                            
                            <p>- Changer.io Support</p>
                        </div>
                        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
                        <div style="
                        padding:20px;
                        text-align:center;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                            font-size: 14px;
                            line-height: 18px;">
                            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
                            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
                            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
                        </div>
                    </div>
                    </div>`;

  return EMAIL_HTML;
}
function getSignUp(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
                        <div style="height:125px;">
                            <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
                        </div>
                        <div style="
                        background: #FEFEFE;
                        box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
                        border-radius: 0px 0px 0px 0px;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        ">
                        <div style="padding:40px 50px 20px 50px;">
                            <p>Hello <span style="color:#007EFF;">${data.toEmail},</span></p><br>
                            Welcome to Changer! Your registration on Changer is complete.<br>
                            Log-in and begin using <a href="https://changer.io/" target="_self">Changer</a> now!<br><br>
                            <p>- Changer.io Support</p>

                        </div>
                        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
                        <div style="
                        padding:20px;
                        text-align:center;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                            font-size: 14px;
                            line-height: 18px;">
                            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
                            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
                            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
                        </div>
                    </div>
                    </div>`;

  return EMAIL_HTML;
}

function getEableOtp(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
                        <div style="height:125px;">
                            <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
                        </div>
                        <div style="
                        background: #FEFEFE;
                        box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
                        border-radius: 0px 0px 0px 0px;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        ">
                        <div style="padding:40px 50px 20px 50px;">
                            <p>Hello <span style="color:#007EFF;">${data.toEmail},</span></p><br>
                            This is to notify you that your 2FA OTP was enabled at ${data.time} UTC.<br><br>
                            If you don’t recognize this activity, your account may have been compromised. <br>Please log in to your account and change your password or freeze your account immediately.<br><br>
                            For further help, contact <span style="color:#007EFF;">help@changer.io</span>.<br><br>
                            <p>- Changer.io Support</p>
                        </div>
                        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
                        <div style="
                        padding:20px;
                        text-align:center;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                            font-size: 14px;
                            line-height: 18px;">
                            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
                            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
                            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
                        </div>
                    </div>
                    </div>`;

  return EMAIL_HTML;
}
function getDisableOtp(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
                        <div style="height:125px;">
                            <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
                        </div>
                        <div style="
                        background: #FEFEFE;
                        box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
                        border-radius: 0px 0px 0px 0px;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        ">
                        <div style="padding:40px 50px 20px 50px;">
                            <p>Hello <span style="color:#007EFF;">${data.toEmail},</span></p><br>
                            We noticed that your password was changed at ${data.time} UTC.<br>
                            If you don’t recognize this activity, your account may have been compromised. <br>Please log in to your account and change your password or freeze your account immediately.<br><br>

                            For further help, contact <span style="color:#007EFF;">help@changer.io.</span><br><br>

                            <p>- Changer.io Support</p>
                        </div>
                        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
                        <div style="
                        padding:20px;
                        text-align:center;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                            font-size: 14px;
                            line-height: 18px;">
                            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
                            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
                            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
                        </div>
                    </div>
                    </div>`;

  return EMAIL_HTML;
}

function getChangePW(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
                        <div style="height:125px;">
                            <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
                        </div>
                        <div style="
                        background: #FEFEFE;
                        box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
                        border-radius: 0px 0px 0px 0px;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        ">
                        <div style="padding:40px 50px 20px 50px;">
                            <p>Hello <span style="color:#007EFF;">${data.toEmail},</span></p><br>
                            We noticed that your password was changed at ${data.time} UTC.<br><br>
                            
                            If you don’t recognize this activity, your account may have been compromised.
                            <br>Please log in to your account and change your password or freeze your account immediately.<br><br>

                            For further help, contact <span style="color:#007EFF;">help@changer.io</span>.
                            <br><br>
                            <p>- Changer.io Support</p>
                        </div>
                        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
                        <div style="
                        padding:20px;
                        text-align:center;
                        font-family: Volte;
                        font-style: normal;
                        font-weight: normal;
                            font-size: 14px;
                            line-height: 18px;">
                            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
                            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
                            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
                        </div>
                    </div>
                    </div>`;

  return EMAIL_HTML;
}

function getFindPW(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${data.toEmail}</span>,</p><br>
            Please enter the following confirmation code into the verification prompt on Changer to change your password:
            <p style="color:#007EFF;
            font-weight: 600;
            font-size: 50px;">${data.code}</p>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getDeposit(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${data.toEmail}</span>,</p><br>
                Your deposit was confirmed.<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- Currency : ${data.currency}<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- Amount : ${data.amount}
            <br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

function getDiff(data: any) {
  const EMAIL_HTML = `<div style="background: #0D1B26;box-shadow: 1px 1px 4px rgba(0, 0 0, 0.25); width: 1000px;">
    <div style="height:125px;">
        <img width=100% height=100% style="margin: 0px 0px 0px 0px;" src="https://d3b3jih2de01vz.cloudfront.net/email_header_img.jpg" />
    </div>
    <div style="
    background: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.25);
    border-radius: 0px 0px 0px 0px;
    font-family: Volte;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    ">
        <div style="padding:40px 50px 20px 50px;">
            <p>Hello <span style="color:#007EFF;">${data.toEmail}</span>,</p><br>
            We have noticed that your account was accessed from a new IP address(<b>${data.accessIP}</b>)
            at ${data.time}(UTC).<br>
            If you did not conduct this operation, your account may be compromised.
            <br>Please log in to your account and change your password or freeze your account immediately.<br><br>
            For further help, contact <span style="color:#007EFF;">help@changer.io</span>.<br><br>
            <p>- Changer.io Support</p>
        </div>
        <p style="width:100%; height:1px; background: #C4C4C4;"></p>
        <div style="
        padding:20px;
        text-align:center;
        font-family: Volte;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;">
            <p>ⓒ 2021 Changer.io. All Rights Reserved.</p>
            <p>URL <span style="margin-left:10px;color:#007EFF;">www.changer.io</span></p>
            <p>E-mail<span style="margin-left:10px;">support@changer.io</span></p>
        </div>
    </div>

</div>`;

  return EMAIL_HTML;
}

export {
  getEmailVerifyHtml,
  getEmailResetPwHtml,
  getEmailWithdrawlReqToAdmin, //okay
  getEmailWithdrawlReqToCustomer,
  getEmailDeptAlarm, //okay
  getEmailPreLiquidationAlarm,
  getEmailSettlementDone, //okay
  getEmailLiquidationDone, //okay
  getEmailWithDraw,
  getVerifyForRegister,
  getSignUp,
  getEableOtp,
  getDisableOtp,
  getChangePW,
  getFindPW,
  getDeposit,
  getDiff,
};
